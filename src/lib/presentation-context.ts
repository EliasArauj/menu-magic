import { createContext } from "react";

/**
 * Contexto isolado num módulo sem componentes: assim o Fast Refresh não
 * recria a identidade do contexto ao editar presentation.tsx.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PresentationContext = createContext<any | null>(null);
