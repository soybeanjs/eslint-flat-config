import type { FlatESLintConfig } from 'eslint-define-config';

import { GLOB_EXCLUDE } from '../constants/glob';

export function createIgnoreConfig(ignores: string[] = []) {
  const configs: FlatESLintConfig[] = [
    {
      ignores: GLOB_EXCLUDE.concat(ignores)
    }
  ];

  return configs;
}
