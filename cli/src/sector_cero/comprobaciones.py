"""Comprobaciones del entorno del jugador.

Cada comprobacion mira una cosa concreta de la maquina y, si falla, dice como
arreglarlo. El objetivo no es auditar: es que alguien que nunca ha instalado
nada sepa cual es el siguiente paso.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

MINIMO = (3, 10)


@dataclass(frozen=True)
class Resultado:
    clave: str
    titulo: str
    ok: bool
    detalle: str
    arreglo: str = ""


def _corre(programa: str, *args: str) -> tuple[bool, str]:
    """Ejecuta una orden y devuelve (fue_bien, primera_linea_de_salida).

    El ejecutable se resuelve con which porque en Windows muchas herramientas
    son .cmd o .exe y subprocess, sin shell, no consulta PATHEXT.
    """
    ruta = programa if Path(programa).is_absolute() else shutil.which(programa)
    if ruta is None:
        return False, ""
    try:
        p = subprocess.run(
            [ruta, *args], capture_output=True, text=True, timeout=10, check=False
        )
    except (OSError, subprocess.SubprocessError):
        return False, ""
    salida = (p.stdout or p.stderr or "").strip().splitlines()
    return p.returncode == 0, salida[0] if salida else ""


def version_de_python() -> Resultado:
    v = sys.version_info
    actual = f"{v.major}.{v.minor}.{v.micro}"
    ok = (v.major, v.minor) >= MINIMO
    return Resultado(
        "python_version",
        "Python instalado",
        ok,
        f"Python {actual}",
        "" if ok else f"Sector Cero necesita Python {MINIMO[0]}.{MINIMO[1]} o mas nuevo. Descargalo en python.org y marca 'Add to PATH' al instalar.",
    )


def python_en_path() -> Resultado:
    ruta = shutil.which("python") or shutil.which("python3")
    return Resultado(
        "python_en_path",
        "Python accesible desde la terminal",
        ruta is not None,
        ruta or "no encontrado",
        "" if ruta else "La terminal no encuentra 'python'. En Windows, reinstala marcando 'Add python.exe to PATH'. En Mac o Linux, usa 'python3'.",
    )


def pip_disponible() -> Resultado:
    ok, linea = _corre(sys.executable, "-m", "pip", "--version")
    return Resultado(
        "pip",
        "pip disponible",
        ok,
        linea or "no responde",
        "" if ok else "pip es lo que instala paquetes. Prueba: python -m ensurepip --upgrade",
    )


def entorno_virtual() -> Resultado:
    activo = sys.prefix != sys.base_prefix
    return Resultado(
        "venv",
        "Entorno virtual activo",
        activo,
        Path(sys.prefix).name if activo else "estas usando el Python del sistema",
        ""
        if activo
        else r"Crea uno con 'python -m venv .venv' y activalo: .venv\Scripts\activate en Windows, source .venv/bin/activate en Mac o Linux.",
    )


def git_instalado() -> Resultado:
    ok, linea = _corre("git", "--version")
    return Resultado(
        "git_instalado",
        "Git instalado",
        ok,
        linea or "no encontrado",
        "" if ok else "Git es lo que guarda el historial de tu codigo. Instalalo desde git-scm.com.",
    )


def git_identidad() -> Resultado:
    ok_n, nombre = _corre("git", "config", "--get", "user.name")
    ok_e, correo = _corre("git", "config", "--get", "user.email")
    ok = ok_n and ok_e and bool(nombre) and bool(correo)
    return Resultado(
        "git_identidad",
        "Git sabe quien eres",
        ok,
        f"{nombre} <{correo}>" if ok else "sin configurar",
        "" if ok else 'Git firma cada cambio con tu nombre. Configuralo:\n    git config --global user.name "Tu Nombre"\n    git config --global user.email "tu@correo.com"',
    )


def repositorio() -> Resultado:
    ok, _ = _corre("git", "rev-parse", "--is-inside-work-tree")
    return Resultado(
        "repo_git",
        "Estas dentro de un repositorio",
        ok,
        os.getcwd() if ok else "esta carpeta no es un repositorio",
        "" if ok else "Entra en la carpeta de tu proyecto y ejecuta 'git init'.",
    )


def primer_commit() -> Resultado:
    ok, sha = _corre("git", "rev-parse", "--short", "HEAD")
    return Resultado(
        "commit",
        "Tienes al menos un commit",
        ok,
        f"HEAD en {sha}" if ok else "todavia no hay ningun commit",
        "" if ok else 'Guarda tu primer cambio:\n    git add .\n    git commit -m "Mi primer commit"',
    )


def vscode() -> Resultado:
    ok, linea = _corre("code", "--version")
    return Resultado(
        "vscode",
        "VS Code accesible desde la terminal",
        ok,
        f"VS Code {linea}" if ok else "el comando 'code' no responde",
        "" if ok else "Instala VS Code desde code.visualstudio.com. Si ya lo tienes, abre la paleta (Ctrl+Shift+P) y ejecuta 'Shell Command: Install code command in PATH'.",
    )


CATALOGO = (
    version_de_python,
    python_en_path,
    pip_disponible,
    entorno_virtual,
    git_instalado,
    git_identidad,
    repositorio,
    primer_commit,
    vscode,
)


def comprobar_todo() -> list[Resultado]:
    return [c() for c in CATALOGO]
