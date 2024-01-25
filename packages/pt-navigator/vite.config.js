import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "pt-navigator",
      formats: ["cjs", "umd", "es"],
      fileName: (format) => `pt-navigator.${format === "cjs" ? "common" : format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "pt-navigator.css";
          return assetInfo.name;
        },
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
