import type { Mision } from "../types/mission";

export const s01m06: Mision = {
  tipo: "logica",
  id: "s01-m06-repeticion",
  sector: 1,
  titulo: "Lo que se repite",
  concepto: ["repeticion", "condicion de parada", "vuelta"],
  requiere: ["s01-m05-caminos"],
  minutos: 15,
  xp: 170,
  enunciado:
    "Repetir es lo que hace que valga la pena tener una maquina. Pero una repeticion necesita algo que la pare, y ese algo tiene que cambiar dentro de ella. Si no cambia, no para nunca.",
  ejemplo: {
    situacion: "Contar hasta 3 en voz alta.",
    codigo:
      "pon 1 en n\nmientras n sea 3 o menos:\n    di n\n    suma 1 a n\n\ndice: 1, 2, 3\nsale con n valiendo 4",
    comentario:
      "La condicion se comprueba antes de cada vuelta, no durante. Con n valiendo 4 la respuesta es falsa y se sale. Fijate en que 'suma 1 a n' esta dentro: es lo unico que acerca el bucle a su final.",
  },
  ejercicios: [
    {
      forma: "tabla",
      pregunta: "Sigue este bucle vuelta a vuelta. Cuanto vale 'total' al terminar cada una?",
      muestra:
        "pon 0 en total\npon 1 en n\nmientras n sea 4 o menos:\n    suma n a total\n    suma 1 a n",
      columnas: ["vuelta", "n al entrar", "total al terminar la vuelta"],
      opciones: ["0", "1", "3", "6", "10"],
      filas: [
        { celdas: ["1", "1"], respuesta: "1" },
        { celdas: ["2", "2"], respuesta: "3" },
        { celdas: ["3", "3"], respuesta: "6" },
        { celdas: ["4", "4"], respuesta: "10" },
      ],
      porque:
        "Cada vuelta anade el n de ese momento a lo que ya habia: 1, luego 1+2, luego 3+3, luego 6+4. Con n valiendo 5 la condicion es falsa y no hay quinta vuelta. Total acaba en 10.",
    },
    {
      forma: "eleccion",
      pregunta: "Cuantas veces se ejecuta 'di hola'?",
      muestra: "pon 1 en n\nmientras n sea menor que 4:\n    di hola\n    suma 1 a n",
      opciones: ["2 veces", "3 veces", "4 veces", "Infinitas veces"],
      correcta: 1,
      porque:
        "Entra con n valiendo 1, 2 y 3. Cuando n llega a 4 la condicion 'menor que 4' ya es falsa y no entra. Contar vueltas es contar cuantos valores cumplen la condicion, no hasta que numero llega n.",
    },
    {
      forma: "eleccion",
      pregunta: "Que le pasa a este programa?",
      muestra: "pon 1 en n\nmientras n sea 5 o menos:\n    di n",
      opciones: [
        "Escribe 1, 2, 3, 4 y 5.",
        "Escribe 1 una vez y termina.",
        "Escribe 1 para siempre y no termina nunca.",
        "Da error porque falta el final del bucle.",
      ],
      correcta: 2,
      porque:
        "Nada dentro del bucle toca n, asi que n vale 1 en la primera comprobacion y en todas las demas. La condicion nunca se vuelve falsa. Un bucle infinito casi siempre es esto: falta la linea que hace avanzar la cuenta.",
    },
    {
      forma: "orden",
      pregunta: "Ordena las piezas de un bucle que sume los numeros del 1 al 10 en 'total'.",
      piezas: [
        "pon 0 en total",
        "pon 1 en n",
        "mientras n sea 10 o menos:",
        "    suma n a total",
        "    suma 1 a n",
      ],
      porque:
        "Las dos cajas se preparan antes de entrar: si 'pon 0 en total' estuviera dentro, cada vuelta lo borraria y acabarias con el ultimo numero en vez de con la suma. Y 'suma 1 a n' tiene que quedar dentro, o no se sale nunca.",
    },
  ],
  repaso: {
    resumen:
      "Has leido bucles antes de escribir uno. Los tres fallos que has visto aqui son los tres que vas a cometer.",
    piezas: [
      {
        parte: "la condicion se comprueba antes de cada vuelta",
        hace: "Si es falsa a la primera, el bucle no se ejecuta ni una vez. Y al salir, la caja de la cuenta ya paso del limite.",
      },
      {
        parte: "algo tiene que cambiar dentro",
        hace: "Si ninguna linea del cuerpo acerca la condicion a ser falsa, el bucle no termina jamas.",
      },
      {
        parte: "preparar fuera, acumular dentro",
        hace: "La caja donde se acumula se pone a cero antes de entrar. Ponerla a cero dentro borra el trabajo en cada vuelta.",
      },
    ],
    ojo: "Con esto se cierra el Sector 01. A partir de aqui es lo mismo, pero escrito en Python y con la maquina ejecutandolo de verdad.",
  },
  pistas: [
    "Haz la tabla a mano: una fila por vuelta, una columna por caja. Es exactamente lo que hace la maquina.",
    "Antes de contar vueltas, pregunta con que valores entra y con cual deja de entrar.",
    "Si sospechas de un bucle infinito, busca la linea que cambia la caja de la condicion. Si no existe, ya lo tienes.",
  ],
};
