import type { Mision } from "../types/mission";

export const s03m01: Mision = {
  tipo: "codigo",
  id: "s03-m01-contador",
  sector: 3,
  titulo: "El contador que no cuenta",
  concepto: ["while", "contador", "acumulador"],
  requiere: ["s00-m06-commit"],
  minutos: 8,
  xp: 80,
  enunciado:
    "Suma todos los numeros enteros desde 1 hasta `objetivo`, ambos incluidos. " +
    "Si `objetivo` es 0 el total es 0. Guarda el resultado en `total`.",
  plantilla: "# objetivo ya existe: cada prueba le pone su valor. No la declares tu.\n\ntotal = 0\nn = 1\n\n# tu codigo aqui\n",
  solucion: "total = 0\nn = 1\nwhile n <= objetivo:\n    total = total + n\n    n = n + 1\n",
  ejemplo: {
    situacion: "Cuanto pesan 3 cajas de 10 kilos, sumandolas de una en una.",
    codigo: "total = 0\nveces = 0\n\nwhile veces < 3:\n    total = total + 10\n    veces = veces + 1\n\n# al terminar, total vale 30",
    comentario: "Hay tres piezas. `total` guarda lo que llevas acumulado y empieza en 0. `veces` cuenta las vueltas y sube de una en una. La condicion `veces < 3` decide si hay otra vuelta: cuando deja de ser cierta, el bucle termina. Las lineas de dentro van sangradas cuatro espacios; asi sabe Python que pertenecen al while. Ojo a una diferencia con tu mision: aqui siempre se suma lo mismo (10), mientras que a ti te toca sumar un numero que cambia en cada vuelta.",
  },
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
      cuando: { tipo: "salida", valor: 120 },
      dice: "Estas multiplicando los numeros en vez de sumarlos: 1x2x3x4x5 da 120, pero 1+2+3+4+5 da 15. Revisa el signo de la linea que acumula.",
    },
    {
      cuando: { tipo: "salida", valor: 5 },
      dice: "Sumas 1 en cada vuelta, asi que estas contando cuantas vueltas das: con objetivo 5 das 5 vueltas y sale 5. Lo que hay que sumar es el numero de esa vuelta, que va cambiando.",
    },
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
