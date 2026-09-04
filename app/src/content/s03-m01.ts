import type { Mision } from "../types/mission";

export const s03m01: Mision = {
  id: "s03-m01-contador",
  sector: 3,
  titulo: "El contador que no cuenta",
  concepto: ["while", "contador", "acumulador"],
  requiere: [],
  minutos: 8,
  xp: 80,
  enunciado:
    "Suma todos los numeros enteros desde 1 hasta `objetivo`, ambos incluidos. " +
    "Si `objetivo` es 0 el total es 0. Guarda el resultado en `total`.",
  plantilla: "total = 0\nn = 1\n\n# tu codigo aqui\n",
  salida: "total",
  pruebas: [
    { entrada: { objetivo: 5 }, salida: 15, oculta: false },
    { entrada: { objetivo: 1 }, salida: 1, oculta: false },
    { entrada: { objetivo: 0 }, salida: 0, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["While"],
    prohibeNodo: ["For"],
    presupuestoOps: 40,
  },
  pistas: [
    "El bucle tiene que repetirse mientras `n` no pase de `objetivo`.",
    "Dentro del bucle necesitas dos cosas: sumar `n` al total y avanzar `n`.",
    "while n <= objetivo:\n    total = total + n\n    n = n + 1",
  ],
  fallosPrevistos: [
    {
      cuando: { tipo: "salida", valor: 21 },
      dice: "Te pasas por uno: estas sumando tambien el numero siguiente a `objetivo`. Revisa si la condicion usa <= o <.",
    },
    {
      cuando: { tipo: "salida", valor: 10 },
      dice: "Te quedas corto por uno. Con `n < objetivo` nunca llegas a sumar el propio `objetivo`.",
    },
    {
      cuando: { tipo: "timeout" },
      dice: "El bucle no termina nunca. Si `n` no cambia dentro del bucle, la condicion siempre sera cierta.",
    },
  ],
};
