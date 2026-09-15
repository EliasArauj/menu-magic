import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ListPlus, Play, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  BIBLE_VERSION,
  loadBibleIndex,
  loadBook,
  normalize,
  parseReference,
  referenceLabel,
  searchBibleText,
  type BookIndex,
} from "@/lib/bible";
import { imageForBook, themeForBook } from "@/lib/imagery";
import { usePresentation } from "@/lib/presentation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biblia")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Bíblia — Assembleia de Deus Renascer" },
      {
        name: "description",
        content:
          "Consulte a Bíblia por testamento, livro, capítulo, versículo ou palavra e envie para a apresentação.",
      },
      { property: "og:title", content: "Bíblia — Assembleia de Deus Renascer" },
      {
        property: "og:description",
        content: "Busca por referência ou palavra e envio direto para o telão.",
      },
    ],
  }),
  component: BibliaPage,
});

function BibliaPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/biblia" });
  const { addSlides, presentNow, presentSequence } = usePresentation();
  const [testament, setTestament] = useState<"AT" | "NT">("AT");
  const [selected, setSelected] = useState<{ abbrev: string; index: number } | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [term, setTerm] = useState(q ?? "");
  const [submitted, setSubmitted] = useState(q ?? "");
  const searchRef = useRef<HTMLInputElement>(null);

  const booksQuery = useQuery({ queryKey: ["bible-index"], queryFn: loadBibleIndex });
  const books = booksQuery.data ?? [];

  const bookQuery = useQuery({
    queryKey: ["bible-book", selected?.abbrev],
    queryFn: () => {
      if (!selected) throw new Error("Selecione um livro");
      return loadBook(selected.abbrev);
    },
    enabled: !!selected,
  });

  useEffect(() => {
    setTerm(q ?? "");
    setSubmitted(q ?? "");
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const parsed = useMemo(
    () => (submitted && books.length ? parseReference(submitted, books) : null),
    [submitted, books],
  );

  useEffect(() => {
    if (!parsed) return;
    const index = books.findIndex((b) => b.abbrev === parsed.book.abbrev);
    setSelected({ abbrev: parsed.book.abbrev, index });
    setChapter(parsed.chapter);
    setTestament(parsed.book.testament);
  }, [parsed, books]);

  const wordQuery = useQuery({
    queryKey: ["bible-search", submitted],
    queryFn: () => searchBibleText(submitted),
    enabled: !!submitted && !parsed && submitted.trim().length >= 3,
  });

  const filteredBooks = books.filter((b) => b.testament === testament);
  const activeBook = selected ? books[selected.index] : null;

  const makeSlide = (book: BookIndex, ch: number, verse: number, text: string, index: number) => ({
    kind: "verse" as const,
    reference: referenceLabel(book.name, ch, verse),
    label: referenceLabel(book.name, ch, verse),
    lines: splitVerse(text),
    theme: themeForBook(book.abbrev, index),
  });

  const chapterSlides = useMemo(() => {
    if (!activeBook || !chapter || !selected) return [];
    const verses = bookQuery.data?.chapters[chapter - 1] ?? [];
    return verses.map((text, index) =>
      makeSlide(activeBook, chapter, index + 1, text, selected.index),
    );
  }, [activeBook, bookQuery.data, chapter, selected]);

  return (
    <AppShell
      title="Bíblia"
      subtitle={BIBLE_VERSION}
      actions={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q: term.trim() || undefined } });
          }}
          className="relative w-full max-w-md"
        >
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.6}
          />
          <input
            ref={searchRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="João 3:16, Salmos 23, amor..."
            aria-label="Pesquisar na Bíblia"
            className="glass-soft h-10 w-full rounded-full pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </form>
      }
    >
      {/* Resultados de pesquisa por palavra */}
      {submitted && !parsed && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Resultados para “{submitted}”
          </h2>
          {wordQuery.isFetching && <p className="text-sm text-muted-foreground">Pesquisando…</p>}
          {!wordQuery.isFetching && (wordQuery.data?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum versículo encontrado.</p>
          )}
          <ul className="grid gap-2">
            {wordQuery.data?.map((r) => {
              const index = books.findIndex((b) => b.abbrev === r.abbrev);
              const book = books[index];
              if (!book) return null;
              return (
                <li
                  key={`${r.abbrev}-${r.chapter}-${r.verse}`}
                  className="glass-soft flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
                >
                  <span className="w-40 shrink-0 font-display text-sm text-primary">
                    {referenceLabel(r.book, r.chapter, r.verse)}
                  </span>
                  <p className="min-w-0 flex-1 text-sm text-foreground/90">{r.text}</p>
                  <SlideActions
                    onAdd={() => {
                      addSlides([makeSlide(book, r.chapter, r.verse, r.text, index)]);
                      toast.success("Adicionado à apresentação");
                    }}
                    onPresent={() => {
                      presentNow(makeSlide(book, r.chapter, r.verse, r.text, index));
                      navigate({ to: "/apresentacao" });
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Navegação por testamento / livro / capítulo */}
      {!selected && (
        <>
          <div className="mb-5 inline-flex rounded-full glass-soft p-1">
            {(["AT", "NT"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTestament(t)}
                className={cn(
                  "rounded-full px-5 py-2 font-display text-xs uppercase tracking-[0.18em] transition-colors",
                  testament === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {filteredBooks.map((book) => {
              const index = books.findIndex((b) => b.abbrev === book.abbrev);
              return (
                <button
                  key={book.abbrev}
                  onClick={() => {
                    setSelected({ abbrev: book.abbrev, index });
                    setChapter(null);
                  }}
                  className="group relative h-28 overflow-hidden rounded-2xl border border-glass-border text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <img
                    src={imageForBook(book.abbrev, index)}
                    alt=""
                    loading="lazy"
                    className="photo-lift absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="stage-veil absolute inset-0" />
                  <span className="relative flex h-full flex-col justify-end p-3">
                    <span className="font-display text-sm font-medium text-stage-foreground">
                      {book.name}
                    </span>
                    <span className="text-[11px] text-stage-foreground/70">
                      {book.chapters.length} capítulos
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {selected && activeBook && (
        <>
          <button
            onClick={() => (chapter ? setChapter(null) : setSelected(null))}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" /> {chapter ? activeBook.name : "Todos os livros"}
          </button>

          <h2 className="mb-4 font-display text-2xl font-semibold">
            {activeBook.name}
            {chapter ? ` ${chapter}` : ""}
          </h2>

          {!chapter && (
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-16">
              {activeBook.chapters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setChapter(i + 1)}
                  className="glass-soft rounded-xl py-3 text-sm transition-colors hover:bg-primary/15 hover:text-primary"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {chapter && (
            <>
              {chapterSlides.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      addSlides(chapterSlides);
                      toast.success(`${activeBook.name} ${chapter} adicionado versículo por versículo`);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <ListPlus className="size-4" /> Adicionar capítulo
                  </button>
                  <button
                    onClick={() => {
                      presentSequence(chapterSlides);
                      navigate({ to: "/apresentacao" });
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <Play className="size-4" /> Apresentar capítulo
                  </button>
                </div>
              )}
              <ul className="grid gap-2">
              {(bookQuery.data?.chapters[chapter - 1] ?? []).map((text, i) => (
                <li
                  key={i}
                  className="glass-soft flex flex-wrap items-start gap-3 rounded-xl px-4 py-3"
                >
                  <span className="w-8 shrink-0 pt-0.5 text-right font-display text-sm text-primary">
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/90">{text}</p>
                  <SlideActions
                    onAdd={() => {
                      addSlides([makeSlide(activeBook, chapter, i + 1, text, selected.index)]);
                      toast.success("Adicionado à apresentação");
                    }}
                    onPresent={() => {
                      presentSequence(chapterSlides, i);
                      navigate({ to: "/apresentacao" });
                    }}
                  />
                </li>
              ))}
              {bookQuery.isLoading && (
                <li className="text-sm text-muted-foreground">Carregando capítulo…</li>
              )}
              </ul>
            </>
          )}
        </>
      )}

      {booksQuery.isLoading && <p className="text-sm text-muted-foreground">Carregando Bíblia…</p>}
    </AppShell>
  );
}

function SlideActions({ onAdd, onPresent }: { onAdd: () => void; onPresent: () => void }) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <button
        onClick={onAdd}
        aria-label="Adicionar à apresentação"
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <ListPlus className="size-3.5" /> Adicionar
      </button>
      <button
        onClick={onPresent}
        aria-label="Apresentar agora"
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        <Play className="size-3.5" /> Apresentar
      </button>
    </span>
  );
}

/** Divide o versículo em linhas equilibradas para leitura à distância. */
function splitVerse(text: string): string[] {
  const words = text.split(/\s+/);
  if (words.length <= 12) return [text];
  const perLine = Math.ceil(words.length / Math.ceil(words.length / 9));
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    lines.push(words.slice(i, i + perLine).join(" "));
  }
  return lines;
}

export { normalize };
