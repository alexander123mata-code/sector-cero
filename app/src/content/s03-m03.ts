import type { Mision } from "../types/mission";

export const s03m03: Mision = {
  id: "s03-m03-salir",
  sector: 3,
  titulo: "Salir a tiempo",
  concepto: ["break", "busqueda", "indice"],
  requiere: ["s03-m02-pares"],
  minutos: 12,
  xp: 100,
  enunciado:
    "Encuentra la posicion del primer numero negativo de `lecturas` y guardala en `posicion`. " +
    "En cuanto lo encuentres deja de buscar. Si no hay ninguno, `posicion` vale -1.",
  plantilla: "posicion = -1\n\n# tu codigo aqui\n",
  salida: "posicion",
  pruebas: [
    { entrada: { lecturas: [8, 3, -4, 7, -9] }, salida: 2, oculta: false },
    { entrada: { lecturas: [1, 2, 3] }, salida: -1, oculta: false },
    { entrada: { lecturas: [-5, -1] }, salida: 0, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["Break"],
    prohibeNodo: [],
    presupuestoOps: 40,
  },
  pistas: [
    "`range(len(lecturas))` te da las posiciones 0, 1, 2... en vez de los valores.",
    "Cuando encuentres el negativo, guarda la posicion y usa `break` para cortar el bucle.",
    "for i in range(len(lecturas)):\n    if lecturas[i] < 0:\n        posicion = i\n        break",
  ],
  fallosPrevistos: [
    {
      cuando: { tipo: "salida", valor: 4 },
      dice: "Estas devolviendo la posicion del ultimo negativo, no del primero. Sin break el bucle sigue y sobrescribe el valor.",
    },
    {
      cuando: { tipo: "error", contiene: "IndexError" },
      dice: "Te sales de la lista. Recuerda que la ultima posicion valida es len(lecturas) - 1.",
    },
  ],
};
