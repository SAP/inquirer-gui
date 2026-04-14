import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");

export default defineConfig({
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
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "form",
      formats: ["cjs", "umd", "es"],
      fileName: (format) => `form.${format === "cjs" ? "common" : format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((name) => name.endsWith(".css"))) return "form.css";
          return assetInfo.names[0];
        },
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
