import unittest

from sector_cero.comprobaciones import Resultado
from sector_cero.ficha import emitir, leer


def r(clave, ok):
    return Resultado(clave, clave, ok, "")


class Ficha(unittest.TestCase):
    def test_recoge_solo_lo_que_paso(self):
        datos = leer(emitir([r("python_version", True), r("vscode", False)]))
        self.assertEqual(datos["ok"], ["python_version"])

    def test_ida_y_vuelta_conserva_el_orden(self):
        f = emitir([r("git_instalado", True), r("commit", True)])
        self.assertEqual(leer(f)["ok"], ["commit", "git_instalado"])

    def test_rechaza_una_ficha_corrupta(self):
        f = emitir([r("pip", True)])
        # El caracter de sustitucion tiene que ser distinto del que habia: la
        # suma depende del reloj, asi que fijar un "0" hacia que el test pasara
        # o fallara segun la hora.
        otro = "1" if f[-1] == "0" else "0"
        self.assertIsNone(leer(f[:-1] + otro))

    def test_rechaza_texto_que_no_es_una_ficha(self):
        for basura in ["", "hola", "a.b.c", "....", "!!!.deadbeef"]:
            self.assertIsNone(leer(basura), basura)

    def test_tolera_espacios_al_pegar(self):
        f = emitir([r("pip", True)])
        self.assertIsNotNone(leer(f"  {f}\n"))

    def test_una_ficha_sin_nada_listo_sigue_siendo_legible(self):
        self.assertEqual(leer(emitir([r("pip", False)]))["ok"], [])


if __name__ == "__main__":
    unittest.main()
