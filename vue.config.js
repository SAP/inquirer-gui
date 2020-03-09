module.exports = {
    runtimeCompiler: true,
    publicPath: "./",
    css: { extract: true },
    configureWebpack: (config) => {
      config.devtool = 'source-map'
  },
};
