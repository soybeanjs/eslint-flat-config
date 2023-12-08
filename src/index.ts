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
  createTsConfig,
  createUnicornConfig,
  createVueConfig
} from './configs';
import { loadPrettierConfig } from './shared';
import type { Awaitable, Option, VueOption } from './types';

export async function defineConfig(options: Partial<Option> = {}, ...userConfigs: Awaitable<FlatESLintConfig>[]) {
  const opts = await createOptions(options);

  const ignore = createIgnoreConfig(options.ignores);
  const js = createJsConfig();
  // const json = createJsonConfig();
  const node = createNodeConfig();
  const imp = createImportConfig();
  const unicorn = createUnicornConfig();
  const ts = createTsConfig();
  const vue = await getVueConfig(opts.vue);
  const prettier = createPrettierConfig(opts.prettierRules);
  const formatter = await createFormatterConfig(opts.formatter, opts.prettierRules);
  const userResolved = await Promise.all(userConfigs);

  const configs: FlatESLintConfig[] = [
    ...ignore,
    ...js,
    // ...json,
    ...node,
    ...imp,
    ...unicorn,
    ...ts,
    ...vue,
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

async function getVueConfig(options?: Option['vue']) {
  if (options) {
    const DEFAULT_VUE_OPTION: VueOption = {
      version: 3
    };
    const vueOption = typeof options === 'boolean' ? DEFAULT_VUE_OPTION : options;

    const vueConfig = await createVueConfig(vueOption);

    return vueConfig;
  }

  return [];
}

export * from './types';
