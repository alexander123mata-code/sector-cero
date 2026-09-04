import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // En GitHub Pages el sitio cuelga de /sector-cero/, no de la raiz del
  // dominio. En desarrollo se sirve desde la raiz para no complicar la URL.
  base: command === "build" ? "/sector-cero/" : "/",
}));
