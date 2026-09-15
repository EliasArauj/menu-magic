import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  lines: string[];
  className?: string;
  /** Tamanho máximo em px na largura de referência. */
  max?: number;
  min?: number;
  lineHeight?: number;
  align?: "center" | "left";
  enabled?: boolean;
  scale?: number;
}

/**
 * Ajusta o tamanho da fonte para o texto sempre caber no espaço disponível,
 * sem cortes e mantendo a maior legibilidade possível.
 */
export function AutoFitText({
  lines,
  className,
  max = 96,
  min = 18,
  lineHeight = 1.35,
  align = "center",
  enabled = true,
  scale = 1,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(max * scale);

  const fit = () => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    if (!enabled) {
      setSize(max * scale);
      return;
    }
    let low = min;
    let high = max * scale;
    let best = min;
    for (let i = 0; i < 18; i++) {
      const mid = (low + high) / 2;
      text.style.fontSize = `${mid}px`;
      const fits = text.scrollHeight <= box.clientHeight && text.scrollWidth <= box.clientWidth;
      if (fits) {
        best = mid;
        low = mid;
      } else {
        high = mid;
      }
      if (high - low < 0.5) break;
    }
    text.style.fontSize = "";
    setSize(best);
  };

  useLayoutEffect(fit, [lines, max, min, lineHeight, enabled, scale]);

  useEffect(() => {
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, scale, enabled]);

  return (
    <div ref={boxRef} className={cn("flex h-full w-full items-center justify-center", className)}>
      <div
        ref={textRef}
        style={{ fontSize: `${size}px`, lineHeight }}
        className={cn(
          "w-full font-display font-semibold tracking-tight",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
