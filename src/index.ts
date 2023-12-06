import type { FlatESLintConfig } from 'eslint-define-config';
import { DEFAULT_PRETTIER_RULES } from './constants/prettier';
import { createIgnoreConfig } from './configs/ignore';
import { createJsConfig } from './configs/javascript';
import { createTsConfig } from './configs/typescript';
import { createPrettierConfig } from './configs/prettier';
import { createFormatterConfig } from './configs/formatter';
import type { Option } from './types';

export function defineConfig(options: Partial<Option> = {}) {
  const opts = createOptions(options);

  const ignore = createIgnoreConfig();

  const js = createJsConfig();

  const ts = createTsConfig();

  const prettier = createPrettierConfig(opts.prettier);

  const formatter = createFormatterConfig(opts.formatter, opts.prettier);

  const configs: FlatESLintConfig[] = [...ignore, ...js, ...ts, ...formatter, ...prettier];

  return configs;
}

function createOptions(options: Partial<Option> = {}) {
  const opts: Option = {
    cwd: process.cwd(),
    prettier: {
      rules: DEFAULT_PRETTIER_RULES,
      usePrettierrc: true
    },
    formatter: {
      html: true,
      css: true,
      json: true
    }
  };

  const { cwd, prettier, formatter } = options;

  if (cwd) {
    opts.cwd = cwd;
  }

  if (prettier?.rules) {
    Object.assign(opts.prettier.rules!, prettier.rules);
  }

  if (prettier?.usePrettierrc !== undefined) {
    opts.prettier.usePrettierrc = prettier.usePrettierrc;
  }

  if (formatter) {
    Object.assign(opts.formatter, formatter);
  }

  return opts;
}

export * from './types';
