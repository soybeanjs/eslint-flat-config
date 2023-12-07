import { createRequire } from 'node:module';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierRules from 'eslint-config-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import { GLOB_PRETTIER_LINT } from '../constants/glob';
import type { PrettierLanguageRules } from '../types';

const { rules: eslintRules } = prettierRules;

export function createPrettierConfig(rules: Partial<PrettierLanguageRules>) {
  if (!rules.plugins?.length) {
    rules.plugins = [];
  }

  const require = createRequire(import.meta.url);
  rules.plugins.push(require.resolve('prettier-plugin-jsdoc'));

  const configs: FlatESLintConfig[] = [
    {
      files: GLOB_PRETTIER_LINT,
      plugins: {
        prettier: prettierPlugin
      },
      rules: {
        ...eslintRules,
        'prettier/prettier': ['warn', rules],
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ];

  return configs;
}
