"""La ficha que el CLI entrega al jugador para desbloquear el Sector 00.

No es un mecanismo antifraude y no pretende serlo: el juego no tiene servidor,
asi que cualquier ficha se puede fabricar a mano. La suma de control solo
detecta que el pegado llego entero. Quien quiera saltarse el Sector 00 solo se
enganara a si mismo, y esa es una decision suya.
"""

from __future__ import annotations

import base64
import json
import time
from typing import Iterable

from .comprobaciones import Resultado

VERSION = 1
SAL = "sector-cero"


def _suma(cuerpo: bytes) -> str:
    """FNV-1a de 32 bits.

    No es criptografico y no tiene por que serlo: solo detecta que el pegado
    llego entero. Se eligio porque el navegador lo calcula igual sin recurrir a
    crypto.subtle, que es asincrono.
    """
    h = 2166136261
    for b in SAL.encode() + cuerpo:
        h = ((h ^ b) * 16777619) & 0xFFFFFFFF
    return format(h, "08x")


def _b64(datos: bytes) -> str:
    return base64.urlsafe_b64encode(datos).decode().rstrip("=")


def _des_b64(texto: str) -> bytes:
    return base64.urlsafe_b64decode(texto + "=" * (-len(texto) % 4))


def emitir(resultados: Iterable[Resultado]) -> str:
    """Codifica que comprobaciones pasaron, en una linea pegable."""
    cuerpo = json.dumps(
        {
            "v": VERSION,
            "ts": int(time.time()),
            "ok": sorted(r.clave for r in resultados if r.ok),
        },
        separators=(",", ":"),
        sort_keys=True,
    ).encode()
    return f"{_b64(cuerpo)}.{_suma(cuerpo)}"


def leer(ficha: str) -> dict | None:
    """Devuelve el contenido de la ficha, o None si no es legible."""
    partes = ficha.strip().split(".")
    if len(partes) != 2:
        return None
    try:
        cuerpo = _des_b64(partes[0])
    except (ValueError, TypeError):
        return None
    if _suma(cuerpo) != partes[1]:
        return None
    try:
        datos = json.loads(cuerpo)
    except json.JSONDecodeError:
        return None
    if not isinstance(datos, dict) or datos.get("v") != VERSION:
        return None
    return datos
