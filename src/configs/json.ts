import pluginJson from 'eslint-plugin-jsonc';
import jsonParser from 'jsonc-eslint-parser';
import type { FlatESLintConfig, Rules } from 'eslint-define-config';
import {
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_PACKAGE_JSON,
  GLOB_TS_CONFIG,
  GLOB_TS_OTHER_CONFIG
} from '../constants/glob';

export function createJsonConfig() {
  const packageJson = createSortPackageJson();
  const tsConfig = createSortTsConfig();

  const configs: FlatESLintConfig[] = [
    {
      files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
      languageOptions: {
        parser: jsonParser
      },
      plugins: {
        jsonc: pluginJson as any
      },
      rules: {
        ...(pluginJson.configs['recommended-with-jsonc'].rules as unknown as Rules)
      }
    },
    packageJson,
    tsConfig
  ];

  return configs;
}

function createSortPackageJson() {
  const config: FlatESLintConfig = {
    files: [GLOB_PACKAGE_JSON],
    rules: {
      'jsonc/sort-array-values': [
        'warn',
        {
          order: { type: 'asc' },
          pathPattern: '^files$'
        }
      ],
      'jsonc/sort-keys': [
        'warn',
        {
          order: [
            'publisher',
            'name',
            'displayName',
            'type',
            'version',
            'private',
            'packageManager',
            'description',
            'author',
            'license',
            'funding',
            'homepage',
            'repository',
            'bugs',
            'keywords',
            'categories',
            'sideEffects',
            'exports',
            'main',
            'module',
            'unpkg',
            'jsdelivr',
            'types',
            'typesVersions',
            'bin',
            'icon',
            'files',
            'engines',
            'activationEvents',
            'contributes',
            'scripts',
            'peerDependencies',
            'peerDependenciesMeta',
            'dependencies',
            'optionalDependencies',
            'devDependencies',
            'pnpm',
            'overrides',
            'resolutions',
            'husky',
            'simple-git-hooks',
            'lint-staged',
            'eslintConfig'
          ],
          pathPattern: '^$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^resolutions$'
        },
        {
          order: { type: 'asc' },
          pathPattern: '^pnpm.overrides$'
        },
        {
          order: ['types', 'import', 'require', 'default'],
          pathPattern: '^exports.*$'
        }
      ]
    }
  };

  return config;
}

function createSortTsConfig() {
  const config: FlatESLintConfig = {
    files: [GLOB_TS_CONFIG, GLOB_TS_OTHER_CONFIG],
    rules: {
      'jsonc/sort-keys': [
        'warn',
        {
          order: ['extends', 'compilerOptions', 'references', 'files', 'include', 'exclude'],
          pathPattern: '^$'
        },
        {
          order: [
            /* Projects */
            'incremental',
            'composite',
            'tsBuildInfoFile',
            'disableSourceOfProjectReferenceRedirect',
            'disableSolutionSearching',
            'disableReferencedProjectLoad',
            /* Language and Environment */
            'target',
            'jsx',
            'jsxFactory',
            'jsxFragmentFactory',
            'jsxImportSource',
            'lib',
            'moduleDetection',
            'noLib',
            'reactNamespace',
            'useDefineForClassFields',
            'emitDecoratorMetadata',
            'experimentalDecorators',
            /* Modules */
            'baseUrl',
            'rootDir',
            'rootDirs',
            'customConditions',
            'module',
            'moduleResolution',
            'moduleSuffixes',
            'noResolve',
            'paths',
            'resolveJsonModule',
            'resolvePackageJsonExports',
            'resolvePackageJsonImports',
            'typeRoots',
            'types',
            'allowArbitraryExtensions',
            'allowImportingTsExtensions',
            'allowUmdGlobalAccess',
            /* JavaScript Support */
            'allowJs',
            'checkJs',
            'maxNodeModuleJsDepth',
            /* Type Checking */
            'strict',
            'strictBindCallApply',
            'strictFunctionTypes',
            'strictNullChecks',
            'strictPropertyInitialization',
            'allowUnreachableCode',
            'allowUnusedLabels',
            'alwaysStrict',
            'exactOptionalPropertyTypes',
            'noFallthroughCasesInSwitch',
            'noImplicitAny',
            'noImplicitOverride',
            'noImplicitReturns',
            'noImplicitThis',
            'noPropertyAccessFromIndexSignature',
            'noUncheckedIndexedAccess',
            'noUnusedLocals',
            'noUnusedParameters',
            'useUnknownInCatchVariables',
            /* Emit */
            'declaration',
            'declarationDir',
            'declarationMap',
            'downlevelIteration',
            'emitBOM',
            'emitDeclarationOnly',
            'importHelpers',
            'importsNotUsedAsValues',
            'inlineSourceMap',
            'inlineSources',
            'mapRoot',
            'newLine',
            'noEmit',
            'noEmitHelpers',
            'noEmitOnError',
            'outDir',
            'outFile',
            'preserveConstEnums',
            'preserveValueImports',
            'removeComments',
            'sourceMap',
            'sourceRoot',
            'stripInternal',
            /* Interop Constraints */
            'allowSyntheticDefaultImports',
            'esModuleInterop',
            'forceConsistentCasingInFileNames',
            'isolatedModules',
            'preserveSymlinks',
            'verbatimModuleSyntax',
            /* Completeness */
            'skipDefaultLibCheck',
            'skipLibCheck'
          ],
          pathPattern: '^compilerOptions$'
        }
      ]
    }
  };

  return config;
}
