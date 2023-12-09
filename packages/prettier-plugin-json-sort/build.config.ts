import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  externals: ['prettier'],
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      minify: true
    }
  }
});
