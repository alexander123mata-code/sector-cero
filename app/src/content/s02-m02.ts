import type { Mision } from "../types/mission";

export const s02m02: Mision = {
  tipo: "codigo",
  id: "s02-m02-cuenta",
  sector: 2,
  titulo: "Cuentas claras",
  concepto: [
    "operadores",
    "aritmetica"
  ],
  requiere: [
    "s02-m01-eco"
  ],
  minutos: 6,
  xp: 70,
  enunciado: "Compras `cantidad` unidades de algo que cuesta `precio` cada una. Guarda en `total` lo que hay que pagar.",
  plantilla: "# precio y cantidad ya existen: cada prueba les pone su valor.\n# Deja el resultado en una variable llamada: total\n\n# tu codigo aqui\n",
  solucion: "total = precio * cantidad\n",
  salida: "total",
  ejemplo: {
    "situacion": "Calcular cuantos minutos son 3 horas.",
    "codigo": "horas = 3\nminutos = horas * 60\n\n# minutos vale 180",
    "comentario": "Los operadores son +, -, * para multiplicar y / para dividir. Se pueden usar con variables igual que con numeros: Python mira lo que hay dentro de cada caja, hace la cuenta, y guarda el resultado donde le digas."
  },
  repaso: {
    "resumen": "Acabas de hacer que el programa calcule, en vez de solo mover datos.",
    "piezas": [
      {
        "parte": "precio * cantidad",
        "hace": "Multiplica los valores que hay dentro de las dos cajas. Esto se resuelve primero, antes de guardar nada."
      },
      {
        "parte": "total = ...",
        "hace": "Guarda el resultado de la cuenta. Lo de la derecha del = siempre se calcula antes de guardarse."
      }
    ],
    "ojo": "Una linea puede hacer dos cosas: primero calcular y despues guardar. Ese orden (primero lo de la derecha, luego el =) no cambia nunca."
  },
  pruebas: [
    {
      "entrada": {
        "precio": 10,
        "cantidad": 3
      },
      "salida": 30,
      "oculta": false
    },
    {
      "entrada": {
        "precio": 7,
        "cantidad": 0
      },
      "salida": 0,
      "oculta": false
    },
    {
      "entrada": {
        "precio": 4,
        "cantidad": 5
      },
      "salida": 20,
      "oculta": true
    }
  ],
  restricciones: {
    "exigeNodo": [],
    "prohibeNodo": [],
    "presupuestoOps": 3
  },
  pistas: [
    "Necesitas multiplicar dos cosas y guardar el resultado.",
    "El simbolo de multiplicar en Python es *, no x.",
    "total = precio * cantidad"
  ],
  fallosPrevistos: [
    {
      "cuando": {
        "tipo": "salida",
        "valor": 13
      },
      "dice": "Estas sumando en vez de multiplicar. Comprar 3 unidades de algo que vale 10 cuesta 30, no 13."
    }
  ],
};
