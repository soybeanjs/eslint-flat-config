import prettierPlugin from 'eslint-plugin-prettier';
import prettierRules from 'eslint-config-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import { GLOB_PRETTIER_LINT } from '../constants/glob';
import type { PrettierLanguageRules } from '../types';

const { rules: eslintRules } = prettierRules;

export function createPrettierConfig(rules: Partial<PrettierLanguageRules>) {
  const { plugins = [] } = rules;

  const pRules: Partial<PrettierLanguageRules> = {
    ...rules,
    plugins: plugins.concat('prettier-plugin-jsdoc')
  };

  const configs: FlatESLintConfig[] = [
    {
      files: GLOB_PRETTIER_LINT,
      plugins: {
        prettier: prettierPlugin
      },
      rules: {
        ...eslintRules,
        'prettier/prettier': ['warn', pRules],
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ];

  return configs;
}
