import { create } from "zustand";
import { persist } from "zustand/middleware";
import { misiones } from "../content";

export type EstadoMision = {
  codigo: string;
  estrellas: 0 | 1 | 2 | 3;
  superada: boolean;
  intentos: number;
  pistasUsadas: number;
  xpGanado: number;
};

type Estado = {
  actual: string;
  porMision: Record<string, EstadoMision>;
  irA: (id: string) => void;
  escribir: (id: string, codigo: string) => void;
  pedirPista: (id: string) => void;
  registrar: (id: string, estrellas: 0 | 1 | 2 | 3, superada: boolean) => void;
  reiniciarTodo: () => void;
};

const COSTE_PISTA = 20;

export const vacio = (codigo: string): EstadoMision => ({
  codigo,
  estrellas: 0,
  superada: false,
  intentos: 0,
  pistasUsadas: 0,
  xpGanado: 0,
});

function inicial(): Record<string, EstadoMision> {
  return Object.fromEntries(
    misiones.map((m) => [m.id, vacio(m.tipo === "codigo" ? m.plantilla : "")]),
  );
}

export const usarProgreso = create<Estado>()(
  persist(
    (set) => ({
      actual: misiones[0].id,
      porMision: inicial(),

      irA: (id) => set({ actual: id }),

      escribir: (id, codigo) =>
        set((s) => ({
          porMision: { ...s.porMision, [id]: { ...s.porMision[id], codigo } },
        })),

      pedirPista: (id) =>
        set((s) => {
          const m = s.porMision[id];
          return {
            porMision: {
              ...s.porMision,
              [id]: { ...m, pistasUsadas: m.pistasUsadas + 1 },
            },
          };
        }),

      /**
       * El XP de una mision es el mejor resultado obtenido, no la suma de
       * intentos: reintentar para subir de estrella nunca debe penalizar.
       */
      registrar: (id, estrellas, superada) =>
        set((s) => {
          const m = s.porMision[id];
          const mision = misiones.find((x) => x.id === id)!;
          const mejores = Math.max(m.estrellas, estrellas) as 0 | 1 | 2 | 3;
          const bruto = superada ? Math.round((mision.xp * mejores) / 3) : 0;
          const xpGanado = Math.max(
            m.xpGanado,
            Math.max(0, bruto - m.pistasUsadas * COSTE_PISTA),
          );
          return {
            porMision: {
              ...s.porMision,
              [id]: {
                ...m,
                intentos: m.intentos + 1,
                estrellas: mejores,
                superada: m.superada || superada,
                xpGanado,
              },
            },
          };
        }),

      reiniciarTodo: () => set({ actual: misiones[0].id, porMision: inicial() }),
    }),
    {
      name: "sector-cero-progreso-v1",
      /**
       * Anadir misiones es lo normal en este proyecto, asi que el progreso
       * guardado siempre va por detras del contenido. Se rellenan las que
       * falten sin tocar lo que el jugador ya consiguio.
       */
      merge: (persistido, actual) => {
        const p = persistido as Partial<Estado> | undefined;
        return {
          ...actual,
          ...p,
          porMision: { ...inicial(), ...(p?.porMision ?? {}) },
        };
      },
    },
  ),
);

export const xpTotal = (porMision: Record<string, EstadoMision>) =>
  Object.values(porMision).reduce((t, m) => t + m.xpGanado, 0);

export const estrellasTotales = (porMision: Record<string, EstadoMision>) =>
  Object.values(porMision).reduce((t, m) => t + m.estrellas, 0);

export const desbloqueada = (
  id: string,
  porMision: Record<string, EstadoMision>,
): boolean => {
  const m = misiones.find((x) => x.id === id);
  if (!m) return false;
  // Una mision ya superada sigue accesible aunque el grafo cambie despues:
  // reencadenar el temario no puede quitarle a nadie algo que ya gano.
  if (porMision[id]?.superada) return true;
  return m.requiere.every((r) => porMision[r]?.superada);
};
