import 'tsx';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** @type {{ defineConfig: import('./src/index.ts').defineConfig }} */
const { defineConfig } = require('./src/index.ts');

export default defineConfig(
  {
    vue: true,
    react: { files: ['**/*react.tsx'] },
    solid: { files: ['**/*solid.tsx'] },
    svelte: true,
    astro: true,
    formatter: {
      html: true,
      markdown: true,
      yaml: true,
      toml: true
    }
  },
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
