import pluginImport from 'eslint-plugin-i';
import type { FlatESLintConfig } from 'eslint-define-config';

export function createImportConfig() {
  const configs: FlatESLintConfig[] = [
    {
      plugins: {
        import: pluginImport
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
            pathGroups: [{ group: 'internal', pattern: '{{@,~}/,#}**' }]
          }
        ]
      }
    }
  ];

  return configs;
}
