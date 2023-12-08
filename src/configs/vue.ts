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

  const vueRules = configKeys.reduce((preRules, key) => {
    const config = pluginVue.configs[key];
    return {
      ...preRules,
      ...config.rules
    };
  }, {});

  const configs: FlatESLintConfig[] = [
    {
      plugins: {
        vue: pluginVue
      }
    },
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
      processor: pluginVue.processors!['.vue'],
      plugins: {
        '@typescript-eslint': pluginTs as any
      },
      rules: {
        ...tsRules,
        ...pluginVue.configs.base.rules,
        ...vueRules,
        'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
        'vue/component-api-style': ['warn', ['script-setup', 'composition']],
        'vue/component-name-in-template-casing': [
          'warn',
          'PascalCase',
          { registeredComponentsOnly: false, ignores: [] }
        ],
        'vue/component-options-name-casing': ['warn', 'PascalCase'],
        'vue/custom-event-name-casing': ['warn', 'camelCase'],
        'vue/define-emits-declaration': ['warn', 'type-literal'],
        'vue/define-macros-order': [
          'warn',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
          }
        ],
        'vue/define-props-declaration': ['warn', 'type-based'],
        'vue/html-comment-content-newline': 'warn',
        'vue/multi-word-component-names': 'warn',
        'vue/next-tick-style': ['warn', 'promise'],
        'vue/no-duplicate-attr-inheritance': 'warn',
        'vue/no-ref-object-reactivity-loss': 'error',
        'vue/no-required-prop-with-default': 'warn',
        'vue/no-setup-props-reactivity-loss': 'error',
        'vue/no-static-inline-styles': 'warn',
        'vue/no-template-target-blank': 'error',
        'vue/no-this-in-before-route-enter': 'error',
        'vue/no-undef-properties': 'warn',
        'vue/no-unsupported-features': 'warn',
        'vue/no-unused-emit-declarations': 'warn',
        'vue/no-unused-properties': 'warn',
        'vue/no-unused-refs': 'warn',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': 'warn',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-text': 'warn',
        'vue/padding-line-between-blocks': 'warn',
        'vue/prefer-define-options': 'warn',
        'vue/prefer-separate-static-class': 'warn',
        'vue/prefer-true-attribute-shorthand': 'warn',
        'vue/prop-name-casing': ['warn', 'camelCase'],
        'vue/require-macro-variable-name': [
          'warn',
          {
            defineProps: 'props',
            defineEmits: 'emit',
            defineSlots: 'slots',
            useSlots: 'slots',
            useAttrs: 'attrs'
          }
        ],
        'vue/v-on-handler-style': [
          'warn',
          ['method', 'inline-function'],
          {
            ignoreIncludesComment: false
          }
        ],
        'vue/valid-define-options': 'warn'
      }
    }
  ];

  return configs;
}
