const baseConfig = require("../../jest.config.base.js");

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    "@sap-devx/inquirer-gui": "<rootDir>/../inquirer-gui/src/index.js",
  },
};
