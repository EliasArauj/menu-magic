import { Link } from "@tanstack/react-router";
import { Play, Sparkles } from "lucide-react";
import { UnifiedSearch } from "@/components/UnifiedSearch";
import bibleMenuImage from "@/assets/menu-biblia.jpg";
import hymnalMenuImage from "@/assets/menu-harpa.jpg";
import presentationMenuImage from "@/assets/menu-apresentacao.jpg";
import settingsMenuImage from "@/assets/menu-configuracoes.jpg";

const columnA = [
  "/harpa/images/0004.jpg",
  "/bible/images/sl.jpg",
  "/harpa/images/0100.jpg",
  "/harpa/images/0231.jpg",
];

const columnB = [
  "/bible/images/ap.jpg",
  "/harpa/images/0350.jpg",
  "/harpa/images/0512.jpg",
  "/harpa/images/0003.jpg",
];

const columnC = [
  "/harpa/images/0620.jpg",
  "/harpa/images/0088.jpg",
  "/bible/images/gn.jpg",
  "/harpa/images/0444.jpg",
];

function PhotoColumn({
  images,
  direction,
  className,
}: {
  images: string[];
  direction: "up" | "down";
  className?: string;
}) {
  const loop = [...images, ...images];
  return (
    <div className={`relative h-full overflow-hidden ${className ?? ""}`} aria-hidden>
      <div
        className={`flex flex-col gap-4 ${
          direction === "up" ? "animate-marquee-up" : "animate-marquee-down"
        }`}
      >
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="h-56 w-full shrink-0 rounded-3xl bg-cover bg-center brightness-110 contrast-110 saturate-110 shadow-lift"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </div>
  );
}

const tiles = [
  { to: "/biblia", label: "Bíblia", desc: "Antigo e Novo Testamento", image: bibleMenuImage },
  { to: "/harpa", label: "Harpa", desc: "638 hinos, por número ou título", image: hymnalMenuImage },
  { to: "/apresentacao", label: "Apresentação", desc: "Painel e playlist", image: presentationMenuImage },
  { to: "/configuracoes", label: "Configurações", desc: "Temas, fonte e projeção", image: settingsMenuImage },
] as const;

export function HomeMenuCinema() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Mural de fotos em movimento contínuo */}
      <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4 lg:grid-cols-3" aria-hidden>
        <PhotoColumn images={columnA} direction="up" />
        <PhotoColumn images={columnB} direction="down" />
        <PhotoColumn images={columnC} direction="up" className="hidden lg:block" />
      </div>

      {/* Aurora viva por cima das fotos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-aurora absolute -left-1/4 top-[-20%] size-[70vw] rounded-full bg-primary/10 blur-[90px]" />
        <div
          className="animate-aurora absolute -right-1/4 bottom-[-25%] size-[65vw] rounded-full bg-primary/10 blur-[100px]"
          style={{ animationDelay: "-8s" }}
        />
      </div>
      <div className="absolute inset-0 bg-background/10" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,color-mix(in_oklab,var(--background)_52%,transparent)_100%)]"
        aria-hidden
      />

      {/* Conteúdo */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 px-5 py-16 text-center">
        <div className="relative grid place-items-center">
          <div
            className="animate-orbit pointer-events-none absolute size-56 rounded-full border border-primary/25 sm:size-72"
            aria-hidden
          >
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-lift" />
          </div>
          <div
            className="animate-orbit pointer-events-none absolute size-72 rounded-full border border-primary/10 sm:size-96"
            style={{ animationDirection: "reverse", animationDuration: "40s" }}
            aria-hidden
          >
            <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground/60" />
          </div>

          <header className="animate-rise relative px-6 py-6 sm:px-12 sm:py-8">
            {/* Halo suave atrás do título */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_72%,transparent)_0%,transparent_70%)]"
              aria-hidden
            />

            {/* Selo superior */}
            <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.55em] text-primary sm:text-xs">
              Bíblia &nbsp;•&nbsp; Harpa Cristã
            </p>

            <h1
              className="mt-4 font-[family-name:var(--font-display-cinema)] text-[clamp(2.4rem,8vw,5.2rem)] font-bold uppercase leading-[1.02] tracking-[0.14em]"
              style={{
                backgroundImage: `linear-gradient(175deg,
                  color-mix(in oklab, var(--primary) 30%, var(--foreground)) 0%,
                  var(--primary) 32%,
                  color-mix(in oklab, var(--primary) 55%, white) 50%,
                  var(--primary) 68%,
                  color-mix(in oklab, var(--primary) 65%, black) 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter:
                  "drop-shadow(0 1px 0 color-mix(in oklab, var(--primary) 20%, white)) drop-shadow(0 10px 28px color-mix(in oklab, var(--primary) 40%, transparent))",
              }}
            >
              Assembleia
              <span className="block">de Deus</span>
              <span
                className="mt-3 block text-[0.62em] tracking-[0.42em]"
                style={{
                  backgroundImage: `linear-gradient(90deg,
                    color-mix(in oklab, var(--primary) 70%, black) 0%,
                    color-mix(in oklab, var(--primary) 55%, white) 50%,
                    color-mix(in oklab, var(--primary) 70%, black) 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Renascer
              </span>
            </h1>

            {/* Ornamento inferior */}
            <div className="mx-auto mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/70 to-primary sm:w-24" />
              <Sparkles className="size-4 animate-spin-slow text-primary drop-shadow-[0_0_8px_color-mix(in_oklab,var(--primary)_70%,transparent)]" strokeWidth={2} />
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-primary/70 to-primary sm:w-24" />
            </div>

            <p className="mx-auto mt-5 max-w-lg text-sm text-foreground/80 sm:text-base">
              Bíblia, Harpa Cristã e projeção em um só lugar.
            </p>
          </header>
        </div>

        <div className="animate-rise glass-panel w-full max-w-xl rounded-2xl p-3" style={{ animationDelay: "120ms" }}>
          <UnifiedSearch />
        </div>

        <nav className="flex w-full flex-wrap items-center justify-center gap-3">
          {tiles.map(({ to, label, desc, image }, i) => (
            <Link
              key={to}
              to={to}
              style={{ animationDelay: `${200 + i * 90}ms` }}
              className="animate-rise glass-panel group flex min-w-[220px] flex-1 items-center gap-3 overflow-hidden rounded-2xl p-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-background/15" aria-hidden />
              </span>
              <span className="min-w-0 pr-2">
                <span className="block font-display text-base font-semibold text-foreground">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{desc}</span>
              </span>
            </Link>
          ))}
        </nav>

        <Link
          to="/apresentacao"
          style={{ animationDelay: "600ms" }}
          className="animate-rise animate-breathe inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lift transition-transform duration-300 hover:scale-105"
        >
          <Play className="size-4" strokeWidth={2} />
          Iniciar apresentação
        </Link>
      </div>
    </main>
  );
}
