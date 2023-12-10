import { fileURLToPath } from 'node:url';
import path from 'node:path';
import jiti from 'jiti';

/**
 * TS runtime to resolve the eslint config file written in TypeScript.
 *
 * @param {string} filePath
 */
function createTsRuntime(filePath) {
  const fileName = fileURLToPath(import.meta.url);
  const runtime = jiti(fileName);

  return runtime(path.resolve(path.dirname(fileName), filePath));
}

/** @type {{ defineConfig: typeof import('./src').defineConfig }} */
const { defineConfig } = createTsRuntime('./src/index.ts');

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
