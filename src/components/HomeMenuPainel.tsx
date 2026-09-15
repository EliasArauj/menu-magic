import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Music2,
  MonitorPlay,
  Play,
  Settings2,
} from "lucide-react";
import bgHome from "@/assets/bg-home.jpg";
import bibleMenuImage from "@/assets/menu-biblia.jpg";
import hymnalMenuImage from "@/assets/menu-harpa.jpg";
import presentationMenuImage from "@/assets/menu-apresentacao.jpg";
import settingsMenuImage from "@/assets/menu-configuracoes.jpg";
import { UnifiedSearch } from "@/components/UnifiedSearch";
import { inspirationalVerses } from "@/lib/verses";

const secondaryCards = [
  {
    to: "/biblia",
    label: "Bíblia",
    desc: "Antigo e Novo Testamento",
    chip: "66 livros",
    image: bibleMenuImage,
    Icon: BookOpen,
  },
  {
    to: "/harpa",
    label: "Harpa Cristã",
    desc: "Hinos para todo o culto",
    chip: "638 hinos",
    image: hymnalMenuImage,
    Icon: Music2,
  },
  {
    to: "/configuracoes",
    label: "Configurações",
    desc: "Tema, fonte e projeção",
    chip: null,
    image: settingsMenuImage,
    Icon: Settings2,
  },
] as const;

function greetingFor(date: Date | null) {
  if (!date) return "Bem-vindo";
  const h = date.getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeMenuPainel() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setVerseIndex((i) => (i + 1) % inspirationalVerses.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const verse = inspirationalVerses[verseIndex] ?? inspirationalVerses[0];
  const timeLabel = now?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) ?? "--:--";
  const dateLabel = now
    ? now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).replace(/\./g, "")
    : "";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className="photo-lift absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})` }}
        aria-hidden
      />
      <div className="stage-veil absolute inset-0" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-2 text-primary">
            <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <p
              key={verseIndex}
              className="animate-slide-fade truncate font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-foreground/80"
            >
              {verse.text} <span className="text-primary">• {verse.ref}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 font-display text-[0.65rem] uppercase tracking-[0.18em] text-foreground/55">
            <span>{dateLabel}</span>
            <span className="text-foreground/25">•</span>
            <span className="text-foreground/85">{timeLabel}</span>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-5 py-8 sm:px-8 lg:gap-8 lg:py-10">
          <div className="animate-rise flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-foreground/55">
                Palavra • Louvor • Comunhão
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display-cinema)] text-[clamp(1.4rem,2.4vw,2.1rem)] uppercase leading-tight text-foreground">
                Assembleia de Deus <span className="text-primary">Renascer</span>
              </h1>
            </div>
            <div className="w-full max-w-xs sm:max-w-sm">
              <UnifiedSearch />
            </div>
          </div>

          <Link
            to="/apresentacao"
            style={{ animationDelay: "80ms" }}
            className="animate-rise group relative isolate flex min-h-[190px] flex-col justify-end overflow-hidden rounded-3xl border border-border/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-8"
          >
            <div
              className="photo-lift animate-kenburns absolute inset-0 -z-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${presentationMenuImage})` }}
              aria-hidden
            />
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/78 to-background/15"
              aria-hidden
            />

            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-primary">
              <MonitorPlay className="size-3.5" strokeWidth={1.8} />
              Ao vivo
            </span>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                  Iniciar apresentação
                </h2>
                <p className="mt-1 max-w-md text-xs text-foreground/70 sm:text-sm">
                  {greetingFor(now)}, tudo pronto para o culto de hoje.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-3 rounded-full bg-primary px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-lift transition-transform duration-300 group-hover:scale-105">
                <Play className="size-4" strokeWidth={2} />
                Abrir painel
              </span>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-3">
            {secondaryCards.map(({ to, label, desc, chip, image, Icon }, i) => (
              <Link
                key={to}
                to={to}
                style={{ animationDelay: `${160 + i * 70}ms` }}
                className="glass-soft animate-rise group relative flex min-h-[144px] flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <img
                  src={image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-20"
                />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <ArrowUpRight className="size-4 text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <div className="relative">
                  <span className="block font-display text-base font-semibold text-foreground">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
                  {chip ? (
                    <span className="mt-3 inline-flex w-fit items-center rounded-full border border-border px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.15em] text-foreground/55">
                      {chip}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
