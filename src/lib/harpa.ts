import type { ThemeKey } from "./imagery";

export interface Hymn {
  number: number;
  title: string;
  theme: ThemeKey;
  /** Imagem exclusiva do hino, servida sob public/harpa/images. */
  image?: string;
  /** Estrofes na ordem original. Cada estrofe é uma tela. */
  stanzas: string[][];
  /** Refrão opcional — ocupa sempre a própria tela. */
  chorus?: string[];
  /** true quando a letra é apenas demonstrativa (não oficial). */
  demo: boolean;
}

const STORAGE_KEY = "adr.harpa.custom";

let bundledHymns: Hymn[] | null = null;

/** Carrega o catálogo incluído no aplicativo sem aumentar o pacote inicial. */
export async function loadBundledHymns(): Promise<Hymn[]> {
  if (bundledHymns) return bundledHymns;
  const response = await fetch("/harpa/hymns.json");
  if (!response.ok) throw new Error("Não foi possível carregar os hinos");
  const data = (await response.json()) as Hymn[];
  bundledHymns = Array.isArray(data) ? data : [];
  return bundledHymns;
}

export function loadCustomHymns(): Hymn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Hymn[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomHymns(hymns: Hymn[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hymns));
}

export function clearCustomHymns() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hymnImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  const file = image.trim().replace(/^.*\//, "");
  if (!file) return undefined;
  return `/harpa/images/${encodeURIComponent(file)}`;
}

const themePool: ThemeKey[] = ["adoracao", "ceu", "paz", "caminho", "criacao", "celestial"];

/** Aceita arquivos no formato { numero, titulo, estrofes: [], refrao: [] } */
export function parseHymnImport(rawText: string): Hymn[] {
  const data = JSON.parse(rawText);
  const list = Array.isArray(data) ? data : Object.values(data);
  const hymns: Hymn[] = [];
  for (const item of list as Record<string, unknown>[]) {
    if (!item || typeof item !== "object") continue;
    const number = Number(item["numero"] ?? item["number"] ?? item["hino"]);
    const title = String(item["titulo"] ?? item["title"] ?? "").trim();
    const rawStanzas = (item["estrofes"] ?? item["stanzas"] ?? item["verses"]) as unknown;
    if (!number || !title || !rawStanzas) continue;
    const stanzaList = Array.isArray(rawStanzas)
      ? rawStanzas
      : Object.values(rawStanzas as Record<string, unknown>);
    const stanzas = stanzaList.map((s) => toLines(s));
    const rawChorus = item["refrao"] ?? item["coro"] ?? item["chorus"];
    const hymn: Hymn = {
      number,
      title,
      theme: themePool[number % themePool.length] ?? "adoracao",
      ...(typeof item["image"] === "string" ? { image: item["image"] } : {}),
      stanzas: stanzas.filter((s) => s.length > 0),
      demo: false,
    };
    if (rawChorus) hymn.chorus = toLines(rawChorus);
    hymns.push(hymn);
  }
  return hymns.sort((a, b) => a.number - b.number);
}

function toLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Sequência de telas de um hino: estrofe -> refrão -> estrofe -> refrão... */
export function hymnSlides(hymn: Hymn): { label: string; lines: string[] }[] {
  const slides: { label: string; lines: string[] }[] = [];
  hymn.stanzas.forEach((stanza, i) => {
    slides.push({ label: `Estrofe ${i + 1}`, lines: stanza });
    if (hymn.chorus?.length) slides.push({ label: "Refrão", lines: hymn.chorus });
  });
  return slides;
}
