export type Testament = "AT" | "NT";

export interface BookIndex {
  abbrev: string;
  name: string;
  testament: Testament;
  /** Quantidade de versículos por capítulo. */
  chapters: number[];
}

export interface BookContent {
  abbrev: string;
  name: string;
  testament: Testament;
  chapters: string[][];
}

export interface VerseRef {
  abbrev: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export const BIBLE_VERSION = "Almeida (domínio público)";

let indexCache: BookIndex[] | null = null;
const bookCache = new Map<string, BookContent>();
let fullCache: Record<string, string[][]> | null = null;

export async function loadBibleIndex(): Promise<BookIndex[]> {
  if (indexCache) return indexCache;
  const res = await fetch("/bible/index.json");
  if (!res.ok) throw new Error("Não foi possível carregar a Bíblia");
  indexCache = (await res.json()) as BookIndex[];
  return indexCache;
}

// Arquivos são nomeados apenas com caracteres ASCII para evitar problemas de
// codificação na publicação (ex.: "jó" -> "job.json").
function bookFileName(abbrev: string): string {
  return (
    abbrev
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "") || abbrev
  );
}

export async function loadBook(abbrev: string): Promise<BookContent> {
  const cached = bookCache.get(abbrev);
  if (cached) return cached;
  const file = abbrev === "jó" ? "job" : bookFileName(abbrev);
  const res = await fetch(`/bible/${file}.json`);
  if (!res.ok) throw new Error("Livro não encontrado");
  const book = (await res.json()) as BookContent;
  bookCache.set(abbrev, book);
  return book;
}


async function loadFull(): Promise<Record<string, string[][]>> {
  if (fullCache) return fullCache;
  const res = await fetch("/bible/full.json");
  fullCache = (await res.json()) as Record<string, string[][]>;
  return fullCache;
}

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export interface ParsedReference {
  book: BookIndex;
  chapter: number;
  verse?: number;
}

/** Interpreta entradas como "João 3:16", "Salmos 23", "1 Co 13". */
export function parseReference(query: string, books: BookIndex[]): ParsedReference | null {
  const cleaned = query.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?)\s*(\d+)?\s*(?::|\s+v\.?\s*)?\s*(\d+)?$/i);
  if (!match) return null;
  const rawName = normalize(match[1] ?? "");
  if (!rawName) return null;

  const candidates = books.filter((b) => {
    const name = normalize(b.name);
    return name === rawName || name.startsWith(rawName) || normalize(b.abbrev) === rawName;
  });
  if (candidates.length === 0) return null;
  const book = candidates.sort((a, b) => a.name.length - b.name.length)[0];
  if (!book) return null;

  const chapter = match[2] ? Number(match[2]) : 1;
  if (!match[2]) return null;
  if (chapter < 1 || chapter > book.chapters.length) return null;
  const verse = match[3] ? Number(match[3]) : undefined;
  const verseCount = book.chapters[chapter - 1];
  if (verseCount === undefined) return null;
  if (verse && (verse < 1 || verse > verseCount)) return null;
  return verse === undefined ? { book, chapter } : { book, chapter, verse };
}

export async function searchBibleText(term: string, limit = 60): Promise<VerseRef[]> {
  const needle = normalize(term);
  if (needle.length < 3) return [];
  const [books, full] = await Promise.all([loadBibleIndex(), loadFull()]);
  const results: VerseRef[] = [];
  for (const book of books) {
    const chapters = full[book.abbrev];
    if (!chapters) continue;
    for (let c = 0; c < chapters.length; c++) {
      const verses = chapters[c];
      if (!verses) continue;
      for (let v = 0; v < verses.length; v++) {
        const text = verses[v];
        if (text && normalize(text).includes(needle)) {
          results.push({
            abbrev: book.abbrev,
            book: book.name,
            chapter: c + 1,
            verse: v + 1,
            text,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}

export function referenceLabel(book: string, chapter: number, verse?: number): string {
  return verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
}
