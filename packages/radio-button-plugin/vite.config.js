const path = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const PACKAGE_NAME = "radioPlugin";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: PACKAGE_NAME,
      formats: ["cjs", "umd", "es"],
      fileName: (format) =>
        `${PACKAGE_NAME}.${format === "cjs" ? "common" : format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        sourcemap: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return `${PACKAGE_NAME}.css`;
          return assetInfo.name;
        },
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
