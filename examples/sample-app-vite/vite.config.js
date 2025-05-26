import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
});
