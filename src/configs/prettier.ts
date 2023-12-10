import prettierRules from 'eslint-config-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import { GLOB_PRETTIER_LINT } from '../constants/glob';
import { interopDefault } from '../shared';
import type { PrettierLanguageRules } from '../types';

const { rules: eslintRules } = prettierRules;

export async function createPrettierConfig(rules: Partial<PrettierLanguageRules>) {
  const pluginPrettier = await interopDefault(import('eslint-plugin-prettier'));

  const { plugins = [] } = rules;

  const pRules: Partial<PrettierLanguageRules> = {
    ...rules,
    plugins: plugins.concat('prettier-plugin-jsdoc')
  };

  const configs: FlatESLintConfig[] = [
    {
      files: GLOB_PRETTIER_LINT,
      plugins: {
        prettier: pluginPrettier
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
