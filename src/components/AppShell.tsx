import { Link } from "@tanstack/react-router";
import { BookOpen, Home, MonitorPlay, Music2, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Menu", Icon: Home },
  { to: "/biblia", label: "Bíblia", Icon: BookOpen },
  { to: "/harpa", label: "Harpa", Icon: Music2 },
  { to: "/apresentacao", label: "Apresentação", Icon: MonitorPlay },
  { to: "/configuracoes", label: "Configurações", Icon: Settings2 },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground" title={subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          {actions}
          <nav className="flex items-center gap-1">
            {nav.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                aria-label={label}
                activeOptions={{ exact: to === "/" }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  "[&.active]:bg-primary/15 [&.active]:text-primary",
                )}
              >
                <Icon className="size-4" strokeWidth={1.6} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-5 py-6">{children}</main>
    </div>
  );
}
