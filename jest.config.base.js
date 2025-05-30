module.exports = {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  coverageProvider: "v8",
  collectCoverage: true,
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
  coverageReporters: [["lcov", { projectRoot: "/" }], ["html", { projectRoot: "/" }], "text-summary"],
  moduleFileExtensions: ["js", "vue", "json"],
  transformIgnorePatterns: [
    "node_modules/(?!(@sap-devx|vuetify|@vscode-elements|lit|material-design-icons-iconfont|@mdi/font)/)",
  ],
  modulePaths: ["<rootDir>/src", "node_modules"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.js$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  snapshotSerializers: ["jest-serializer-vue"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
