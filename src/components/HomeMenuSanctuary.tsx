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
import { Button } from "@/components/ui/button";
import { inspirationalVerses } from "@/lib/verses";

const destinations = [
  {
    to: "/biblia",
    number: "01",
    label: "Bíblia",
    description: "Antigo e Novo Testamento",
    image: bibleMenuImage,
    Icon: BookOpen,
  },
  {
    to: "/harpa",
    number: "02",
    label: "Harpa Cristã",
    description: "638 hinos para o culto",
    image: hymnalMenuImage,
    Icon: Music2,
  },
  {
    to: "/apresentacao",
    number: "03",
    label: "Apresentação",
    description: "Painel e sequência ao vivo",
    image: presentationMenuImage,
    Icon: MonitorPlay,
  },
  {
    to: "/configuracoes",
    number: "04",
    label: "Configurações",
    description: "Aparência e projeção",
    image: settingsMenuImage,
    Icon: Settings2,
  },
] as const;



export function HomeMenuSanctuary() {
  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVerseIndex((i) => (i + 1) % inspirationalVerses.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const verse = inspirationalVerses[verseIndex] ?? inspirationalVerses[0];

  return (
    <main className="sanctuary relative min-h-screen w-full overflow-hidden bg-background">
      <div
        className="sanctuary-backdrop absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})` }}
        aria-hidden
      />
      <div className="sanctuary-veil absolute inset-0" aria-hidden />
      <div className="sanctuary-grain absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] gap-10 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.72fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-10">
        <section className="flex min-h-[46vh] flex-col justify-between pt-3 lg:min-h-[720px] lg:py-8">
          <div className="animate-rise flex items-center gap-3 text-primary">
            <span className="h-px w-12 bg-primary" aria-hidden />
            <p
              key={verseIndex}
              className="animate-slide-fade font-display text-[0.65rem] font-semibold uppercase tracking-[0.32em]"
            >
              {verse.text} • {verse.ref}
            </p>
          </div>

          <header className="animate-rise max-w-3xl pb-8 pt-16 lg:pb-0 lg:pt-24" style={{ animationDelay: "80ms" }}>
            <p className="mb-5 font-display text-xs uppercase tracking-[0.3em] text-foreground/70">
              Palavra • Louvor • Comunhão
            </p>
            <h1 className="font-[family-name:var(--font-display-cinema)] text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold uppercase leading-[0.95] text-foreground">
              Assembleia de Deus
              <span className="sanctuary-title-accent block">Renascer</span>
            </h1>
            <p className="mt-7 max-w-xl text-xs leading-6 text-foreground/75 sm:text-sm">
              Prepare a Palavra, encontre um hino e conduza cada momento do culto.
            </p>
          </header>

          <div className="animate-rise hidden items-end justify-between lg:flex" style={{ animationDelay: "180ms" }}>
            <Button asChild size="lg" className="h-14 rounded-full px-7 font-display uppercase tracking-[0.16em]">
              <Link to="/apresentacao">
                <Play className="size-4" />
                Iniciar apresentação
              </Link>
            </Button>
            <p className="max-w-48 text-right text-xs uppercase leading-5 tracking-[0.16em] text-foreground/50">
              Tudo pronto para o próximo culto
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center pb-8 lg:pb-0" aria-label="Menu principal">
          <div className="animate-rise mb-5" style={{ animationDelay: "120ms" }}>
            <UnifiedSearch />
          </div>

          <nav className="divide-y divide-border border-y border-border">
            {destinations.map(({ to, number, label, description, image, Icon }, index) => (
              <Link
                key={to}
                to={to}
                className="sanctuary-link animate-rise group relative grid min-h-24 grid-cols-[2.25rem_1fr_auto] items-center gap-3 overflow-hidden px-1 py-4 sm:min-h-28 sm:grid-cols-[3rem_1fr_auto] sm:gap-4 sm:px-3"
                style={{ animationDelay: `${180 + index * 70}ms` }}
              >
                <img
                  src={image}
                  alt=""
                  width={1024}
                  height={768}
                  className="absolute inset-0 size-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-25 group-focus-visible:opacity-25"
                />
                <span className="relative font-display text-[0.65rem] tracking-[0.2em] text-primary">{number}</span>
                <span className="relative min-w-0">
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
                    <span className="font-[family-name:var(--font-display-cinema)] text-base uppercase text-foreground sm:text-lg">
                      {label}
                    </span>
                  </span>
                  <span className="mt-1 block truncate pl-7 text-xs text-foreground/55 sm:text-sm">{description}</span>
                </span>
                <span className="relative grid size-10 place-items-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))}
          </nav>

          <Button asChild size="lg" className="mt-7 h-14 rounded-full font-display uppercase tracking-[0.16em] lg:hidden">
            <Link to="/apresentacao">
              <Play className="size-4" />
              Iniciar apresentação
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}