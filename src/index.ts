import process from 'node:process';
import type { FlatESLintConfig } from 'eslint-define-config';
import { DEFAULT_PRETTIER_RULES } from './constants/prettier';
import {
  createFormatterConfig,
  createIgnoreConfig,
  createImportConfig,
  createJsConfig,
  createNodeConfig,
  createPrettierConfig,
  createReactConfig,
  createSolidConfig,
  createTsConfig,
  createUnicornConfig,
  createVueConfig
} from './configs';
import { loadPrettierConfig } from './shared';
import type { Awaitable, Option } from './types';

export async function defineConfig(options: Partial<Option> = {}, ...userConfigs: Awaitable<FlatESLintConfig>[]) {
  const opts = await createOptions(options);

  const ignore = createIgnoreConfig(options.ignores);
  const js = createJsConfig();
  const node = await createNodeConfig();
  const imp = await createImportConfig();
  const unicorn = await createUnicornConfig();
  const ts = await createTsConfig();
  const vue = await createVueConfig(opts.vue);
  const solid = await createSolidConfig(opts.solid);
  const react = await createReactConfig(opts.react, opts['react-native']);
  const prettier = await createPrettierConfig(opts.prettierRules);
  const formatter = await createFormatterConfig(opts.formatter, opts.prettierRules);
  const userResolved = await Promise.all(userConfigs);

  const configs: FlatESLintConfig[] = [
    ...ignore,
    ...js,
    ...node,
    ...imp,
    ...unicorn,
    ...ts,
    ...vue,
    ...react,
    ...solid,
    ...userResolved,
    ...prettier,
    ...formatter
  ];

  return configs;
}

async function createOptions(options: Partial<Option> = {}) {
  const opts: Option = {
    cwd: process.cwd(),
    ignores: [],
    prettierRules: {
      ...DEFAULT_PRETTIER_RULES
    },
    usePrettierrc: true,
    formatter: {
      html: true,
      css: true,
      json: true
    }
  };

  const { cwd, prettierRules, usePrettierrc, formatter, ...rest } = options;

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

  Object.assign(opts, rest);

  return opts;
}
