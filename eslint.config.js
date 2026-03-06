import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist/**', 'node_modules/**'] },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript rules (no type-checked project required)
  ...tseslint.configs.recommended,

  // Vue rules — includes vue-eslint-parser as the file-level parser
  ...pluginVue.configs['flat/recommended'],

  // Plug the TypeScript parser into the Vue <script> block; add browser globals
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // Browser globals for TypeScript source files
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Node.js globals for scripts and shared .mjs modules
  {
    files: ['scripts/**/*.mjs', 'src/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  // Project-wide rule overrides
  {
    rules: {
      // Single-word page/component names are intentional in this project
      'vue/multi-word-component-names': 'off',
      // TypeScript types make runtime default-prop declarations redundant
      'vue/require-default-prop': 'off',
      // Template formatting — delegate entirely to Prettier
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
    },
  }
);
