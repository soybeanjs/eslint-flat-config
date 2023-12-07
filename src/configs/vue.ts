import type { FlatESLintConfig } from 'eslint-define-config';
import { ensurePackages, interopDefault } from '../shared';
import { GLOB_VUE } from '../constants/glob';
import type { VueOption } from '../types';
import { tsRules } from './typescript';

export async function createVueConfig(options: VueOption) {
  await ensurePackages(['eslint-plugin-vue', 'vue-eslint-parser']);

  type VueConfigKey = import('eslint-plugin-vue').VueConfigKey;

  const [pluginVue, parserVue, pluginTs] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('@typescript-eslint/eslint-plugin'))
  ]);

  const configKeys: VueConfigKey[] =
    options.version === 3
      ? ['vue3-essential', 'vue3-strongly-recommended', 'vue3-recommended']
      : ['essential', 'strongly-recommended', 'recommended'];

  const rules = configKeys.reduce((preRules, key) => {
    const config = pluginVue.configs[key];
    return {
      ...preRules,
      ...config.rules
    };
  }, {});

  const configs: FlatESLintConfig[] = [
    {
      files: [GLOB_VUE],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          extraFileExtensions: ['.vue'],
          parser: '@typescript-eslint/parser',
          sourceType: 'module'
        }
      },
      plugins: {
        '@typescript-eslint': pluginTs as any,
        vue: pluginVue
      },
      processor: pluginVue.processors!['.vue'],
      rules: {
        ...tsRules
      }
    },
    {
      plugins: {
        vue: pluginVue
      },
      rules: {
        ...pluginVue.configs.base.rules,
        ...rules,
        'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
        'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
        'vue/component-options-name-casing': ['warn', 'PascalCase'],
        'vue/custom-event-name-casing': ['warn', 'camelCase'],
        'vue/define-macros-order': [
          'warn',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
          }
        ],
        'vue/multi-word-component-names': [
          'warn',
          {
            ignores: ['index', 'App']
          }
        ],
        'vue/prop-name-casing': ['warn', 'camelCase']
      }
    }
  ];

  return configs;
}
