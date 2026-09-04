/**
 * Arnes que corre dentro de Pyodide. Se define una sola vez al arrancar el
 * worker; despues cada caso de prueba es una llamada a `sc_correr`.
 *
 * Dos numeros distintos gobiernan la ejecucion:
 *  - LIMITE_DURO detiene un bucle infinito de forma determinista, sin depender
 *    de que el hilo principal mate al worker.
 *  - el presupuesto de operaciones de la mision solo puntua (Nivel 3).
 */
export const ARNES_PY = String.raw`
import ast, io, json, sys, contextlib

LIMITE_DURO = 300000
ARCHIVO = "<jugador>"

class _Corte(Exception):
    pass

def sc_nodos(codigo):
    """Nombres de los nodos del AST del codigo del jugador (Nivel 2)."""
    try:
        arbol = ast.parse(codigo)
    except SyntaxError as e:
        return json.dumps({"ok": False, "error": "SyntaxError: " + str(e.msg) + " (linea " + str(e.lineno) + ")"})
    nombres = sorted({type(n).__name__ for n in ast.walk(arbol)})
    return json.dumps({"ok": True, "nodos": nombres})

def sc_correr(codigo, entrada_json, salida_var, sensor_json):
    """Ejecuta el codigo contra un caso y devuelve valor, ops y traza."""
    entrada = json.loads(entrada_json)
    sensor = json.loads(sensor_json) if sensor_json else None

    globales = dict(entrada)
    traza = []

    if sensor:
        fuente = iter(list(entrada[sensor["desde"]]))
        agotado = sensor["agotado"]
        def _leer():
            try:
                v = next(fuente)
            except StopIteration:
                v = agotado
            traza.append(v)
            return v
        globales[sensor["nombre"]] = _leer

    ops = [0]
    def _rastro(frame, evento, arg):
        if frame.f_code.co_filename != ARCHIVO:
            return None
        if evento == "line":
            ops[0] += 1
            if ops[0] > LIMITE_DURO:
                raise _Corte()
        return _rastro

    try:
        objeto = compile(codigo, ARCHIVO, "exec")
    except SyntaxError as e:
        return json.dumps({
            "ok": False, "timeout": False, "ops": 0, "traza": [],
            "error": "SyntaxError: " + str(e.msg) + " (linea " + str(e.lineno) + ")",
        })

    salida_std = io.StringIO()
    try:
        sys.settrace(_rastro)
        with contextlib.redirect_stdout(salida_std):
            exec(objeto, globales)
    except _Corte:
        sys.settrace(None)
        return json.dumps({
            "ok": False, "timeout": True, "ops": ops[0], "traza": traza,
            "error": "El codigo no termino: se pasaron " + str(LIMITE_DURO) + " operaciones.",
        })
    except Exception as e:
        sys.settrace(None)
        return json.dumps({
            "ok": False, "timeout": False, "ops": ops[0], "traza": traza,
            "error": type(e).__name__ + ": " + str(e),
        })
    finally:
        sys.settrace(None)

    if salida_var not in globales:
        return json.dumps({
            "ok": False, "timeout": False, "ops": ops[0], "traza": traza,
            "error": "No definiste la variable '" + salida_var + "'.",
        })

    try:
        valor = json.dumps(globales[salida_var])
    except TypeError:
        return json.dumps({
            "ok": False, "timeout": False, "ops": ops[0], "traza": traza,
            "error": "'" + salida_var + "' guarda algo que no es un numero, texto o lista.",
        })

    return json.dumps({
        "ok": True, "timeout": False, "ops": ops[0], "traza": traza,
        "valor_json": valor, "impreso": salida_std.getvalue(), "error": None,
    })
`;
