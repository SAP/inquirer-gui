import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");
const CONTROL_NAME = "navigator-control";
export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: CONTROL_NAME,
      formats: ["cjs", "umd", "es"],
      fileName: (format) => `${CONTROL_NAME}.${format === "cjs" ? "control" : format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return `${CONTROL_NAME}.css`;
          return assetInfo.name;
        },
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
