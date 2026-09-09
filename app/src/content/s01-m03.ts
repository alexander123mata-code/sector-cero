import type { Mision } from "../types/mission";

export const s01m03: Mision = {
  tipo: "logica",
  id: "s01-m03-verdad",
  sector: 1,
  titulo: "Solo hay dos respuestas",
  concepto: ["condicion", "verdadero y falso", "comparacion"],
  requiere: ["s01-m02-cajas"],
  minutos: 12,
  xp: 130,
  enunciado:
    "Para decidir, un programa hace preguntas que solo admiten dos respuestas: verdadero o falso. Ni 'depende', ni 'casi'. Aqui vas a contestar esas preguntas antes de que las tenga que contestar la maquina.",
  ejemplo: {
    situacion: "La pregunta es: la edad es mayor que 17?",
    codigo: "edad = 20  ->  verdadero\nedad = 18  ->  verdadero\nedad = 17  ->  falso\nedad = 9   ->  falso",
    comentario:
      "Fijate en el 17: 'mayor que 17' deja fuera al propio 17. Si querias incluirlo, la pregunta era otra: 'es 17 o mas'. Ese borde de un solo numero es uno de los errores mas comunes que existen.",
  },
  ejercicios: [
    {
      forma: "tabla",
      pregunta: "Un cine deja entrar si la edad es 13 o mas. Contesta la pregunta para cada persona.",
      columnas: ["edad", "la edad es 13 o mas?"],
      opciones: ["verdadero", "falso"],
      filas: [
        { celdas: ["21"], respuesta: "verdadero" },
        { celdas: ["13"], respuesta: "verdadero" },
        { celdas: ["12"], respuesta: "falso" },
        { celdas: ["7"], respuesta: "falso" },
      ],
      porque:
        "'13 o mas' incluye al 13 y deja fuera al 12. La frontera esta entre esos dos numeros y en ningun otro sitio: por eso las pruebas de un programa siempre atacan el borde, no el centro.",
    },
    {
      forma: "eleccion",
      pregunta:
        "Quieres cobrar entrada reducida a los menores de 13. Cual de estas preguntas hace lo que quieres?",
      opciones: [
        "la edad es mayor que 13?",
        "la edad es menor que 13?",
        "la edad es menor o igual que 13?",
        "la edad es distinta de 13?",
      ],
      correcta: 1,
      porque:
        "'Menor de 13' significa 12 hacia abajo, y eso es exactamente 'menor que 13'. La tercera opcion tambien cobraria reducida a los de 13, que ya no son menores. Un 'o igual' de mas cambia a quien afecta la regla.",
    },
    {
      forma: "tabla",
      pregunta:
        "Una caja llamada 'nombre' guarda texto. La pregunta es: el nombre esta vacio? Contesta para cada caso.",
      columnas: ["nombre contiene", "esta vacio?"],
      opciones: ["verdadero", "falso"],
      filas: [
        { celdas: ["Ana"], respuesta: "falso" },
        { celdas: ["(nada)"], respuesta: "verdadero" },
        { celdas: ["un espacio"], respuesta: "falso" },
        { celdas: ["0"], respuesta: "falso" },
      ],
      porque:
        "Un espacio es un caracter, asi que ahi hay algo: el texto no esta vacio aunque a la vista lo parezca. Un cero escrito tambien ocupa. Vacio significa cero caracteres, ni uno.",
    },
    {
      forma: "eleccion",
      pregunta: "Cual de estas NO es una pregunta que un programa pueda contestar?",
      opciones: [
        "el saldo es menor que cero?",
        "esta pelicula es buena?",
        "el texto tiene mas de 8 caracteres?",
        "la temperatura es igual a 0?",
      ],
      correcta: 1,
      porque:
        "Las otras tres se contestan mirando un dato y comparandolo. 'Buena' no se puede comparar con nada. Cuando quieras que un programa juzgue algo asi, tendras que convertirlo antes en un numero: una nota, unos votos, una puntuacion.",
    },
  ],
  repaso: {
    resumen:
      "Has traducido preguntas de persona a preguntas de maquina. Toda decision que tome un programa se reduce a esto.",
    piezas: [
      {
        parte: "verdadero / falso",
        hace: "No hay terceras opciones. Cualquier decision se construye encadenando preguntas que solo tienen estas dos respuestas.",
      },
      {
        parte: "mayor que / mayor o igual",
        hace: "Se diferencian en un solo valor: el del borde. Es la fuente de error mas comun del oficio y no deja de serlo con los anos.",
      },
      {
        parte: "vacio no es lo mismo que parece vacio",
        hace: "Un espacio ocupa. Un cero escrito ocupa. La maquina cuenta caracteres, no mira la pantalla.",
      },
    ],
    ojo: "Cuando escribas una condicion, prueba siempre el valor exacto de la frontera. Si la regla dice 13, prueba 12, 13 y 14.",
  },
  pistas: [
    "Traduce la frase a numeros antes de contestar: 'menor de 13' es 12 hacia abajo.",
    "Ataca el borde. Si la regla habla de 13, el caso interesante es justo el 13.",
    "Si una pregunta no se puede contestar mirando un dato concreto, la maquina tampoco puede.",
  ],
};
