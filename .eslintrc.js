module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  globals: {
    _: "readonly",
    document: "readonly",
    __dirname: "readonly",
    __values: "readonly",
    process: "readonly",
    acquireVsCodeApi: "readonly",
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      // For sub-packages using TypeScript (libraries/VSCode Exts) && TypeScript definitions (d.ts)
      files: ["*.ts"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        // TODO - Technical depth: remove these eslint rules and fix code
        "@typescript-eslint/no-explicit-any": "off",
        "no-inner-declarations": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-types": "off",
        "no-param-reassign": ["error", { props: true }],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["vue"],
  rules: {
    "vue/no-mutating-props": "off",
    "vue/no-deprecated-slot-attribute": "off",
  },
};
