import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

/** Pesquisa única: identifica se o termo é referência bíblica, hino ou palavra. */
export function UnifiedSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (/^(hino|harpa)\s*\d+/i.test(q) || /^\d{1,3}$/.test(q)) {
      navigate({ to: "/harpa", search: { q } });
    } else {
      navigate({ to: "/biblia", search: { q } });
    }
  };

  return (
    <form onSubmit={submit} className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.6}
      />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pesquisar Bíblia ou Harpa..."
        aria-label="Pesquisar Bíblia ou Harpa"
        className="glass-soft h-12 w-full rounded-full pl-11 pr-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </form>
  );
}
