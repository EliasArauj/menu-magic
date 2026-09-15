import { AutoFitText } from "@/components/AutoFitText";
import { themeImage } from "@/lib/imagery";
import type { Settings, Slide } from "@/lib/presentation";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface Props {
  slide?: Slide | undefined;
  settings: Settings;
  /** compact = miniatura de preview no painel do operador. */
  compact?: boolean;
  className?: string;
}

const LAST_HYMN_WITH_EXCLUSIVE_IMAGE = 999;

function exclusiveHymnImage(slide?: Slide): string | undefined {
  if (!slide || slide.kind !== "hymn") return undefined;
  const hymnNumber = Number(slide.reference.match(/(\d+)/)?.[1]);
  if (
    !Number.isInteger(hymnNumber) ||
    hymnNumber < 1 ||
    hymnNumber > LAST_HYMN_WITH_EXCLUSIVE_IMAGE
  ) {
    return undefined;
  }
  return `/harpa/images/${String(hymnNumber).padStart(4, "0")}.jpg`;
}


export function SlideStage({ slide, settings, compact = false, className }: Props) {
  const bg = slide
    ? (slide.image ?? exclusiveHymnImage(slide) ?? themeImage[slide.theme])
    : undefined;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-stage text-stage-foreground",
        className,
      )}
    >
      {bg && (
        <div
          className="photo-lift absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg})`,
            ["--photo-brightness" as string]: String(
              (settings.photoBrightness ?? 125) / 100,
            ),
          } as CSSProperties}
          aria-hidden
        />
      )}
      <div className="stage-veil absolute inset-0" aria-hidden />

      {slide ? (
        <div
          key={slide.id + slide.reference}
          className={cn(
            "relative flex h-full w-full flex-col",
            settings.transition === "fade" && "animate-slide-fade",
          )}
          style={{ padding: `${compact ? 3 : settings.margin}%` }}
        >
          {(() => {
            const showContainer = settings.showContainer !== false;
            const reference = settings.showReference ? (
              <p
                className={cn(
                  "shrink-0 font-display uppercase tracking-[0.25em] text-primary text-stage-shadow",
                  settings.referencePosition === "top"
                    ? "pb-[2%]"
                    : "pt-[2%]",
                  compact ? "text-[9px]" : "text-[clamp(0.9rem,1.6vw,1.6rem)]",
                  settings.align === "center" ? "text-center" : "text-left",
                )}
              >
                {slide.reference}
              </p>
            ) : null;

            return (
              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col",
                  showContainer && "verse-glass-panel",
                  showContainer && (compact ? "rounded-md p-[3%]" : "rounded-xl p-[4%]"),
                )}
                style={
                  {
                    "--verse-panel-opacity": `${Math.max(0, Math.min(settings.containerOpacity, 100))}%`,
                  } as CSSProperties
                }
              >
                {settings.referencePosition === "top" && reference}
                <div className="min-h-0 flex-1">
                  <AutoFitText
                    lines={slide.lines}
                    max={compact ? 26 : 110}
                    min={compact ? 8 : 20}
                    scale={settings.fontScale}
                    lineHeight={settings.lineHeight}
                    align={settings.align}
                    enabled={settings.autoFit}
                    className="text-stage-shadow"
                  />
                </div>
                {settings.referencePosition !== "top" && reference}
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <p
            className={cn(
              "font-display uppercase tracking-[0.3em] text-muted-foreground",
              compact ? "text-[9px]" : "text-sm",
            )}
          >
            Sem slide
          </p>
        </div>
      )}
    </div>
  );
}
