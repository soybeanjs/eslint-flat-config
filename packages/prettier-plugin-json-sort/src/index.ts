import type { Plugin } from 'prettier';
import { parsers } from 'prettier/plugins/babel';
import { formatPackageJson, formatTSConfig } from './sort';
import type { ObjectExpression } from './types';

function createPackageJsonSortPlugin() {
  const jsonParser = parsers.json;

  const PKG_REG = /[/\\]?package\.json$/;
  const TS_CONFIG_REG = /[/\\]?tsconfig\.json$/;
  const TS_OTHER_CONFIG_REG = /[/\\]?tsconfig\..*\.json$/;

  const plugin: Plugin & { name: string } = {
    name: 'prettier-plugin-json-sort',
    parsers: {
      json: {
        ...jsonParser,
        parse(text, options) {
          const { filepath } = options;
          const ast = jsonParser.parse(text, options) as { node: ObjectExpression };

          if (PKG_REG.test(filepath)) {
            ast.node.properties = formatPackageJson(ast.node.properties);
          }

          if (TS_CONFIG_REG.test(filepath) || TS_OTHER_CONFIG_REG.test(filepath)) {
            ast.node.properties = formatTSConfig(ast.node.properties);
          }

          return ast;
        }
      }
    }
  };

  return plugin;
}

const plugin = createPackageJsonSortPlugin();

export default plugin;
