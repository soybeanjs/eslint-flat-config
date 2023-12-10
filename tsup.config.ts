import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  external: ['eslint-plugin-vue', 'vue-eslint-parser', 'prettier-plugin-toml', '@toml-tools/parser'],
  shims: true,
  sourcemap: false,
  target: 'node14',
  minify: false
});
