import { Link } from "@tanstack/react-router";
import { BookOpen, Music2, MonitorPlay, Settings2, Play } from "lucide-react";
import { bgHome } from "@/lib/imagery";
import { UnifiedSearch } from "@/components/UnifiedSearch";

const links = [
  { to: "/biblia", label: "Bíblia", desc: "Antigo e Novo Testamento", Icon: BookOpen },
  { to: "/harpa", label: "Harpa", desc: "Hinos por número ou título", Icon: Music2 },
  { to: "/apresentacao", label: "Apresentação", desc: "Painel do operador", Icon: MonitorPlay },
  { to: "/configuracoes", label: "Configurações", desc: "Fonte, tema e projeção", Icon: Settings2 },
] as const;

export function HomeMenuClassic() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div
        className="photo-lift absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHome})` }}
        aria-hidden
      />
      <div className="stage-veil absolute inset-0" aria-hidden />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <section className="glass-panel animate-rise w-full max-w-4xl rounded-3xl p-8 sm:p-12">
          <header className="text-center">
            <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.18em] text-foreground sm:text-5xl">
              Assembleia de Deus Renascer
            </h1>
            <p className="mt-3 text-xs uppercase tracking-[0.4em] text-primary sm:text-sm">
              Bíblia • Harpa • Apresentação
            </p>
          </header>

          <div className="mt-8">
            <UnifiedSearch />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {links.map(({ to, label, desc, Icon }, i) => (
              <Link
                key={to}
                to={to}
                style={{ animationDelay: `${80 + i * 60}ms` }}
                className="glass-soft animate-rise group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base font-medium text-foreground">
                    {label}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">{desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/apresentacao"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              <Play className="size-4" strokeWidth={2} />
              Iniciar apresentação
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
