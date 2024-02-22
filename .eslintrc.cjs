/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "next",
  ],
  plugins: ["@typescript-eslint", "import", "@stylexjs"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "no-console": "error",
    "import/no-cycle": "error",
    "@stylexjs/valid-styles": "off", // TODO: Re-enable when it will be reliable.
  },
  settings: {
    "import/ignore": ["react-native"],
  },
};
