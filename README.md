# Sector Cero

Un juego para aprender logica de programacion. La consola arranco corrupta y
cada sector del disco vuelve a la vida cuando tu codigo pasa sus pruebas.

El lenguaje es **Python**, y corre entero en el navegador: Pyodide (CPython
compilado a WebAssembly) dentro de un Web Worker. No hay backend de ejecucion.

## Arrancar

```bash
cd app
npm install
npm run dev
```

## Estado

| Fase | Que es | Estado |
| --- | --- | --- |
| 0 | Rebanada vertical: motor completo y 5 misiones del Sector 03 | hecha |
| 1 | Herramienta de autoria: validador, CI y andamiaje | hecha |
| 2 | Sectores 00 al 03 completos | pendiente |
| 3 | Identidad visual y cuentas | pendiente |
| 4 | Sectores 04 al 10 | pendiente |

## Como esta montado

```
app/src/
  types/mission.ts     esquema Zod de una mision (el contrato)
  content/             una mision por archivo, mas el registro
  engine/
    harness.ts         el arnes que corre dentro de Pyodide
    pyRunner.worker.ts el worker: AST y ejecucion de casos
    runner.ts          cliente del worker, con timeouts y reinicio
    evaluate.ts        los tres niveles de evaluacion
  store/progress.ts    progreso en localStorage
  ui/                  pantalla de mision
app/tools/
  validar.ts           valida el contenido ejecutandolo
  reglas.ts            comprobaciones que no necesitan Python
  nueva.ts             andamiaje de una mision nueva
diseno/                maquetas .dc.html del lienzo de diseno
```

Las misiones son **datos declarativos**, nunca componentes. El motor renderiza
y evalua cualquier mision sin saber cual es. Esto no es un detalle de estilo:
el temario completo son unas 215 misiones, y si cada una tocase codigo el
proyecto se muere antes de la trigesima.

## Escribir una mision

```bash
cd app
npm run mision:nueva -- s03-m06 "Contar hacia atras"
# rellena los TODO del archivo generado
npm run validar
npm run dev
```

El andamiaje nace con una solucion que no resuelve nada, asi que el validador
la rechaza hasta que la mision este de verdad escrita.

## Los tres niveles de evaluacion

Un evaluador binario produce gente que adivina hasta que el semaforo se pone
verde. Por eso hay tres niveles, y las estrellas miden algo real:

1. **Correctitud** — pasa las pruebas, incluidas las ocultas y los casos borde.
2. **Restricciones** — se recorre el AST: la mision puede exigir un `while` o
   prohibir `sorted()`, para que nadie salte el concepto con una funcion de
   biblioteca.
3. **Oficio** — operaciones ejecutadas contra un presupuesto. Asi se *siente*
   O(n^2) antes de definirlo.

El campo que marca la diferencia es `fallosPrevistos`: "prueba 2 fallida"
ensena cero; "estas sumando el centinela" ensena el concepto.

## Validacion

```bash
npm run lint      # oxlint
npm test          # reglas del validador
npm run validar   # ejecuta cada solucion de referencia contra sus pruebas
npm run build     # tipos y bundle
```

`npm run validar` es la barrera que importa. Cada mision trae una solucion de
referencia y el validador la ejecuta contra las pruebas de la propia mision,
asi que detecta:

- pruebas contradictorias, o que no distinguen una solucion correcta de una
  constante
- restricciones que la propia solucion no cumple
- presupuestos de operaciones imposibles de alcanzar, o tan holgados que el
  Nivel 3 no mide nada
- mensajes de `fallosPrevistos` que se dispararian con una solucion valida
- prerrequisitos inexistentes o ciclicos

El CI corre los cuatro comandos en cada push y pull request.

## Bucles infinitos

Se cortan dentro de Python con `sys.settrace` a las 300000 operaciones, de
forma determinista. Matar el worker desde fuera existe solo como red de
seguridad, no como mecanismo principal.
