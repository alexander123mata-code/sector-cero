"""El comando `sector`.

`sector verify` mira el entorno del jugador y, pase lo que pase, entrega una
ficha con lo que si esta listo. El juego decide si esa ficha basta para la
mision que tiene delante, asi que a nadie le bloquea el paso una herramienta
que todavia no necesita.
"""

from __future__ import annotations

import argparse
import os
import sys

from .comprobaciones import Resultado, comprobar_todo
from .ficha import emitir

VERDE, ROJO, GRIS, AMBAR, FIN = "\033[32m", "\033[31m", "\033[90m", "\033[33m", "\033[0m"


def _color() -> bool:
    if os.environ.get("NO_COLOR"):
        return False
    return sys.stdout.isatty()


def _pinta(texto: str, color: str) -> str:
    return f"{color}{texto}{FIN}" if _color() else texto


def _informe(resultados: list[Resultado]) -> None:
    pasan = [r for r in resultados if r.ok]
    fallan = [r for r in resultados if not r.ok]

    print()
    print(_pinta("SECTOR CERO", AMBAR) + "  comprobando tu entorno")
    print()

    for r in resultados:
        marca = _pinta("  ok  ", VERDE) if r.ok else _pinta(" falta", ROJO)
        print(f"{marca}  {r.titulo.ljust(38)} {_pinta(r.detalle, GRIS)}")

    print()
    print(f"{len(pasan)} de {len(resultados)} listas.")

    if fallan:
        print()
        print(_pinta("Lo que falta:", AMBAR))
        for r in fallan:
            print()
            print(f"  {r.titulo}")
            for linea in r.arreglo.splitlines():
                print(f"    {linea}")


def _entregar(resultados: list[Resultado]) -> None:
    print()
    print(_pinta("Tu ficha:", AMBAR))
    print()
    print(f"  {emitir(resultados)}")
    print()
    print(_pinta("Copiala y pegala en el juego para desbloquear lo que ya tienes listo.", GRIS))
    print()


def principal(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="sector",
        description="Comprueba que tu maquina esta lista para jugar a Sector Cero.",
    )
    sub = p.add_subparsers(dest="orden")
    v = sub.add_parser("verify", help="comprueba el entorno y entrega tu ficha")
    v.add_argument(
        "--solo-ficha",
        action="store_true",
        help="imprime unicamente la ficha, sin el informe",
    )

    args = p.parse_args(argv if argv is not None else sys.argv[1:])
    if args.orden is None:
        args = p.parse_args(["verify"])

    resultados = comprobar_todo()

    if getattr(args, "solo_ficha", False):
        print(emitir(resultados))
        return 0

    _informe(resultados)
    _entregar(resultados)
    # Siempre 0: faltar herramientas no es un error del programa, es el estado
    # de una maquina que todavia se esta montando.
    return 0
