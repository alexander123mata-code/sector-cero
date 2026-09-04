import type { Mision } from "../types/mission";

export const s03m04: Mision = {
  tipo: "codigo",
  id: "s03-m04-centinela",
  sector: 3,
  titulo: "El bucle que no sabe cuando parar",
  concepto: ["while", "centinela", "acumulador"],
  requiere: ["s03-m03-salir"],
  minutos: 12,
  xp: 120,
  enunciado:
    "El sensor devuelve una lectura cada vez que lo llamas. Cuando se queda sin datos devuelve -1. " +
    "Suma todas las lecturas validas y deten el bucle en cuanto aparezca ese centinela. Guarda el resultado en `total`.",
  plantilla:
    "total = 0\n\nwhile True:\n    lectura = leer_sensor()\n    # tu codigo aqui\n",
  solucion: "total = 0\nwhile True:\n    lectura = leer_sensor()\n    if lectura == -1:\n        break\n    total = total + lectura\n",
  ejemplo: {
    situacion: "Una cinta transportadora entrega cajas hasta que entrega una vacia.",
    codigo: "cajas = 0\n\nwhile True:\n    peso = siguiente_caja()\n    if peso == 0:\n        break\n    cajas = cajas + 1\n\n# se paro al llegar la caja vacia",
    comentario: "Un centinela es un valor acordado que significa 'se acabo'. Aqui es el 0. `while True` repite sin condicion propia, asi que la unica forma de salir es el `break`. Fijate en el orden: primero se comprueba si es el centinela y se sale, y solo despues se cuenta. Si lo haces al reves, cuentas tambien la caja vacia.",
  },
  salida: "total",
  sensor: { nombre: "leer_sensor", desde: "lecturas", agotado: -1 },
  pruebas: [
    { entrada: { lecturas: [12, 8, 5, -1] }, salida: 25, oculta: false },
    { entrada: { lecturas: [-1] }, salida: 0, oculta: false },
    { entrada: { lecturas: [4, -1, 99] }, salida: 4, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["While"],
    prohibeNodo: ["For", "Return"],
    presupuestoOps: 40,
  },
  pistas: [
    "Que valor te dice el sensor que ya no hay mas lecturas?",
    "Necesitas revisar ese valor antes de sumarlo al total.",
    "if lectura == -1:\n    break\ntotal = total + lectura",
  ],
  fallosPrevistos: [
    {
      cuando: { tipo: "salida", valor: 24 },
      dice: "Casi. Estas sumando el -1 al total: sal del bucle antes de acumular.",
    },
    {
      cuando: { tipo: "timeout" },
      dice: "El bucle nunca termina. Hay algun camino que llegue a un break?",
    },
  ],
};
