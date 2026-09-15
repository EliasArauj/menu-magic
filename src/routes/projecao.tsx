import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SlideStage } from "@/components/SlideStage";
import { StageNav } from "@/components/StageNav";
import { usePresentation } from "@/lib/presentation";
import { themeImage } from "@/lib/imagery";

export const Route = createFileRoute("/projecao")({
  head: () => ({
    meta: [
      { title: "Projeção — Assembleia de Deus Renascer" },
      {
        name: "description",
        content: "Tela de projeção em tela cheia com o slide atual do culto, sem controles.",
      },
      { property: "og:title", content: "Projeção — Assembleia de Deus Renascer" },
      { property: "og:description", content: "Somente o conteúdo apresentado, em 16:9." },
    ],
  }),
  component: ProjecaoPage,
});

function ProjecaoPage() {
  const { slides, current, settings, next, prev, setLive } = usePresentation();
  const slide = slides[current];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, setLive]);

  // Pré-carrega a imagem do próximo slide para transição instantânea.
  useEffect(() => {
    const upcoming = slides[current + 1];
    if (!upcoming) return;
    const img = new Image();
    img.src = upcoming.image ?? themeImage[upcoming.theme];
  }, [slides, current]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stage">
      <StageNav />
      <SlideStage slide={slide} settings={settings} />
    </div>
  );
}
