import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListPlus, LoaderCircle, Play, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  hymnImageUrl,
  hymnSlides,
  loadBundledHymns,
  loadCustomHymns,
  type Hymn,
} from "@/lib/harpa";
import { usePresentation } from "@/lib/presentation";
import { normalize } from "@/lib/bible";

export const Route = createFileRoute("/harpa")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Harpa — Assembleia de Deus Renascer" },
      {
        name: "description",
        content:
          "Pesquise hinos por número, título ou palavra e envie cada estrofe para a apresentação.",
      },
      { property: "og:title", content: "Harpa — Assembleia de Deus Renascer" },
      { property: "og:description", content: "Hinos organizados em telas por estrofe e refrão." },
    ],
  }),
  component: HarpaPage,
});

function HarpaPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/harpa" });
  const { addSlides, presentSequence } = usePresentation();
  const [term, setTerm] = useState(q ?? "");
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Hymn | null>(null);

  useEffect(() => {
    const custom = loadCustomHymns();
    if (custom.length) {
      setHymns(custom);
      setLoading(false);
      return;
    }
    void loadBundledHymns()
      .then(setHymns)
      .catch(() => toast.error("Não foi possível carregar os hinos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => setTerm(q ?? ""), [q]);

  const results = useMemo(() => {
    const needle = normalize(term.replace(/^(hino|harpa)\s*/i, ""));
    if (!needle) return hymns;
    return hymns.filter(
      (h) =>
        String(h.number) === needle ||
        normalize(h.title).includes(needle) ||
        h.stanzas.some((s) => normalize(s.join(" ")).includes(needle)) ||
        (h.chorus && normalize(h.chorus.join(" ")).includes(needle)),
    );
  }, [term, hymns]);

  const slidesOf = (hymn: Hymn) =>
    hymnSlides(hymn).map((s) => {
      const image = hymnImageUrl(hymn.image);
      return {
        kind: "hymn" as const,
        reference: `Hino ${hymn.number} — ${hymn.title}`,
        label: `Hino ${hymn.number} — ${s.label}`,
        lines: s.lines,
        theme: hymn.theme,
        ...(image ? { image } : {}),
      };
    });

  return (
    <AppShell
      title="Harpa"
      subtitle={loading ? "Carregando hinos..." : `${hymns.length} hinos disponíveis`}
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
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Número, título ou palavra..."
            aria-label="Pesquisar na Harpa"
            className="glass-soft h-10 w-full rounded-full pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </form>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((hymn) => (
          <article
            key={hymn.number}
            className="glass-soft group overflow-hidden rounded-2xl border border-glass-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <button
              onClick={() => setOpen(hymn)}
              className="relative block h-40 w-full overflow-hidden text-left"
            >
              {hymnImageUrl(hymn.image) && (
                <img
                  src={hymnImageUrl(hymn.image)}
                  alt={`Cena inspirada no hino ${hymn.number}, ${hymn.title}`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="photo-lift absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <span className="relative flex h-full flex-col justify-end p-4">
                <span className="font-display text-xs uppercase tracking-[0.25em] text-primary">
                  Hino {hymn.number}
                </span>
                <span className="font-display text-base font-medium text-foreground">
                  {hymn.title}
                </span>
              </span>
            </button>
            <div className="flex items-center gap-2 bg-card/60 px-4 py-3">
              <span className="flex-1 text-xs text-muted-foreground">
                {hymn.stanzas.length} estrofes{hymn.chorus ? " • com refrão" : ""}
              </span>
              <button
                onClick={() => {
                  addSlides(slidesOf(hymn));
                  toast.success(`Hino ${hymn.number} adicionado`);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ListPlus className="size-3.5" /> Adicionar
              </button>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> Carregando hinos...
        </div>
      )}
      {!loading && results.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum hino encontrado.</p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="glass-panel animate-rise max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {hymnImageUrl(open.image) && (
              <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl sm:h-56">
                <img
                  src={hymnImageUrl(open.image)}
                  alt={`Cena inspirada no hino ${open.number}, ${open.title}`}
                  width={1280}
                  height={720}
                  decoding="async"
                  className="photo-lift absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
            )}
            <header className="mb-5">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-primary">
                Hino {open.number}
              </p>
              <h2 className="font-display text-2xl font-semibold">{open.title}</h2>
              {open.demo && (
                <p className="mt-1 text-xs text-muted-foreground">Letra de demonstração</p>
              )}
            </header>


            <ul className="grid gap-3">
              {hymnSlides(open).map((slide, i) => (
                <li
                  key={i}
                  className="glass-soft group/slide relative min-h-48 overflow-hidden rounded-xl"
                >
                  {hymnImageUrl(open.image) && (
                    <img
                      src={hymnImageUrl(open.image)}
                      alt=""
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                      className="photo-lift absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-500 group-hover/slide:scale-[1.02]"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-card/55" />
                  <div className="relative p-4">
                    <div className="mb-3 flex items-center gap-3">
                    <span className="font-display text-xs uppercase tracking-[0.2em] text-primary">
                      {slide.label}
                    </span>
                    <span className="flex-1" />
                    <button
                      onClick={() => {
                        const selectedSlide = slidesOf(open)[i];
                        if (!selectedSlide) return;
                        addSlides([selectedSlide]);
                        toast.success("Adicionado à apresentação");
                      }}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => {
                        const hymnSequence = slidesOf(open);
                        if (!hymnSequence[i]) return;
                        presentSequence(hymnSequence, i);
                        navigate({ to: "/apresentacao" });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    >
                      <Play className="size-3" /> Apresentar
                    </button>
                    </div>
                    <div className="verse-preview-copy border-l-2 border-primary/55 pl-4">
                      {slide.lines.map((line, j) => (
                        <p key={j} className="text-sm leading-relaxed text-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(null)}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  addSlides(slidesOf(open));
                  toast.success(`Hino ${open.number} adicionado`);
                  setOpen(null);
                }}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Adicionar hino completo
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
