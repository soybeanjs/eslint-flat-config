import 'tsx';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { defineConfig } = require('./src/index.ts');

export default defineConfig(
  { vue: true, formatter: { markdown: true, yaml: true, toml: true } },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', '[id]']
        }
      ]
    }
  }
);
