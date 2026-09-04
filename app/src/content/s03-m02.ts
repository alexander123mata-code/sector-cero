import type { Mision } from "../types/mission";

export const s03m02: Mision = {
  tipo: "codigo",
  id: "s03-m02-pares",
  sector: 3,
  titulo: "Solo los pares",
  concepto: ["for", "if", "modulo"],
  requiere: ["s03-m01-contador"],
  minutos: 8,
  xp: 80,
  enunciado:
    "Recorre la lista `numeros` y suma unicamente los que sean pares. " +
    "Un numero es par cuando el resto de dividirlo entre 2 es cero. Guarda el resultado en `total`.",
  plantilla: "total = 0\n\n# tu codigo aqui\n",
  solucion: "total = 0\nfor n in numeros:\n    if n % 2 == 0:\n        total = total + n\n",
  salida: "total",
  pruebas: [
    { entrada: { numeros: [4, 7, 2, 9, 12] }, salida: 18, oculta: false },
    { entrada: { numeros: [] }, salida: 0, oculta: false },
    { entrada: { numeros: [1, 3, 5] }, salida: 0, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["For", "If"],
    prohibeNodo: ["While"],
    presupuestoOps: 40,
  },
  pistas: [
    "`for n in numeros:` te da cada elemento de la lista, uno por vuelta.",
    "El operador % devuelve el resto de una division: `n % 2` vale 0 en los pares.",
    "for n in numeros:\n    if n % 2 == 0:\n        total = total + n",
  ],
  fallosPrevistos: [
    {
      cuando: { tipo: "salida", valor: 34 },
      dice: "Estas sumando todos los numeros, no solo los pares. Falta la condicion dentro del bucle.",
    },
    {
      cuando: { tipo: "salida", valor: 16 },
      dice: "Tienes la condicion al reves: `n % 2 == 1` selecciona los impares.",
    },
  ],
};
