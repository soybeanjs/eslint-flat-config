import type { FlatESLintConfig } from 'eslint-define-config';
import { ensurePackages, interopDefault } from '../shared';
import { GLOB_JSX, GLOB_TSX } from '../constants/glob';
import type { Option } from '../types';

export async function createSolidConfig(options?: Option['solid']) {
  if (!options) return [];

  let files: string[] = [GLOB_JSX, GLOB_TSX];

  if (typeof options === 'object' && options.files?.length) {
    files = options.files;
  }

  await ensurePackages(['eslint-plugin-solid']);

  const pluginSolid = await interopDefault(import('eslint-plugin-solid'));

  const configs: FlatESLintConfig[] = [
    {
      plugins: {
        solid: pluginSolid
      }
    },
    {
      files,
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
