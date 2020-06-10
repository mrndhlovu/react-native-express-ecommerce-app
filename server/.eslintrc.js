module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: "airbnb-base",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-underscore-dangle": "off",
    "implicit-arrow-linebreak": "off",
    "comma-dangle": "off",
    camelcase: "off",
    "object-curly-newline": "off",
    "consistent-return": "off",
    "function-paren-newline": "off",
    curly: "off",
    "nonblock-statement-body-position": "off",
    "func-names": "off",
    "prefer-destructuring": "off",
    "no-param-reassign": "off",
    "operator-linebreak": "off",
  },
};
