import { createFileRoute } from "@tanstack/react-router";
import { HomeMenuClassic } from "@/components/HomeMenuClassic";
import { HomeMenuCinema } from "@/components/HomeMenuCinema";
import { HomeMenuAnimated } from "@/components/HomeMenuAnimated";
import { HomeMenuSanctuary } from "@/components/HomeMenuSanctuary";
import { HomeMenuPainel } from "@/components/HomeMenuPainel";
import { usePresentation } from "@/lib/presentation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assembleia de Deus Renascer — Bíblia, Harpa e Apresentação" },
      {
        name: "description",
        content:
          "Menu principal do sistema de apresentação da Assembleia de Deus Renascer: Bíblia, Harpa, projeção e configurações.",
      },
      { property: "og:title", content: "Assembleia de Deus Renascer — Sistema de Apresentação" },
      {
        property: "og:description",
        content: "Bíblia, Harpa e projeção profissional para cultos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { settings } = usePresentation();
  if (settings.menuStyle === "cinema") return <HomeMenuCinema />;
  if (settings.menuStyle === "animado") return <HomeMenuAnimated />;
  if (settings.menuStyle === "santuario") return <HomeMenuSanctuary />;
  if (settings.menuStyle === "classico") return <HomeMenuClassic />;
  return <HomeMenuPainel />;
}
