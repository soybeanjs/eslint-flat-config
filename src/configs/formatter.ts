import * as plainParser from 'eslint-parser-plain';
import prettierPlugin from 'eslint-plugin-prettier';
import type { FlatESLintConfig } from 'eslint-define-config';
import {
  GLOB_CSS,
  GLOB_HTML,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_POSTCSS,
  GLOB_SCSS,
  GLOB_YAML
} from '../constants/glob';

import type { Option, PrettierLanguageRules, PrettierParser } from '../types';

export function createFormatterConfig(options?: Option['formatter'], prettierOptions: Option['prettier'] = {}) {
  const { html = true, css = true, json = true, markdown, yaml } = options || {};

  function createPrettierFormatter(files: string[], parser: PrettierParser, plugins?: string[]) {
    const { rules: prettierRules, usePrettierrc } = prettierOptions;

    const rules: Partial<PrettierLanguageRules> = {
      ...prettierRules,
      parser
    };

    if (plugins?.length) {
      rules.plugins = plugins;
    }

    const config: FlatESLintConfig = {
      files,
      languageOptions: {
        parser: plainParser
      },
      plugins: {
        prettier: prettierPlugin
      },
      rules: {
        'prettier/prettier': ['warn', rules, { usePrettierrc }]
      }
    };

    return config;
  }

  const configs: FlatESLintConfig[] = [];

  if (css) {
    const cssConfig = createPrettierFormatter([GLOB_CSS, GLOB_POSTCSS], 'css');
    const scssConfig = createPrettierFormatter([GLOB_SCSS], 'scss');
    const lessConfig = createPrettierFormatter([GLOB_LESS], 'less');

    configs.push(cssConfig, scssConfig, lessConfig);
  }

  if (html) {
    const htmlConfig = createPrettierFormatter([GLOB_HTML], 'html');
    configs.push(htmlConfig);
  }

  if (json) {
    const jsonConfig = createPrettierFormatter([GLOB_JSON, GLOB_JSONC], 'json');
    const json5Config = createPrettierFormatter([GLOB_JSON5], 'json5');
    configs.push(jsonConfig, json5Config);
  }

  if (markdown) {
    const markdownConfig = createPrettierFormatter([GLOB_MARKDOWN], 'markdown');
    configs.push(markdownConfig);
  }

  if (yaml) {
    const yamlConfig = createPrettierFormatter([GLOB_YAML], 'yaml');
    configs.push(yamlConfig);
  }

  return configs;
}
