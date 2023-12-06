import type { PrettierRules } from '../types';

export const DEFAULT_PRETTIER_RULES: Partial<PrettierRules> = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  htmlWhitespaceSensitivity: 'ignore'
};
