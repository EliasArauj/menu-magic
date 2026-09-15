import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ThemeKey } from "./imagery";
import { appearances, type Appearance } from "./appearance";
import { PresentationContext } from "./presentation-context";
export { appearances, appearanceLabels, type Appearance } from "./appearance";

export interface Slide {
  id: string;
  kind: "verse" | "hymn";
  /** Referência exibida acima do texto (ex.: "João 3:16"). */
  reference: string;
  /** Rótulo interno do operador (ex.: "Hino 15 — Refrão"). */
  label: string;
  lines: string[];
  theme: ThemeKey;
  /** Fundo exclusivo; quando ausente, usa a imagem do tema. */
  image?: string;
}

export interface Settings {
  appearance: Appearance;
  fontScale: number;
  lineHeight: number;
  align: "center" | "left";
  margin: number;
  transition: "fade" | "none";
  autoFit: boolean;
  showBackground: boolean;
  showReference: boolean;
  /** Onde o título/referência aparece no slide. */
  referencePosition: "top" | "bottom";
  /** Mostra o painel (container) atrás da letra. */
  showContainer: boolean;
  containerOpacity: number;
  /** Brilho aplicado às fotos (em %, 125–300). */
  photoBrightness: number;
  /** Estilo do menu principal. */
  menuStyle: "classico" | "animado" | "cinema" | "santuario" | "painel";
}

export const defaultSettings: Settings = {
  appearance: "dark",
  fontScale: 1,
  lineHeight: 1.35,
  align: "center",
  margin: 6,
  transition: "fade",
  autoFit: true,
  showBackground: true,
  showReference: true,
  referencePosition: "bottom",
  showContainer: true,
  containerOpacity: 58,
  photoBrightness: 125,
  menuStyle: "painel",
};

interface State {
  slides: Slide[];
  current: number;
  live: boolean;
  settings: Settings;
}

