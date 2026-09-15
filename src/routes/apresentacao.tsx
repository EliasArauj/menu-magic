import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  ExternalLink,
  Maximize2,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SlideStage } from "@/components/SlideStage";
import { StageNav } from "@/components/StageNav";
import { usePresentation } from "@/lib/presentation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/apresentacao")({
  head: () => ({
    meta: [
      { title: "Apresentação — Assembleia de Deus Renascer" },
      {
        name: "description",
        content:
          "Painel do operador: slide atual, próximo slide, playlist e controles de projeção para o culto.",
      },
      { property: "og:title", content: "Apresentação — Assembleia de Deus Renascer" },
      { property: "og:description", content: "Controle de slides, playlist e segundo monitor." },
    ],
  }),
  component: ApresentacaoPage,
});

function ApresentacaoPage() {
  const {
    slides,
    current,
    live,
    settings,
    goTo,
    next,
    prev,
    setLive,
    removeSlide,
    duplicateSlide,
    moveSlide,
    clearPlaylist,
    updateSettings,
  } = usePresentation();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.tagName === "INPUT";
      if (typing) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "Escape") {
        setLive(false);
      } else if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "+" || e.key === "=") {
        updateSettings({ fontScale: Math.min(2, +(settings.fontScale + 0.1).toFixed(2)) });
      } else if (e.key === "-") {
        updateSettings({ fontScale: Math.max(0.5, +(settings.fontScale - 0.1).toFixed(2)) });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, setLive, settings.fontScale, updateSettings]);

  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const openProjection = () => {
    window.open("/projecao", "adr-projecao", "width=1280,height=720");
  };

  if (live) {
    return (
      <div ref={stageRef} className="relative h-screen w-screen overflow-hidden bg-stage">
        <StageNav />
        <SlideStage slide={slides[current]} settings={settings} />
        <div className="glass-soft absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 opacity-25 transition-opacity hover:opacity-100">
          <IconButton label="Anterior" onClick={prev}>
            <ChevronLeft className="size-4" />
          </IconButton>
          <span className="px-2 text-xs text-stage-foreground/80">
            {slides.length ? current + 1 : 0}/{slides.length}
          </span>
          <IconButton label="Próximo" onClick={next}>
            <ChevronRight className="size-4" />
          </IconButton>
          <IconButton label="Tela cheia" onClick={toggleFullscreen}>
            <Maximize2 className="size-4" />
          </IconButton>
          <IconButton label="Finalizar" onClick={() => setLive(false)}>
            <X className="size-4" />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Apresentação"
      subtitle="Painel do operador"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={openProjection}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ExternalLink className="size-4" /> Abrir no 2º monitor
          </button>
          <button
            onClick={() => setLive(true)}
            disabled={slides.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            <Expand className="size-4" /> Apresentar
          </button>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4">
          <div>
            <p className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Slide atual
            </p>
            <div className="aspect-video overflow-hidden rounded-2xl border border-glass-border">
              <SlideStage slide={slides[current]} settings={settings} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={prev}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              <ChevronLeft className="size-4" /> Anterior
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              Próximo <ChevronRight className="size-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              <Maximize2 className="size-4" /> Tela cheia
            </button>
            <button
              onClick={() => setLive(false)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              <Square className="size-4" /> Finalizar
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              Atalhos: → próximo • ← anterior • Espaço avança • Esc finaliza • F11 tela cheia • +/−
              fonte
            </span>
          </div>

          <div className="max-w-sm">
            <p className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Próximo slide
            </p>
            <div className="aspect-video overflow-hidden rounded-xl border border-glass-border">
              <SlideStage slide={slides[current + 1]} settings={settings} compact />
            </div>
          </div>
        </section>

        <aside className="glass-soft flex max-h-[calc(100vh-8rem)] flex-col rounded-2xl p-4">
          <header className="mb-3 flex items-center gap-2">
            <h2 className="flex-1 font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Playlist ({slides.length})
            </h2>
            {slides.length > 0 && (
              <button
                onClick={clearPlaylist}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Limpar
              </button>
            )}
          </header>

          {slides.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Adicione versículos na Bíblia ou estrofes na Harpa para montar a sequência do culto.
            </p>
          )}

          <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {slides.map((slide, i) => (
              <li
                key={slide.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) moveSlide(dragIndex, i);
                  setDragIndex(null);
                }}
                className={cn(
                  "group cursor-grab rounded-xl border px-3 py-2 transition-colors active:cursor-grabbing",
                  i === current
                    ? "border-primary/50 bg-primary/12"
                    : "border-border/60 hover:bg-accent/60",
                )}
                onClick={() => goTo(i)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-xs text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm">{slide.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {slide.lines[0]}
                    </span>
                  </span>
                  <button
                    aria-label="Duplicar slide"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(slide.id);
                    }}
                    className="opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    aria-label="Remover slide"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(slide.id);
                    }}
                    className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </AppShell>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full text-stage-foreground/80 transition-colors hover:bg-stage-foreground/10 hover:text-stage-foreground"
    >
      {children}
    </button>
  );
}
