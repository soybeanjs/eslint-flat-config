import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { FlatESLintConfig } from 'eslint-define-config';
import { GLOB_TS, GLOB_TSX } from '../constants/glob';

export function createTsConfig() {
  const ts: FlatESLintConfig[] = [
    {
      files: [GLOB_TS, GLOB_TSX],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          sourceType: 'module'
        }
      },
      plugins: {
        '@typescript-eslint': tsPlugin as any
      },
      rules: {
        ...tsPlugin.configs['eslint-recommended'].overrides![0].rules,
        ...tsPlugin.configs.strict.rules,
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', disallowTypeAnnotations: false }
        ],
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true
          }
        ],
        // Override JS
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'all',
            ignoreRestSiblings: false,
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_'
          }
        ],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        // off
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ];

  return ts;
}
