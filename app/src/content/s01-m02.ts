import type { Mision } from "../types/mission";

export const s01m02: Mision = {
  tipo: "logica",
  id: "s01-m02-cajas",
  sector: 1,
  titulo: "Cajas con nombre",
  concepto: ["variable", "valor", "asignacion"],
  requiere: ["s01-m01-literal"],
  minutos: 12,
  xp: 130,
  enunciado:
    "Un programa necesita recordar cosas mientras trabaja. Lo hace guardandolas en cajas con nombre. Aqui vas a seguir el rastro de una caja paso a paso, que es lo que tendras que hacer con la cabeza cada vez que algo no salga.",
  ejemplo: {
    situacion: "Una caja llamada 'monedas' pasa por tres instrucciones.",
    codigo: "pon 3 en monedas\npon 10 en monedas\nsuma 1 a monedas\n\nal final monedas vale 11",
    comentario:
      "La segunda linea no anade nada: sustituye. El 3 desaparece en cuanto entra el 10, y ya nadie puede recuperarlo. Una caja guarda un valor, no una lista de todos los que tuvo.",
  },
  ejercicios: [
    {
      forma: "tabla",
      pregunta: "Sigue la caja 'puntos' instruccion a instruccion. Cuanto vale despues de cada una?",
      columnas: ["paso", "instruccion", "puntos vale"],
      opciones: ["0", "4", "7", "10", "14"],
      filas: [
        { celdas: ["1", "pon 4 en puntos"], respuesta: "4" },
        { celdas: ["2", "suma 3 a puntos"], respuesta: "7" },
        { celdas: ["3", "pon 10 en puntos"], respuesta: "10" },
        { celdas: ["4", "suma 4 a puntos"], respuesta: "14" },
      ],
      porque:
        "'Pon' machaca lo que hubiera; 'suma' parte de lo que hay. Por eso el paso 3 tira por la borda todo lo anterior y el 4 sigue desde 10, no desde 7.",
    },
    {
      forma: "eleccion",
      pregunta: "Cuanto vale 'total' al final?",
      muestra: "pon 5 en total\npon 8 en otro\nsuma otro a total\npon 2 en otro",
      opciones: ["5", "7", "13", "15"],
      correcta: 2,
      porque:
        "Cuando se ejecuta 'suma otro a total', otro valia 8: total pasa a 13. La ultima linea cambia otro, pero total ya se llevo su copia del 8. Cambiar una caja despues no rehace las cuentas que ya se hicieron.",
    },
    {
      forma: "eleccion",
      pregunta: "Quieres intercambiar el contenido de dos cajas: a vale 1 y b vale 2. Sirve esto?",
      muestra: "pon b en a\npon a en b",
      opciones: [
        "Si: a acaba valiendo 2 y b acaba valiendo 1.",
        "No: las dos acaban valiendo 2.",
        "No: las dos acaban valiendo 1.",
        "No: da error porque una caja no se puede copiar en otra.",
      ],
      correcta: 1,
      porque:
        "La primera linea mete el 2 en a, y con eso el 1 se pierde para siempre. La segunda copia en b lo que hay en a ahora, que ya es 2. Para intercambiar hace falta una tercera caja donde aparcar el primer valor antes de machacarlo.",
    },
    {
      forma: "orden",
      pregunta: "Ordena estas tres instrucciones para intercambiar de verdad a y b.",
      piezas: ["pon a en guardado", "pon b en a", "pon guardado en b"],
      porque:
        "Guardas el valor de a antes de perderlo, machacas a con b, y recuperas el valor guardado en b. La caja de mas no es un truco: es la unica forma, porque cada 'pon' destruye lo que habia.",
    },
  ],
  repaso: {
    resumen:
      "Has seguido el rastro de un valor por un programa. Es la herramienta con la que vas a arreglar la mayoria de tus errores.",
    piezas: [
      {
        parte: "pon X en la caja",
        hace: "Sustituye. Lo que hubiera dentro se pierde y no hay forma de recuperarlo.",
      },
      {
        parte: "suma X a la caja",
        hace: "Parte de lo que hay ahora mismo. El resultado depende de todo lo que paso antes.",
      },
      {
        parte: "el valor viaja, la caja no",
        hace: "Al copiar una caja en otra se copia el valor de ese instante. Cambiar el original despues no cambia la copia.",
      },
    ],
    ojo: "Cuando un programa te de un numero raro, coge papel y haz esta misma tabla. El fallo esta en el paso donde la columna deja de coincidir con lo que esperabas.",
  },
  pistas: [
    "Ve linea a linea y anota el valor despues de cada una. No intentes verlo todo de golpe.",
    "'Pon' borra. 'Suma' acumula. Casi todos los fallos de esta mision son confundir una con otra.",
    "Para el intercambio: si machacas a antes de haber guardado su valor en algun sitio, ese valor ya no existe.",
  ],
};
