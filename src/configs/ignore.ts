import type { FlatESLintConfig } from 'eslint-define-config';

import { GLOB_EXCLUDE } from '../constants/glob';

export function createIgnoreConfig() {
  const configs: FlatESLintConfig[] = [
    {
      ignores: GLOB_EXCLUDE
    }
  ];

  return configs;
}
