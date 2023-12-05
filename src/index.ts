import type { Linter } from 'eslint';
import antfu, { GLOB_MARKDOWN_CODE } from '@antfu/eslint-config';
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from '@antfu/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';

interface OtherLanguageConfig {
  reactNative?: boolean;
  solid?: boolean;
  svelte?: boolean;
  astro?: boolean;
}

export type Config = OptionsConfig & FlatConfigItem & OtherLanguageConfig;

const defaultOptions: Config = {
  stylistic: {
    indent: 2,
    jsx: true,
    semi: true,
    quotes: 'single'
  },
  typescript: true,
  jsonc: true,
  vue: false,
  react: false,
  formatters: {
    html: true,
    css: true,
    toml: 'dprint',
    markdown: 'prettier'
  },
  rules: {
    'no-console': 'warn',
    curly: ['error', 'all'],
    'style/arrow-parens': ['error', 'as-needed'],
    'style/brace-style': ['error', '1tbs'],
    'style/comma-dangle': ['error', 'never'],
    'style/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      },
      multilineDetection: 'brackets'
    }],
    'style/quote-props': ['error', 'as-needed', { numbers: true }],
    'ts/consistent-type-definitions': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'ts/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'all',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ]
  }
};

export async function defineConfig(
  options: Config = {},
  ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
  const { stylistic, formatters, rules, ...rest } = options;

  const opts = { ...defaultOptions, ...rest };

  if (typeof opts.stylistic === 'object' && typeof stylistic === 'object') {
    opts.stylistic = { ...opts.stylistic, ...stylistic };
  }

  if (typeof opts.formatters === 'object' && typeof formatters === 'object') {
    opts.formatters = { ...opts.formatters, ...formatters };
  }

  if (opts.vue && opts.rules) {
    Object.assign(opts.rules, {
      'vue/multiline-html-element-content-newline': ['error', {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
        allowEmptyLines: false
      }]
    });
  }

  opts.rules = { ...opts.rules, ...rules };

  const configs: UserConfigItem[] = [];

  const { solid, svelte, astro, reactNative } = opts;

  if (solid || svelte || astro) {
    const compat = new FlatCompat();

    const plugins: string[] = [];

    if (solid) {
      plugins.push('plugin:solid/typescript');
    }

    if (svelte) {
      plugins.push('plugin:svelte/all');
    }

    if (astro) {
      plugins.push('plugin:astro/recommended');
    }

    const overrides: Linter.Config['overrides'] = [];
    const env: Linter.Config['env'] = {};

    if (svelte) {
      overrides.push(
        {
          files: ['*.svelte'],
          parser: 'svelte-eslint-parser',
          parserOptions: {
            parser: '@typescript-eslint/parser',
            extraFileExtensions: ['.svelte']
          },
          rules: {
            'svelte/block-lang': ['error', { script: 'ts' }]
          }
        }
      );
    }

    if (astro) {
      overrides.push(
        {
          files: ['*.astro'],
          parser: 'astro-eslint-parser',
          parserOptions: {
            parser: '@typescript-eslint/parser',
            extraFileExtensions: ['.astro']
          },
          rules: {
            'style/jsx-one-expression-per-line': 'off'
          }
        },
        {
          files: ['**/*.astro/*.js', '*.astro/*.js'],
          parser: '@typescript-eslint/parser'
        }
      );
    }

    if (reactNative) {
      opts.react = true;
      env['react-native/react-native'] = true;
      plugins.push('plugin:react-native/all');
    }

    const configItem = compat.config({
      env,
      extends: plugins,
      overrides
    });

    configs.push(...configItem);
  }

  if (typeof opts.formatters === 'object' && opts.formatters.markdown) {
    configs.push({
      files: [GLOB_MARKDOWN_CODE],
      rules: {
        'ts/no-unused-vars': 'off'
      }
    });
  }

  return antfu(opts, ...configs, ...userConfigs);
}
