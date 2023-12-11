import type { FlatESLintConfig, Rules } from 'eslint-define-config';
import { ensurePackages, interopDefault } from '../shared';
import { GLOB_ASTRO } from '../constants/glob';
import type { PrettierLanguageRules } from '../types';
import { createTsRules } from './typescript';

export async function createAstroConfig(enable?: boolean, prettierRules: Partial<PrettierLanguageRules> = {}) {
  if (!enable) return [];

  await ensurePackages(['eslint-plugin-astro', 'astro-eslint-parser', 'prettier-plugin-astro']);

  const [pluginAstro, parserAstro, pluginTs, pluginPrettier] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('eslint-plugin-prettier'))
  ]);

  const tsRules = await createTsRules();

  const { plugins = [] } = prettierRules;

  const pRules: Partial<PrettierLanguageRules> = {
    ...prettierRules,
    plugins: plugins.concat('prettier-plugin-astro')
  };

  const configs: FlatESLintConfig[] = [
    {
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: '@typescript-eslint/parser',
          sourceType: 'module'
        }
      },
      plugins: {
        '@typescript-eslint': pluginTs as any,
        astro: pluginAstro as any,
        prettier: pluginPrettier
      },
      processor: pluginAstro.processors.astro,
      rules: {
        ...tsRules,
        ...(pluginAstro.configs.recommended.rules as Partial<Rules>),
        'prettier/prettier': [
          'warn',
          {
            ...pRules,
            parser: 'astro'
          }
        ]
      }
    },
    {
      files: ['**/*.astro/*.js', '*.astro/*.js'],
      languageOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ];

  return configs;
}
