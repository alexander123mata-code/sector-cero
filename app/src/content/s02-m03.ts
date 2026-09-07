import type { Mision } from "../types/mission";

export const s02m03: Mision = {
  tipo: "codigo",
  id: "s02-m03-saludo",
  sector: 2,
  titulo: "Pegar palabras",
  concepto: [
    "cadenas",
    "f-string"
  ],
  requiere: [
    "s02-m02-cuenta"
  ],
  minutos: 8,
  xp: 80,
  enunciado: "Con el `nombre` que te dan, construye un saludo en `saludo`. Si el nombre es Ana, tiene que quedar exactamente: Hola, Ana!",
  plantilla: "# nombre ya existe: cada prueba le pone su valor.\n# Deja el resultado en una variable llamada: saludo\n\n# tu codigo aqui\n",
  solucion: "saludo = f\"Hola, {nombre}!\"\n",
  salida: "saludo",
  ejemplo: {
    "situacion": "Escribir un aviso metiendo dentro el valor de una variable.",
    "codigo": "ciudad = \"Madrid\"\naviso = f\"Llegando a {ciudad}.\"\n\n# aviso vale: Llegando a Madrid.",
    "comentario": "Un texto va entre comillas. La f de delante permite meter variables dentro usando llaves: donde pones {ciudad}, Python escribe lo que hay guardado en esa caja. Sin la f, las llaves saldrian tal cual en el texto."
  },
  repaso: {
    "resumen": "Acabas de construir un texto mezclando partes fijas con el valor de una variable.",
    "piezas": [
      {
        "parte": "f\"...\"",
        "hace": "La f convierte el texto en una plantilla: le dice a Python que mire dentro de las llaves."
      },
      {
        "parte": "{nombre}",
        "hace": "Se sustituye por lo que hay guardado en la variable. Solo funciona dentro de un texto con f delante."
      },
      {
        "parte": "Hola, ...!",
        "hace": "Todo lo que esta fuera de las llaves sale tal cual, incluidos la coma, el espacio y el signo final."
      }
    ],
    "ojo": "Los espacios y los signos cuentan: 'Hola,Ana!' y 'Hola, Ana!' son textos distintos, y la prueba compara caracter a caracter."
  },
  pruebas: [
    {
      "entrada": {
        "nombre": "Ana"
      },
      "salida": "Hola, Ana!",
      "oculta": false
    },
    {
      "entrada": {
        "nombre": "Luis"
      },
      "salida": "Hola, Luis!",
      "oculta": false
    },
    {
      "entrada": {
        "nombre": "Sector"
      },
      "salida": "Hola, Sector!",
      "oculta": true
    }
  ],
  restricciones: {
    "exigeNodo": [],
    "prohibeNodo": [],
    "presupuestoOps": 3
  },
  pistas: [
    "El texto lleva una parte fija y una que cambia segun el nombre.",
    "Pon una f justo antes de la comilla de apertura y mete {nombre} donde deba aparecer.",
    "saludo = f\"Hola, {nombre}!\""
  ],
  fallosPrevistos: [],
};
