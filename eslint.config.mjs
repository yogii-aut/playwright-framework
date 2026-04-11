import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'report/**',
      'allure-report/**',
      'allure-results/**',
      'playwright-report/**',
      'test-results/**',
      'orchestration/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      playwright
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules
    }
  },
  {
    files: ['src/tests/mobile/**/*.ts'],
    rules: {
      'playwright/no-standalone-expect': 'off',
      'playwright/no-useless-await': 'off'
    }
  },
  prettier
);
