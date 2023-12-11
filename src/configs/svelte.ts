import type { FlatESLintConfig, Rules } from 'eslint-define-config';
import { ensurePackages, interopDefault } from '../shared';
import { GLOB_SVELTE } from '../constants/glob';
import type { PrettierLanguageRules } from '../types';
import { createTsRules } from './typescript';

export async function createSvelteConfig(enable?: boolean, prettierRules: Partial<PrettierLanguageRules> = {}) {
  if (!enable) return [];

  await ensurePackages(['eslint-plugin-svelte', 'svelte-eslint-parser', 'prettier-plugin-svelte']);

  const [pluginSvelte, parserSvelte, pluginTs, pluginPrettier] = await Promise.all([
    interopDefault(import('eslint-plugin-svelte')),
    interopDefault(import('svelte-eslint-parser')),
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('eslint-plugin-prettier'))
  ]);

  const tsRules = await createTsRules();

  const { plugins = [] } = prettierRules;

  const pRules: Partial<PrettierLanguageRules> = {
    ...prettierRules,
    plugins: plugins.concat('prettier-plugin-svelte')
  };

  const configs: FlatESLintConfig[] = [
    {
      files: [GLOB_SVELTE],
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: ['.svelte'],
          parser: '@typescript-eslint/parser',
          sourceType: 'module'
        }
      },
      plugins: {
        '@typescript-eslint': pluginTs as any,
        svelte: pluginSvelte as any,
        prettier: pluginPrettier
      },
      processor: pluginSvelte.processors.svelte,
      rules: {
        ...tsRules,
        ...(pluginSvelte.configs.recommended.rules as Partial<Rules>),
        'prettier/prettier': [
          'warn',
          {
            ...pRules,
            parser: 'svelte'
          }
        ]
      }
    }
  ];

  return configs;
}