interface Ctx extends State {
  addSlides: (slides: Omit<Slide, "id">[]) => void;
  presentNow: (slide: Omit<Slide, "id">) => void;
  presentSequence: (slides: Omit<Slide, "id">[], startAt?: number) => void;
  removeSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  moveSlide: (from: number, to: number) => void;
  clearPlaylist: () => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  setLive: (live: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
}


const CHANNEL = "adr-presentation";
const STORAGE_STATE = "adr.state";
const STORAGE_SETTINGS = "adr.settings";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const LAST_HYMN_WITH_EXCLUSIVE_IMAGE = 999;

/** Recupera imagens ausentes e corrige caminhos antigos salvos no navegador. */
function repairSlideImage(slide: Slide): Slide {
  const img = slide.image;
  if (!img && slide.kind === "hymn") {
    const hymnNumber = Number(slide.reference.match(/(\d+)/)?.[1]);
    if (Number.isInteger(hymnNumber) && hymnNumber >= 1 && hymnNumber <= LAST_HYMN_WITH_EXCLUSIVE_IMAGE) {
      return { ...slide, image: `/harpa/images/${String(hymnNumber).padStart(4, "0")}.jpg` };
    }
  }

  if (!img) return slide;
  let decoded = img;
  try {
    decoded = decodeURIComponent(img);
  } catch {
    return slide;
  }
  if (!decoded.includes("/harpa/images/")) return slide;
  const file = decoded.replace(/^.*\//, "");
  const fixed = `/harpa/images/${file}`;
  return fixed === img ? slide : { ...slide, image: fixed };
}


export function PresentationProvider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [live, setLive] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const hydrated = useRef(false);



  // Hidratação a partir do armazenamento local (evita mismatch no SSR).
  useEffect(() => {
    try {
      const rawState = localStorage.getItem(STORAGE_STATE);
      if (rawState) {
        const parsed = JSON.parse(rawState) as Partial<State>;
        if (Array.isArray(parsed.slides)) setSlides(parsed.slides.map(repairSlideImage));
        if (typeof parsed.current === "number") setCurrent(parsed.current);
      }
      const rawSettings = localStorage.getItem(STORAGE_SETTINGS);
      if (rawSettings) setSettings({ ...defaultSettings, ...JSON.parse(rawSettings) });
    } catch {
      /* estado inicial padrão */
    }
    hydrated.current = true;
  }, []);

  // Canal entre a janela do operador e a janela de projeção.
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL);
    channelRef.current = ch;
    ch.onmessage = (event) => {
      const data = event.data as { type: string; payload?: Partial<State> };
      if (data?.type === "state" && data.payload) {
        if (data.payload.slides) setSlides(data.payload.slides.map(repairSlideImage));
        if (typeof data.payload.current === "number") setCurrent(data.payload.current);
        if (typeof data.payload.live === "boolean") setLive(data.payload.live);
        if (data.payload.settings) setSettings(data.payload.settings);
      }
      if (data?.type === "request") {
        ch.postMessage({ type: "state", payload: { slides, current, live, settings } });
      }
    };
    ch.postMessage({ type: "request" });
    return () => ch.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, current, live, settings]);

  const broadcast = useCallback((payload: Partial<State>) => {
    channelRef.current?.postMessage({ type: "state", payload });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_STATE, JSON.stringify({ slides, current }));
    broadcast({ slides, current, live });
  }, [slides, current, live, broadcast]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(settings));
    broadcast({ settings });
    const root = document.documentElement;
    appearances.forEach((mode) =>
      root.classList.toggle(`theme-${mode}`, settings.appearance === mode),
    );
    root.classList.toggle("light", settings.appearance === "light" || settings.appearance === "sepia" || settings.appearance === "fotoclara" || settings.appearance === "fotosepia");
    root.style.setProperty(
      "--photo-brightness",
      String((settings.photoBrightness ?? defaultSettings.photoBrightness) / 100),
    );
  }, [settings, broadcast]);

  const value = useMemo<Ctx>(
    () => ({
      slides,
      current,
      live,
      settings,
      addSlides: (items) =>
        setSlides((prev) => [...prev, ...items.map((item) => ({ ...item, id: uid() }))]),
      presentNow: (item) => {
        const slide = { ...item, id: uid() };
        setSlides((prev) => {
          const nextSlides = [...prev, slide];
          setCurrent(nextSlides.length - 1);
          return nextSlides;
        });
        setLive(true);
      },
      presentSequence: (items, startAt = 0) => {
        const nextSlides = items.map((item) => ({ ...item, id: uid() }));
        if (nextSlides.length === 0) return;
        setSlides(nextSlides);
        setCurrent(Math.max(0, Math.min(startAt, nextSlides.length - 1)));
        setLive(true);
      },
      removeSlide: (id) =>
        setSlides((prev) => {
          const next = prev.filter((s) => s.id !== id);
          setCurrent((c) => Math.max(0, Math.min(c, next.length - 1)));
          return next;
        }),
      duplicateSlide: (id) =>
        setSlides((prev) => {
          const i = prev.findIndex((s) => s.id === id);
          if (i < 0) return prev;
          const original = prev[i];
          if (!original) return prev;
          const copy: Slide = { ...original, id: uid() };
          return [...prev.slice(0, i + 1), copy, ...prev.slice(i + 1)];
        }),
      moveSlide: (from, to) =>
        setSlides((prev) => {
          if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length)
            return prev;
          const next = [...prev];
          const [item] = next.splice(from, 1);
          if (!item) return prev;
          next.splice(to, 0, item);
          return next;
        }),
      clearPlaylist: () => {
        setSlides([]);
        setCurrent(0);
        setLive(false);
      },
      goTo: (index) => setCurrent(() => Math.max(0, Math.min(index, slides.length - 1))),
      next: () => setCurrent((c) => Math.min(c + 1, Math.max(slides.length - 1, 0))),
      prev: () => setCurrent((c) => Math.max(c - 1, 0)),
      setLive,
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      resetSettings: () => setSettings(defaultSettings),
    }),
    [slides, current, live, settings],
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}

export function usePresentation(): Ctx {
  const ctx = useContext(PresentationContext) as Ctx | null;
  if (!ctx) throw new Error("usePresentation precisa estar dentro de PresentationProvider");
  return ctx;
}
