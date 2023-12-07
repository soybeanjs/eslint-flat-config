import process from 'node:process';
import type { FlatESLintConfig } from 'eslint-define-config';
import { DEFAULT_PRETTIER_RULES } from './constants/prettier';
import {
  createFormatterConfig,
  createIgnoreConfig,
  createImportConfig,
  createJsConfig,
  createJsonConfig,
  createNodeConfig,
  createPrettierConfig,
  createTsConfig,
  createUnicornConfig
} from './configs';
import { loadPrettierConfig } from './shared';
import type { Awaitable, Option } from './types';

export async function defineConfig(options: Partial<Option> = {}, ...userConfigs: Awaitable<FlatESLintConfig>[]) {
  const opts = await createOptions(options);

  const ignore = createIgnoreConfig(options.ignores);
  const js = createJsConfig();
  const json = createJsonConfig();
  const node = createNodeConfig();
  const imp = createImportConfig();
  const unicorn = createUnicornConfig();
  const ts = createTsConfig();
  const prettier = createPrettierConfig(opts.prettierRules);
  const formatter = createFormatterConfig(opts.formatter, opts.prettierRules);

  const userResolved = await Promise.all(userConfigs);

  const configs: FlatESLintConfig[] = [
    ...ignore,
    ...js,
    ...json,
    ...node,
    ...imp,
    ...unicorn,
    ...ts,
    ...userResolved,
    ...prettier,
    ...formatter
  ];

  return configs;
}

async function createOptions(options: Partial<Option> = {}) {
  const opts: Option = {
    cwd: process.cwd(),
    prettierRules: {
      ...DEFAULT_PRETTIER_RULES
    },
    usePrettierrc: true,
    formatter: {
      html: true,
      css: true,
      json: true
    },
    ignores: []
  };

  const { cwd, prettierRules, usePrettierrc, formatter } = options;

  if (cwd) {
    opts.cwd = cwd;
  }

  if (prettierRules) {
    opts.prettierRules = prettierRules;
  }

  if (usePrettierrc !== undefined) {
    opts.usePrettierrc = usePrettierrc;
  }

  if (opts.usePrettierrc) {
    const prettierConfig = await loadPrettierConfig(opts.cwd);
    Object.assign(opts.prettierRules, prettierConfig);
  }

  if (formatter) {
    Object.assign(opts.formatter, formatter);
  }

  return opts;
}

export * from './types';
