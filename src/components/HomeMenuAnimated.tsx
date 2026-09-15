import { Link } from "@tanstack/react-router";
import { BookOpen, Music2, MonitorPlay, Settings2, Play, Sparkles } from "lucide-react";
import { bgHome } from "@/lib/imagery";
import { UnifiedSearch } from "@/components/UnifiedSearch";

const tiles = [
  {
    to: "/biblia",
    label: "Bíblia",
    desc: "Antigo e Novo Testamento",
    Icon: BookOpen,
    image: "/bible/images/sl.jpg",
    delay: "0s",
    drift: "animate-float-a",
  },
  {
    to: "/harpa",
    label: "Harpa",
    desc: "638 hinos, por número ou título",
    Icon: Music2,
    image: "/harpa/images/0004.jpg",
    delay: "-3s",
    drift: "animate-float-b",
  },
  {
    to: "/apresentacao",
    label: "Apresentação",
    desc: "Painel do operador e playlist",
    Icon: MonitorPlay,
    image: "/harpa/images/0100.jpg",
    delay: "-5s",
    drift: "animate-float-a",
  },
  {
    to: "/configuracoes",
    label: "Configurações",
    desc: "Temas, fonte e projeção",
    Icon: Settings2,
    image: "/bible/images/ap.jpg",
    delay: "-7s",
    drift: "animate-float-b",
  },
] as const;

export function HomeMenuAnimated() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Fundo com movimento ken-burns contínuo */}
      <div
        className="photo-lift animate-kenburns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})` }}
        aria-hidden
      />
      <div className="stage-veil absolute inset-0" aria-hidden />

      {/* Brilhos flutuantes */}
      <div className="animate-drift-a absolute -left-24 top-1/4 size-80 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="animate-drift-b absolute -right-20 top-10 size-96 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="animate-drift-a absolute bottom-0 left-1/3 size-72 rounded-full bg-primary/10 blur-3xl" style={{ animationDelay: "-9s" }} aria-hidden />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-9 px-5 py-12 text-center">
        <header className="animate-rise">
          <span className="animate-glow-pulse inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-primary">
            <Sparkles className="size-3.5 animate-spin-slow" strokeWidth={1.8} />
            Culto em ordem
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Assembleia de Deus{" "}
            <span className="animate-shimmer bg-gradient-to-r from-primary via-foreground to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
              Renascer
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Bíblia, Harpa Cristã e projeção — tudo em um só lugar, pronto para a próxima palavra.
          </p>
        </header>

        <div className="animate-rise glass-panel w-full max-w-2xl rounded-2xl p-3" style={{ animationDelay: "100ms" }}>
          <UnifiedSearch />
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          {tiles.map(({ to, label, desc, Icon, image, delay, drift }, i) => (
            <Link
              key={to}
              to={to}
              style={{ animationDelay: `${160 + i * 90}ms` }}
              className="animate-rise group relative isolate overflow-hidden rounded-3xl border border-border/50 p-6 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div
                className={`photo-lift absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.08] ${drift}`}
                style={{ backgroundImage: `url(${image})`, animationDelay: delay }}
                aria-hidden
              />
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20"
                aria-hidden
              />
              {/* faixa de luz que atravessa no hover */}
              <div
                className="absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                aria-hidden
              />
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <h2 className="mt-14 font-display text-xl font-semibold text-foreground sm:text-2xl">
                {label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="animate-rise" style={{ animationDelay: "540ms" }}>
          <Link
            to="/apresentacao"
            className="animate-breathe inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lift transition-transform duration-300 hover:scale-105"
          >
            <Play className="size-4" strokeWidth={2} />
            Iniciar apresentação
          </Link>
        </div>
      </div>
    </main>
  );
}
