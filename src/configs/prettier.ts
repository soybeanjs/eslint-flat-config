import prettierPlugin from 'eslint-plugin-prettier';
import prettierRules from 'eslint-config-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import type { Option } from '../types';

const { rules: eslintRules } = prettierRules;

export function createPrettierConfig(options?: Option['prettier']) {
  const {
    rules = {
      printWidth: 120,
      singleQuote: true,
      trailingComma: 'none',
      arrowParens: 'avoid',
      htmlWhitespaceSensitivity: 'ignore'
    },
    usePrettierrc = true
  } = options || {};

  const configs: FlatESLintConfig[] = [
    {
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
