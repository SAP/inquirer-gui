import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Instruct the compiler to treat VSCode Elements Web Components as custom elements.
          isCustomElement: (tag) => tag.startsWith("vscode-"),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      // In dev, main.js imports inquirer-gui from src/ directly. Plugins that import
      // @sap-devx/inquirer-gui must resolve to the same instance to avoid duplicate
      // custom element registration (vscode-textarea already defined error).
      "@sap-devx/inquirer-gui": path.resolve(__dirname, "../../packages/inquirer-gui/src/index.js"),
    },
  },
});
