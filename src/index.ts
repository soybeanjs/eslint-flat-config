import type { FlatESLintConfig } from 'eslint-define-config';
import type { Option } from './types';
import { createIgnoreConfig } from './configs/ignore';
import { createJsConfig } from './configs/javascript';
import { createTsConfig } from './configs/typescript';
import { createPrettierConfig } from './configs/prettier';

export function defineConfig(options: Partial<Option>) {
  const ignore = createIgnoreConfig();

  const js = createJsConfig();

  const ts = createTsConfig();

  const prettier = createPrettierConfig(options.prettier);

  const configs: FlatESLintConfig[] = [...ignore, ...js, ...ts, ...prettier];

  return configs;
}

export * from './types';
