import unusedImports from 'eslint-plugin-unused-imports';
import tsParser from '@typescript-eslint/parser';
import tsEslint from 'typescript-eslint';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');
const prettierignorePath = path.resolve(__dirname, '.prettierignore');

export default [
  ...tsEslint.configs.recommended,
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(prettierignorePath),
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 13,
      sourceType: 'module',
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      semi: 'error',
      'no-eval': 'error',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'error',
      'no-inline-comments': 'error',
      'no-multi-spaces': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'no-alert': 'error',
      'no-new': 'error',
      'no-invalid-this': 'error',
      'no-debugger': 'error',
      'no-tabs': 'error',
      'no-unused-vars': 'warn',
      'no-unused-expressions': 'error',
      'no-unreachable-loop': 'error',
      'no-unreachable': 'warn',
      'no-unsafe-negation': 'error',
      'no-unused-labels': 'error',
      'no-async-promise-executor': 'error',
      'no-case-declarations': 'error',
      'no-constant-condition': 'error',
      strict: 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
      'max-nested-callbacks': [
        'error',
        {
          max: 3,
        },
      ],
      'no-floating-decimal': 'error',
      'no-trailing-spaces': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.d.ts'],
  },
];
