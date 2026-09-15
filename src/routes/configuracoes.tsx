import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { SlideStage } from "@/components/SlideStage";
import { appearanceLabels, appearances } from "@/lib/appearance";
import { usePresentation } from "@/lib/presentation";
import { clearCustomHymns, loadCustomHymns, parseHymnImport, saveCustomHymns } from "@/lib/harpa";
import { menuBackgroundOptions } from "@/lib/menu-background";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Assembleia de Deus Renascer" },
      {
        name: "description",
        content:
          "Ajuste tema, tamanho da fonte, espaçamento, margens e transições da tela de projeção.",
      },
      { property: "og:title", content: "Configurações — Assembleia de Deus Renascer" },
      { property: "og:description", content: "Preferências de exibição e importação de hinos." },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { settings, updateSettings, resetSettings, slides, current } = usePresentation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [custom, setCustom] = useState(() =>
    typeof window === "undefined" ? 0 : loadCustomHymns().length,
  );

  const importFile = async (file: File) => {
    try {
      const hymns = parseHymnImport(await file.text());
      if (!hymns.length) throw new Error("vazio");
      saveCustomHymns(hymns);
      setCustom(hymns.length);
      toast.success(`${hymns.length} hinos importados`);
    } catch {
      toast.error("Arquivo inválido. Use JSON com número, título e estrofes.");
    }
  };

  const preview = slides[current] ?? {
    id: "preview",
    kind: "verse" as const,
    reference: "Pré-visualização",
    label: "Pré-visualização",
    lines: ["Exemplo de texto na tela", "para conferir tamanho e espaçamento."],
    theme: "ceu" as const,
  };

  return (
    <AppShell title="Configurações" subtitle="Aparência, projeção e conteúdo">
      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <section className="glass-soft space-y-6 rounded-2xl p-5">
          <Field label="Tema">
            <div className="flex flex-wrap gap-2">
              {appearances.map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ appearance: mode })}
                  className={cn(
                    "rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.15em]",
                    settings.appearance === mode
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {appearanceLabels[mode]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              “Foto viva” deixa as imagens bem mais visíveis atrás da letra.
            </p>
          </Field>

          <Field label="Estilo do menu principal">
            <div className="inline-flex rounded-full border border-border p-1">
              {(["painel", "classico", "animado", "cinema", "santuario"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ menuStyle: m })}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em]",
                    (settings.menuStyle ?? "painel") === m
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {m === "painel"
                    ? "Painel"
                    : m === "classico"
                      ? "Clássico"
                      : m === "animado"
                        ? "Animado"
                        : m === "cinema"
                          ? "Cinema"
                          : "Santuário"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Imagem do menu principal">
            <div className="grid grid-cols-2 gap-3">
              {menuBackgroundOptions.map((option) => {
                const selected = (settings.menuBackground ?? "original") === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateSettings({ menuBackground: option.value })}
                    className={cn(
                      "group overflow-hidden rounded-xl border bg-card text-left transition-colors",
                      selected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/60",
                    )}
                  >
                    <img
                      src={option.image}
                      alt={`Imagem ${option.label.toLowerCase()} do menu principal`}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="flex items-center justify-between px-3 py-2 text-xs font-medium">
                      {option.label}
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          selected ? "bg-primary" : "bg-muted",
                        )}
                        aria-hidden
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Usada nos estilos Painel e Santuário.
            </p>
          </Field>

          <Range
            label="Tamanho da fonte"
            value={settings.fontScale}
            min={0.5}
            max={2}
            step={0.05}
            onChange={(v) => updateSettings({ fontScale: v })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Range
            label="Espaçamento entre linhas"
            value={settings.lineHeight}
            min={1}
            max={2}
            step={0.05}
            onChange={(v) => updateSettings({ lineHeight: v })}
            format={(v) => v.toFixed(2)}
          />
          <Range
            label="Margens da projeção"
            value={settings.margin}
            min={2}
            max={16}
            step={1}
            onChange={(v) => updateSettings({ margin: v })}
            format={(v) => `${v}%`}
          />
          <Range
            label="Brilho das fotos"
            value={settings.photoBrightness ?? 125}
            min={125}
            max={300}
            step={5}
            onChange={(v) => updateSettings({ photoBrightness: v })}
            format={(v) => `${v}%`}
          />
          <Range
            label="Translucidez do contêiner"
            value={settings.containerOpacity}
            min={0}
            max={100}
            step={1}
            onChange={(v) => updateSettings({ containerOpacity: v })}
            format={(v) => `${v}%`}
          />

          <Field label="Alinhamento">
            <div className="inline-flex rounded-full border border-border p-1">
              {(["center", "left"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => updateSettings({ align: a })}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em]",
                    settings.align === a
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {a === "center" ? "Centro" : "Esquerda"}
                </button>
              ))}
            </div>
          </Field>

          <Toggle
            label="Transição suave (fade)"
            checked={settings.transition === "fade"}
            onChange={(v) => updateSettings({ transition: v ? "fade" : "none" })}
          />
          <Toggle
            label="Ajuste automático da fonte"
            checked={settings.autoFit}
            onChange={(v) => updateSettings({ autoFit: v })}
          />
          <Toggle
            label="Imagem de fundo na projeção"
            checked={settings.showBackground}
            onChange={(v) => updateSettings({ showBackground: v })}
          />
          <Toggle
            label="Mostrar referência no slide"
            checked={settings.showReference}
            onChange={(v) => updateSettings({ showReference: v })}
          />

          <Field label="Posição do título">
            <div className="inline-flex rounded-full border border-border p-1">
              {(["top", "bottom"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => updateSettings({ referencePosition: p })}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.15em]",
                    (settings.referencePosition ?? "bottom") === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {p === "top" ? "Em cima" : "Embaixo"}
                </button>
              ))}
            </div>
          </Field>

          <Toggle
            label="Mostrar contêiner atrás da letra"
            checked={settings.showContainer !== false}
            onChange={(v) => updateSettings({ showContainer: v })}
          />

          <div className="border-t border-border/60 pt-5">
            <p className="font-display text-sm">Hinos da Harpa</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {custom > 0
                ? `${custom} hinos importados em uso.`
                : "638 hinos incluídos. Você também pode importar um arquivo JSON próprio."}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                Importar arquivo
              </button>
              {custom > 0 && (
                <button
                  onClick={() => {
                    clearCustomHymns();
                    setCustom(0);
                    toast.success("Voltou aos 638 hinos incluídos");
                  }}
                  className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importFile(file);
                e.target.value = "";
              }}
            />
          </div>

          <button
            onClick={resetSettings}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Restaurar padrões
          </button>
        </section>

        <section>
          <p className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Pré-visualização da projeção
          </p>
          <div className="aspect-video overflow-hidden rounded-2xl border border-glass-border">
            <SlideStage slide={preview} settings={settings} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background transition-transform",
            checked ? "translate-x-[1.4rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </label>
  );
}
