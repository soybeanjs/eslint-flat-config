import pluginNode from 'eslint-plugin-n';
import type { FlatESLintConfig } from 'eslint-define-config';

export function createNodeConfig() {
  const configs: FlatESLintConfig[] = [
    {
      plugins: {
        n: pluginNode
      },
      rules: {
        'n/handle-callback-err': ['error', '^(err|error)$'],
        'n/no-deprecated-api': 'error',
        'n/no-exports-assign': 'error',
        'n/no-new-require': 'error',
        'n/no-path-concat': 'error',
        'n/prefer-global/buffer': ['error', 'never'],
        'n/prefer-global/process': ['error', 'never'],
        'n/process-exit-as-throw': 'error'
      }
    }
  ];

  return configs;
}
