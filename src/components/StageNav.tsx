import { Link } from "@tanstack/react-router";
import { BookOpen, Home, Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/biblia", label: "Bíblia", Icon: BookOpen },
  { to: "/harpa", label: "Harpa", Icon: Music2 },
  { to: "/", label: "Menu principal", Icon: Home },
] as const;

/** Botões discretos no canto superior direito da tela de apresentação. */
export function StageNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 2500);
    };
    window.addEventListener("mousemove", reveal);
    return () => {
      window.removeEventListener("mousemove", reveal);
      clearTimeout(timer);
    };
  }, []);

  return (
    <nav
      className={cn(
        "absolute right-5 top-5 z-20 flex items-center gap-2 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-15",
      )}
    >
      {items.map(({ to, label, Icon }) => (
        <Link
          key={label}
          to={to}
          aria-label={label}
          className="glass-soft group inline-flex items-center gap-2 rounded-full px-3 py-2 text-stage-foreground/80 transition-all duration-300 hover:text-stage-foreground hover:shadow-lift"
        >
          <Icon className="size-4" strokeWidth={1.6} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
