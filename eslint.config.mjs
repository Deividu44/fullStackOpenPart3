import globals from "globals";
import js from "@eslint/js";

/**@type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules', 'dist']
  },
 js.configs.recommended,
 {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
      ...globals.es2021
    }
  }
 },
 {
  files: ['**/*.js'],
  rules: {
    'no-undef': 0,
    'no-unused-vars': 0,
    'eqeqeq': 'error',
    'quotes': ['error', 'single'],
    'semicolon': []
    }
  }
]