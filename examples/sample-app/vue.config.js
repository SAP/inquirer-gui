const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  // transpileDependencies: true,
  lintOnSave: false,
  publicPath: "./", // This is critical so the urls from bundled files will be releative.
  configureWebpack: {
    resolve: {
      alias: {
        vue: path.resolve("../../node_modules/vue"),
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = options.compilerOptions || {};
        options.compilerOptions.isCustomElement = (tag) => tag.startsWith("vscode-");
        return options;
      });
  },
});
