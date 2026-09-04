import type { Mision } from "../types/mission";

export const s03m05: Mision = {
  id: "s03-m05-rejilla",
  sector: 3,
  titulo: "La rejilla",
  concepto: ["bucles anidados", "matrices", "contador"],
  requiere: ["s03-m04-centinela"],
  minutos: 15,
  xp: 140,
  enunciado:
    "`rejilla` es una lista de filas, y cada fila es una lista de celdas. " +
    "Un 1 es un obstaculo y un 0 es suelo libre. Cuenta cuantos obstaculos hay en total y guardalo en `obstaculos`.",
  plantilla: "obstaculos = 0\n\n# tu codigo aqui\n",
  solucion: "obstaculos = 0\nfor fila in rejilla:\n    for celda in fila:\n        if celda == 1:\n            obstaculos = obstaculos + 1\n",
  salida: "obstaculos",
  pruebas: [
    {
      entrada: { rejilla: [[0, 1, 0], [1, 1, 0], [0, 0, 1]] },
      salida: 4,
      oculta: false,
    },
    { entrada: { rejilla: [[0, 0], [0, 0]] }, salida: 0, oculta: false },
    { entrada: { rejilla: [[1], [1], [0]] }, salida: 2, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["For"],
    prohibeNodo: [],
    presupuestoOps: 60,
  },
  pistas: [
    "Necesitas dos bucles: uno que recorra las filas y otro que recorra las celdas de cada fila.",
    "El bucle de dentro se ejecuta entero por cada vuelta del de fuera.",
    "for fila in rejilla:\n    for celda in fila:\n        if celda == 1:\n            obstaculos = obstaculos + 1",
  ],
  fallosPrevistos: [
    {
      cuando: { tipo: "salida", valor: 3 },
      dice: "Estas contando filas que contienen algun obstaculo, no obstaculos. Necesitas mirar celda a celda.",
    },
    {
      cuando: { tipo: "error", contiene: "TypeError" },
      dice: "Estas comparando una fila entera con 1. El bucle de dentro es el que te da las celdas.",
    },
  ],
};
