module.exports = {
  presets: [["@babel/preset-env", { modules: false }], "@babel/preset-typescript"],
  env: {
    test: {
      presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
    },
  },
};
