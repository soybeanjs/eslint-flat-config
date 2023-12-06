import prettierPlugin from 'eslint-plugin-prettier';
import prettierRules from 'eslint-config-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import { GLOB_PRETTIER_LINT } from '../constants/glob';
import type { Option } from '../types';

const { rules: eslintRules } = prettierRules;

export function createPrettierConfig(options?: Option['prettier']) {
  const { rules = {}, usePrettierrc = true } = options || {};

  const configs: FlatESLintConfig[] = [
    {
      files: GLOB_PRETTIER_LINT,
      plugins: {
        prettier: prettierPlugin
      },
      rules: {
        ...eslintRules,
        'prettier/prettier': ['warn', rules, { usePrettierrc }],
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  ];

  return configs;
}
