import originalBackground from "@/assets/bg-home.jpg";
import alternateBackground from "@/assets/bg-home-alternativo.jpg";

export const menuBackgrounds = ["original", "alternativa"] as const;

export type MenuBackground = (typeof menuBackgrounds)[number];

export const menuBackgroundOptions: ReadonlyArray<{
  value: MenuBackground;
  label: string;
  image: string;
}> = [
  { value: "original", label: "Original", image: originalBackground },
  { value: "alternativa", label: "Alternativa", image: alternateBackground },
];

export function getMenuBackground(value: MenuBackground | undefined) {
  return value === "alternativa" ? alternateBackground : originalBackground;
}