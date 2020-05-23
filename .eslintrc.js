module.exports = {
  "env": {
    "es6": true,
    "node": true,
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true,
    },
  },
  "plugins": [
    "@typescript-eslint",
  ],
  "rules": {
    "@typescript-eslint/indent": ["warn", 2],
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true,
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false,
        },
      },
    ],
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/semi": [
      "warn",
      "always",
    ],
    "comma-dangle": "warn",
    "curly": "warn",
    "eqeqeq": [
      "warn",
      "always",
    ],
    "no-redeclare": "warn",
    "no-throw-literal": "warn",
    "no-trailing-spaces": "warn",
    "comma-dangle": ["error", "always-multiline"],
    "prefer-object-spread": "warn",
  },
};
