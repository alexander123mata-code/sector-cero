import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

type Props = {
  valor: string;
  onCambio: (v: string) => void;
  /** Cambiar de mision monta un editor limpio en vez de reescribir el buffer. */
  clave: string;
};

export function Editor({ valor, onCambio, clave }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const vista = useRef<EditorView | null>(null);
  const alCambio = useRef(onCambio);
  alCambio.current = onCambio;

  useEffect(() => {
    if (!host.current) return;

    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: valor,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          python(),
          oneDark,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) alCambio.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    vista.current = view;
    return () => {
      view.destroy();
      vista.current = null;
    };
    // `valor` solo siembra el documento inicial de cada mision a proposito:
    // reaccionar a el en cada tecla haria que el cursor saltase al final.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  return <div ref={host} style={{ height: "100%", overflow: "hidden" }} />;
}
