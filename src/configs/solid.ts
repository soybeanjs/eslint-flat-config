import type { FlatESLintConfig } from 'eslint-define-config';
import { ensurePackages, interopDefault } from '../shared';
import { GLOB_JSX, GLOB_TSX } from '../constants/glob';

export async function createSolidConfig(enable?: boolean) {
  if (!enable) return [];

  await ensurePackages(['eslint-plugin-solid']);

  const pluginSolid = await interopDefault(import('eslint-plugin-solid'));

  const configs: FlatESLintConfig[] = [
    {
      plugins: {
        solid: pluginSolid
      }
    },
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      rules: {
        ...pluginSolid.configs.typescript.rules
      }
    }
  ];

  return configs;
}
