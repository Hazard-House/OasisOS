import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const ReactCompilerConfig = {};

function oasisWebHtml() {
  return {
    name: "oasis-web-html",
    enforce: "post" as const,
    transformIndexHtml(html: string) {
      return html.replace(
        "<head>",
        `<head>
    <script src="/ipc-bootstrap.js"></script>
    <link rel="icon" href="/favicon.png" />`,
      );
    },
  };
}

// Browser build of the same renderer. Electron keeps using vite.renderer.config.mts.
export default defineConfig({
  plugins: [
    oasisWebHtml(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
      electron: path.resolve(root, "./src/web/electron_shim.ts"),
    },
  },
  publicDir: path.resolve(root, "./web/public"),
  build: {
    outDir: path.resolve(root, "./dist/web"),
    emptyOutDir: true,
  },
});
