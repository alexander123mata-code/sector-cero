import { useSyncExternalStore } from "react";

/**
 * Los tres paneles piden 372 + 380 fijos mas un editor usable. Por debajo de
 * este ancho no caben los tres a la vez y hay que juntar briefing y resultado.
 */
export const ANCHO_TRES_PANELES = 1180;

const CONSULTA = `(min-width: ${ANCHO_TRES_PANELES}px)`;
const hayMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";

function suscribir(avisar: () => void): () => void {
  if (!hayMatchMedia) return () => {};
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  // Red de seguridad: hay entornos donde el viewport cambia sin que la media
  // query emita su evento. `resize` siempre llega, y leer es barato.
  window.addEventListener("resize", avisar);
  return () => {
    mq.removeEventListener("change", avisar);
    window.removeEventListener("resize", avisar);
  };
}

const leer = () => (hayMatchMedia ? window.matchMedia(CONSULTA).matches : true);

/** Suscripcion a una fuente externa, sin efecto ni estado duplicado. */
export function useCabenTresPaneles(): boolean {
  return useSyncExternalStore(suscribir, leer, () => true);
}
