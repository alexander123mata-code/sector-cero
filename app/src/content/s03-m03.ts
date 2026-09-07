import type { Mision } from "../types/mission";

export const s03m03: Mision = {
  tipo: "codigo",
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
  plantilla: "# lecturas ya existe: cada prueba le pone su valor. No la declares tu.\n\nposicion = -1\n\n# tu codigo aqui\n",
  solucion: "posicion = -1\nfor i in range(len(lecturas)):\n    if lecturas[i] < 0:\n        posicion = i\n        break\n",
  ejemplo: {
    situacion: "Encontrar en que posicion aparece la primera letra 'l' de una palabra.",
    codigo: "palabra = \"hola\"\ndonde = -1\n\nfor i in range(len(palabra)):\n    if palabra[i] == \"l\":\n        donde = i\n        break\n\n# al terminar, donde vale 2",
    comentario: "`range(len(palabra))` da las posiciones 0, 1, 2... en vez de las letras, y `palabra[i]` es la letra que hay en la posicion `i`. Las posiciones empiezan en 0, asi que la 'h' es la 0. `break` corta el bucle en el acto: sin el, el bucle seguiria hasta el final y `donde` acabaria guardando la ultima coincidencia en vez de la primera.",
  },
  salida: "posicion",
  repaso: {
    "resumen": "Acabas de hacer una busqueda: recorrer hasta encontrar algo y parar en cuanto aparece.",
    "piezas": [
      {
        "parte": "posicion = -1",
        "hace": "El valor de 'no encontrado'. Si el bucle termina sin encontrar nada, este es el que queda."
      },
      {
        "parte": "for i in range(len(lecturas)):",
        "hace": "range(len(...)) da las posiciones 0, 1, 2... en vez de los valores. Aqui necesitas la posicion, no el numero."
      },
      {
        "parte": "if lecturas[i] < 0:",
        "hace": "lecturas[i] es el valor que hay en la posicion i. Asi comparas el valor pero conservas donde estaba."
      },
      {
        "parte": "posicion = i",
        "hace": "Guarda donde lo encontraste."
      },
      {
        "parte": "break",
        "hace": "Corta el bucle en el acto. Sin el seguirias mirando y acabarias con la ultima coincidencia en vez de la primera."
      }
    ],
    "ojo": "Parar al encontrar ahorra trabajo de verdad: en una lista larga, break es la diferencia entre mirar 3 elementos o 3000."
  },
  pruebas: [
    { entrada: { lecturas: [8, 3, -4, 7, -9] }, salida: 2, oculta: false },
    { entrada: { lecturas: [1, 2, 3] }, salida: -1, oculta: false },
    { entrada: { lecturas: [-5, -1] }, salida: 0, oculta: true },
  ],
  restricciones: {
    exigeNodo: ["Break"],
    prohibeNodo: [],
    presupuestoOps: 12,
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
