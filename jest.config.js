module.exports = {
  verbose: true,
  testRegex: "(\/__tests__\/(.*)\.(test|spec))\.[jt]sx?$",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!**/node_modules/**",
    "!<rootDir>/src/index.js",
    "!<rootDir>/src/plugins/**"
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports/junit",
        outputName: "js-test-results.xml"
      }
    ]
  ],
  coverageReporters: [
    "html",
    "text-summary"
  ],
  moduleFileExtensions: [
    "js",
    "vue",
    "json"
  ],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(@sap-devx|vuetify|material-design-icons-iconfont|@mdi/font)/)"
  ],
  modulePaths: [
    "<rootDir>/src",
    "<rootDir>/node_modules"
  ],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  setupFiles: [
    "<rootDir>/__tests__/setup.js"
  ],
  snapshotSerializers: [
    "<rootDir>/node_modules/jest-serializer-vue"
  ],
  coverageThreshold: {
    "global": {
      "branches": 85,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}
