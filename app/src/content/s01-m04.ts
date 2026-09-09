import type { Mision } from "../types/mission";

export const s01m04: Mision = {
  tipo: "logica",
  id: "s01-m04-conectores",
  sector: 1,
  titulo: "Y, O, NO",
  concepto: ["y logico", "o logico", "negacion"],
  requiere: ["s01-m03-verdad"],
  minutos: 15,
  xp: 150,
  enunciado:
    "Una pregunta sola casi nunca basta. Se combinan con tres palabras, y solo tres: Y, O, NO. Aqui vas a ver que en programacion significan algo mas estrecho que en una conversacion.",
  ejemplo: {
    situacion: "Un descuento se aplica si eres socio Y es martes.",
    codigo:
      "socio: si   martes: si   ->  descuento: si\nsocio: si   martes: no   ->  descuento: no\nsocio: no   martes: si   ->  descuento: no\nsocio: no   martes: no   ->  descuento: no",
    comentario:
      "Con Y hacen falta las dos cosas: basta que una falle para que todo el conjunto sea falso. Si fuese O, las tres primeras filas darian descuento y solo la ultima no.",
  },
  ejercicios: [
    {
      forma: "tabla",
      pregunta:
        "Te mojas si llueve Y NO llevas paraguas. Completa la tabla con las cuatro combinaciones posibles.",
      columnas: ["llueve", "llevo paraguas", "me mojo?"],
      opciones: ["verdadero", "falso"],
      filas: [
        { celdas: ["si", "si"], respuesta: "falso" },
        { celdas: ["si", "no"], respuesta: "verdadero" },
        { celdas: ["no", "si"], respuesta: "falso" },
        { celdas: ["no", "no"], respuesta: "falso" },
      ],
      porque:
        "Solo hay una fila donde te mojas: llueve y no vas protegido. El NO le da la vuelta a 'llevo paraguas', y el Y exige que las dos partes se cumplan a la vez. Cuatro combinaciones es todo lo que hay con dos preguntas: escribirlas enteras evita discutir.",
    },
    {
      forma: "eleccion",
      pregunta:
        "Un cartel dice: 'entrada gratis para menores de 12 o mayores de 65'. Tienes 70 anos. Entras gratis?",
      opciones: [
        "No: solo cumples una de las dos condiciones.",
        "Si: con O basta con cumplir una.",
        "No: 70 no es menor de 12.",
        "Depende de la sala.",
      ],
      correcta: 1,
      porque:
        "O no significa elegir entre dos: significa que vale cualquiera de las dos, y tambien las dos a la vez. Con Y harian falta las dos, y nadie tiene menos de 12 y mas de 65 al mismo tiempo: esa condicion no la cumpliria nunca nadie.",
    },
    {
      forma: "tabla",
      pregunta:
        "Un formulario deja enviar si el nombre NO esta vacio Y la edad es 18 o mas. Se puede enviar?",
      columnas: ["nombre", "edad", "deja enviar?"],
      opciones: ["verdadero", "falso"],
      filas: [
        { celdas: ["Ana", "30"], respuesta: "verdadero" },
        { celdas: ["Ana", "17"], respuesta: "falso" },
        { celdas: ["(vacio)", "30"], respuesta: "falso" },
        { celdas: ["(vacio)", "17"], respuesta: "falso" },
      ],
      porque:
        "Con Y, una sola parte falsa tumba el conjunto entero. Por eso tres de las cuatro filas no dejan enviar: solo pasa la que cumple las dos cosas.",
    },
    {
      forma: "eleccion",
      pregunta:
        "La alarma suena si NO (la puerta esta cerrada Y la ventana esta cerrada). Cuando suena?",
      opciones: [
        "Solo cuando las dos estan abiertas.",
        "Cuando al menos una de las dos esta abierta.",
        "Nunca, porque la condicion se contradice.",
        "Solo cuando las dos estan cerradas.",
      ],
      correcta: 1,
      porque:
        "Dentro del parentesis se pide que las dos esten cerradas. El NO le da la vuelta a esa respuesta entera, asi que la alarma suena siempre que eso no se cumpla, y basta con una abierta. Negar un Y no da otro Y: da un O.",
    },
  ],
  repaso: {
    resumen:
      "Has construido decisiones combinando preguntas. Con Y, O y NO se puede expresar cualquier regla, por complicada que suene.",
    piezas: [
      {
        parte: "Y",
        hace: "Exige las dos partes. Una sola falsa hace falso el conjunto, sin importar la otra.",
      },
      {
        parte: "O",
        hace: "Le basta una. Y sigue siendo verdadero si se cumplen las dos: no es una eleccion entre ellas.",
      },
      {
        parte: "NO",
        hace: "Da la vuelta a la respuesta. Aplicado a un grupo entre parentesis, le da la vuelta al grupo entero, no a cada parte.",
      },
      {
        parte: "la tabla completa",
        hace: "Con dos preguntas hay cuatro combinaciones; con tres, ocho. Escribirlas todas es mas rapido que discutir cual falla.",
      },
    ],
    ojo: "En una conversacion, 'o' suele significar 'uno u otro, pero no los dos'. En programacion nunca: incluye el caso de los dos.",
  },
  pistas: [
    "Contesta primero cada pregunta por separado y solo despues combinalas.",
    "Con Y busca la parte falsa: si hay una, ya esta. Con O busca la verdadera.",
    "Cuando veas un NO delante de un parentesis, resuelve lo de dentro primero y dale la vuelta al final.",
  ],
};
