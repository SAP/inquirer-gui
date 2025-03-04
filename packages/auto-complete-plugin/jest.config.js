module.exports = {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  coverageProvider: "v8",
  testRegex: "(/__tests__/(.*).(test|spec)).[jt]sx?$" /* eslint-disable-line */,
  collectCoverage: true,
  // moduleNameMapper: {
  //   '^vue$': '../../node_modules/vue'
  // },
  // modulePathIgnorePatterns: [
  //   "<rootDir>/sample-app",
  //   "<rootDir>/sample-app-vite"
  // ],
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!**/node_modules/**",
    "!<rootDir>/src/index.js",
    "!<rootDir>/src/plugins/**",
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports/junit",
        outputName: "js-test-results.xml",
      },
    ],
  ],
  coverageReporters: [["lcov", { projectRoot: "../../" }], ["html", { projectRoot: "../../" }], "text-summary"],
  moduleFileExtensions: ["js", "vue", "json"],
  transformIgnorePatterns: ["../../node_modules/(?!(@sap-devx|vuetify|material-design-icons-iconfont|@mdi/font)/)"],
  modulePaths: ["<rootDir>/src", "../../node_modules"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.js$": "../../node_modules/babel-jest",
    "^.+\\.mjs$": "../../node_modules/babel-jest",
  },
  snapshotSerializers: ["../../node_modules/jest-serializer-vue"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
