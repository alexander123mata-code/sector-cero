import type { Mision } from "../types/mission";

export const s01m05: Mision = {
  tipo: "logica",
  id: "s01-m05-caminos",
  sector: 1,
  titulo: "El camino que no se toma",
  concepto: ["si entonces", "si no", "camino unico"],
  requiere: ["s01-m04-conectores"],
  minutos: 14,
  xp: 150,
  enunciado:
    "Una condicion parte el programa en dos caminos. Se recorre uno y solo uno. Lo que hay en el otro no ocurre: ni un poco, ni despues, ni por si acaso.",
  ejemplo: {
    situacion: "Un torno de metro decide con una sola pregunta.",
    codigo:
      "si el saldo es 2 o mas:\n    abre la puerta\n    resta 2 al saldo\nsi no:\n    enciende la luz roja\n\nsaldo = 5  ->  abre y queda 3\nsaldo = 1  ->  luz roja, el saldo no cambia",
    comentario:
      "Con saldo 1 no se resta nada, porque restar esta en el camino que no se tomo. Un error clasico es contar con que algo del otro lado 'ya se habra hecho'. No se ha hecho.",
  },
  ejercicios: [
    {
      forma: "eleccion",
      pregunta: "Con edad = 15, cuanto vale 'precio' al final?",
      muestra:
        "pon 10 en precio\nsi la edad es 18 o mas:\n    pon 12 en precio\nsi no:\n    pon 6 en precio\nsuma 1 a precio",
      opciones: ["6", "7", "12", "13"],
      correcta: 1,
      porque:
        "15 no llega a 18, asi que se toma el camino de abajo y precio pasa a 6. La ultima linea esta fuera de la decision, al mismo margen que 'pon 10': se ejecuta siempre, vengas por donde vengas. 6 + 1 = 7.",
    },
    {
      forma: "tabla",
      pregunta:
        "Un aviso se enciende si la temperatura pasa de 38. Que hace el programa con cada lectura?",
      columnas: ["temperatura", "que ocurre"],
      opciones: ["enciende el aviso", "no hace nada"],
      filas: [
        { celdas: ["39.5"], respuesta: "enciende el aviso" },
        { celdas: ["38"], respuesta: "no hace nada" },
        { celdas: ["36.2"], respuesta: "no hace nada" },
        { celdas: ["41"], respuesta: "enciende el aviso" },
      ],
      porque:
        "'Pasa de 38' quiere decir mayor que 38, y 38 exacto no pasa de 38: no enciende nada. Si querias avisar tambien con 38 clavados, la condicion tenia que decir '38 o mas'.",
    },
    {
      forma: "eleccion",
      pregunta: "Que escribe este programa con nota = 9?",
      muestra:
        "si la nota es 5 o mas:\n    escribe 'aprobado'\nsi la nota es 9 o mas:\n    escribe 'sobresaliente'",
      opciones: [
        "Solo 'sobresaliente'.",
        "Solo 'aprobado'.",
        "'aprobado' y 'sobresaliente'.",
        "Nada: las dos condiciones se contradicen.",
      ],
      correcta: 2,
      porque:
        "Son dos decisiones separadas, no dos caminos de la misma. Un 9 cumple las dos, asi que se ejecutan las dos. Para que solo saliera una habria que encadenarlas con un 'si no'.",
    },
    {
      forma: "orden",
      pregunta: "Ordena las piezas de una decision que cobre 0 si eres socio y 8 si no lo eres.",
      piezas: ["si eres socio:", "    pon 0 en precio", "si no:", "    pon 8 en precio"],
      porque:
        "La pregunta va primero, lo que se hace cuando es verdadera va dentro, y el 'si no' abre el otro camino con lo suyo dentro. Ese sangrado no es decoracion: es lo que dice que linea pertenece a que camino.",
    },
  ],
  repaso: {
    resumen:
      "Has seguido programas que se parten en dos. Saber que camino se toma, y sobre todo cual no, es leer codigo.",
    piezas: [
      {
        parte: "si ... si no",
        hace: "Dos caminos excluyentes. Se recorre exactamente uno, nunca los dos y nunca ninguno.",
      },
      {
        parte: "lo que va despues",
        hace: "Las lineas que estan fuera de la decision se ejecutan siempre, hayas ido por donde hayas ido.",
      },
      {
        parte: "dos 'si' seguidos no son un 'si no'",
        hace: "Son dos decisiones independientes, y un mismo dato puede cumplir las dos. Si quieres que solo pase una cosa, tienen que estar encadenadas.",
      },
    ],
    ojo: "Cuando algo 'no se ejecuta', empieza mirando si esta dentro de un camino que no se tomo. Es la causa mas frecuente con diferencia.",
  },
  pistas: [
    "Marca con el dedo que lineas estan dentro de la decision y cuales estan fuera. Lo de fuera pasa siempre.",
    "Contesta la pregunta con el dato concreto que te dan y tacha el camino que no se toma antes de seguir leyendo.",
    "Si ves dos preguntas sueltas una detras de otra, comprueba si el mismo dato cumple las dos.",
  ],
};
