import type { Mision } from "../types/mission";

export const s01m01: Mision = {
  tipo: "logica",
  id: "s01-m01-literal",
  sector: 1,
  titulo: "La maquina no adivina",
  concepto: ["instruccion", "literal", "ambiguedad"],
  requiere: ["s00-m06-commit"],
  minutos: 12,
  xp: 120,
  enunciado:
    "Antes de escribir una linea de codigo hay que aceptar una cosa incomoda: la maquina no entiende lo que quieres decir, solo lo que dices. Aqui no se escribe nada. Solo se piensa.",
  ejemplo: {
    situacion: "Un robot tiene que encender una lampara que esta desenchufada.",
    codigo: "1. enchufa la lampara\n2. pulsa el interruptor",
    comentario:
      "Dos pasos y un orden. Al reves, el robot pulsa el interruptor de una lampara desenchufada y la habitacion sigue a oscuras. No protesta ni se da cuenta: hace lo que pone, en el orden en que pone.",
  },
  ejercicios: [
    {
      forma: "eleccion",
      pregunta: "Un robot sigue estas instrucciones al pie de la letra. Que pasa?",
      muestra: "1. coge el vaso\n2. abre el grifo\n3. pon el vaso debajo del grifo\n4. cierra el grifo",
      opciones: [
        "El vaso acaba lleno de agua.",
        "El agua cae sobre la encimera hasta que el vaso llega debajo.",
        "El robot corrige el orden por su cuenta y llena el vaso.",
        "El robot se para en el paso 3 porque el grifo ya estaba abierto.",
      ],
      correcta: 1,
      porque:
        "El grifo se abre en el paso 2 y el vaso no llega hasta el 3. Entre esos dos instantes el agua cae al aire. Tu al leerlo has entendido la intencion; el robot no lee intenciones, ejecuta lineas.",
    },
    {
      forma: "orden",
      pregunta: "Ordena los mismos pasos para que el vaso acabe lleno y la encimera seca.",
      piezas: [
        "coge el vaso",
        "pon el vaso debajo del grifo",
        "abre el grifo",
        "cierra el grifo",
      ],
      porque:
        "El vaso tiene que estar en su sitio antes de que salga agua. No hay nada mas: las mismas cuatro instrucciones, otro orden, otro resultado.",
    },
    {
      forma: "eleccion",
      pregunta: "Cual de estos pasos NO puede ejecutar una maquina tal como esta escrito?",
      muestra: "1. echa un litro de agua en la olla\n2. anade sal al gusto\n3. espera a que el agua hierva",
      opciones: [
        "El 1: un litro es demasiado impreciso.",
        "El 2: 'al gusto' no dice cuanta sal.",
        "El 3: una maquina no sabe esperar.",
        "Ninguno: los tres son ejecutables.",
      ],
      correcta: 1,
      porque:
        "Un litro es una cantidad y esperar a que algo ocurra es una condicion: las dos se pueden comprobar. 'Al gusto' depende de un gusto, y la maquina no tiene. Todo paso tiene que poder responderse con un si o un no, o con un numero.",
    },
    {
      forma: "eleccion",
      pregunta:
        "Le dices a un robot: 'trae las sillas del salon'. Hay cuatro sillas. Que falta en esa instruccion?",
      opciones: [
        "Falta decir cuantas sillas y adonde traerlas.",
        "Nada: el robot vera las cuatro sillas y las traera.",
        "Falta decir de que color son las sillas.",
        "Falta pedirlo por favor.",
      ],
      correcta: 0,
      porque:
        "Tu sabes que 'las sillas' son todas y que 'trae' significa traerlas aqui. Los dos datos estan en tu cabeza, no en la frase. Programar es, casi siempre, sacarse esas cosas de la cabeza y escribirlas.",
    },
  ],
  repaso: {
    resumen:
      "Acabas de hacer lo unico que importa antes de aprender un lenguaje: separar lo que querias decir de lo que has dicho.",
    piezas: [
      {
        parte: "el orden",
        hace: "Las instrucciones se ejecutan de arriba abajo, una detras de otra. Cambiar dos de sitio cambia el resultado aunque las palabras sean las mismas.",
      },
      {
        parte: "lo literal",
        hace: "La maquina no completa lo que falta ni corrige lo que esta mal puesto. Si un paso dice algo impreciso, se rompe ahi.",
      },
      {
        parte: "lo que das por supuesto",
        hace: "Cuantos, cual, adonde, hasta cuando. Cuando un programa hace algo raro, casi siempre es un dato que estaba en tu cabeza y no en el codigo.",
      },
    ],
    ojo: "Esto no cambia nunca. Dentro de diez sectores seguiras arreglando errores que son exactamente esto.",
  },
  pistas: [
    "Lee cada paso como si no supieras para que sirve el conjunto. Solo ese paso, solo lo que dice.",
    "Pregunta a cada instruccion: se puede responder con un si, un no o un numero? Si no, la maquina no puede ejecutarla.",
    "Cuando dudes entre dos opciones, quedate con la que da mas pena: la maquina siempre hace lo tonto.",
  ],
};
