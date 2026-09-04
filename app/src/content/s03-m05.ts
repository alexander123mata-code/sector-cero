import type { Mision } from "../types/mission";

export const s03m05: Mision = {
  tipo: "codigo",
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
  plantilla: "# rejilla ya existe: cada prueba le pone su valor. No la declares tu.\n\nobstaculos = 0\n\n# tu codigo aqui\n",
  solucion: "obstaculos = 0\nfor fila in rejilla:\n    for celda in fila:\n        if celda == 1:\n            obstaculos = obstaculos + 1\n",
  ejemplo: {
    situacion: "Contar cuantas fichas hay en un tablero de dos filas.",
    codigo: "fichas = 0\n\nfor fila in [[1, 0], [0, 1]]:\n    for casilla in fila:\n        if casilla == 1:\n            fichas = fichas + 1\n\n# al terminar, fichas vale 2",
    comentario: "El bucle de fuera te da una fila entera en cada vuelta; el de dentro recorre las casillas de esa fila. El de dentro se ejecuta completo por cada vuelta del de fuera, asi que con 2 filas de 2 casillas se miran 4 casillas en total. Cada nivel anadido lleva cuatro espacios mas de sangria.",
  },
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
