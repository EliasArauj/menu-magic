import bgHome from "@/assets/bg-home.jpg";
import bgCriacao from "@/assets/bg-criacao.jpg";
import bgDeserto from "@/assets/bg-deserto.jpg";
import bgCeu from "@/assets/bg-ceu.jpg";
import bgSabedoria from "@/assets/bg-sabedoria.jpg";
import bgHistorico from "@/assets/bg-historico.jpg";
import bgAdoracao from "@/assets/bg-adoracao.jpg";
import bgPaz from "@/assets/bg-paz.jpg";
import bgCaminho from "@/assets/bg-caminho.jpg";
import bgCelestial from "@/assets/bg-celestial.jpg";

export type ThemeKey =
  | "santuario"
  | "criacao"
  | "deserto"
  | "ceu"
  | "sabedoria"
  | "historico"
  | "adoracao"
  | "paz"
  | "caminho"
  | "celestial";

export const themeImage: Record<ThemeKey, string> = {
  santuario: bgHome,
  criacao: bgCriacao,
  deserto: bgDeserto,
  ceu: bgCeu,
  sabedoria: bgSabedoria,
  historico: bgHistorico,
  adoracao: bgAdoracao,
  paz: bgPaz,
  caminho: bgCaminho,
  celestial: bgCelestial,
};

const rotation: ThemeKey[] = [
  "criacao",
  "deserto",
  "historico",
  "ceu",
  "sabedoria",
  "paz",
  "adoracao",
  "caminho",
  "celestial",
  "santuario",
];

/** Tema visual de cada livro da Bíblia (abreviação -> imagem). */
const bookTheme: Record<string, ThemeKey> = {
  gn: "criacao",
  ex: "deserto",
  lv: "historico",
  nm: "deserto",
  dt: "deserto",
  js: "historico",
  jz: "historico",
  rt: "criacao",
  sl: "ceu",
  pv: "sabedoria",
  ec: "sabedoria",
  ct: "criacao",
  is: "ceu",
  jr: "deserto",
  ez: "celestial",
  dn: "celestial",
  mt: "historico",
  mc: "historico",
  lc: "historico",
  jo: "ceu",
  at: "adoracao",
  rm: "sabedoria",
  hb: "sabedoria",
  tg: "sabedoria",
  ap: "celestial",
};

export function themeForBook(abbrev: string, index: number): ThemeKey {
  return bookTheme[abbrev] ?? rotation[index % rotation.length] ?? "santuario";
}

/** Cena fotográfica exclusiva de cada livro, servida sob public/bible/images. */
export function imageForBook(abbrev: string, index: number): string {
  if (abbrev) return `/bible/images/${encodeURIComponent(abbrev)}.jpg`;
  return themeImage[themeForBook(abbrev, index)];
}

export { bgHome };
