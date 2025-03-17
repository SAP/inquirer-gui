const baseConfig = require("../../jest.config.base.js");

module.exports = {
  ...baseConfig,
  testRegex: "(/packages/.*/__tests__/(.*).(test|spec)).[jt]sx?$" /* eslint-disable-line */,
};
