/** Temas disponíveis nas configurações. */
export const appearances = ["dark", "light", "foto", "fotoclara", "sepia", "fotosepia", "aurora", "horizonte"] as const;

export type Appearance = (typeof appearances)[number];

export const appearanceLabels: Record<Appearance, string> = {
  dark: "Escuro",
  light: "Claro",
  foto: "Foto viva",
  fotoclara: "Foto viva clara",
  sepia: "Sépia",
  fotosepia: "Foto viva sépia",
  aurora: "Aurora",
  horizonte: "Horizonte",
};
