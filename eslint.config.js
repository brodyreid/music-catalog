import js from '@eslint/js';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  eslintPluginPrettierRecommended,
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/jsx-max-props-per-line': ['off', { maximum: 1, when: 'multiline' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
