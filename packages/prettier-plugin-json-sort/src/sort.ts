import { alphabetSort, sortObject, sortStringArray } from './shared';
import type { ObjectExpression, ObjectProperty, StringArrayExpression, StringLiteral } from './types';

export function formatPackageJson(properties: ObjectProperty[]) {
  let props = sortPackageJson(properties);

  props = sortObjectProperties(props);

  return props;
}

export function formatTSConfig(properties: ObjectProperty[]) {
  let props = sortTSConfig(properties);

  props = sortObjectProperties(props);

  return props;
}

function sortPackageJson(properties: ObjectProperty[]) {
  const dependencyNames = [
    'engines',
    'scripts',
    'bundledDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'dependencies',
    'dependenciesMeta',
    'optionalDependencies',
    'devDependencies',
    'overrides',
    'resolutions'
  ];

  const orders = [
    '$schema',
    'name',
    'displayName',
    'type',
    'version',
    'private',
    'packageManager',
    'description',
    'author',
    'publisher',
    'license',
    'funding',
    'homepage',
    'repository',
    'bugs',
    'keywords',
    'categories',
    'maintainers',
    'contributors',
    'donate',
    'sponsor',
    'preview',
    'workspaces',
    'languageName',
    'publisher',
    'publishConfig',
    'sideEffects',
    'cpu',
    'os',
    'man',
    'bin',
    'exports',
    'main',
    'module',
    'imports',
    'esnext',
    'es2020',
    'esm2020',
    'fesm2020',
    'es2015',
    'esm2015',
    'fesm2015',
    'es5',
    'esm5',
    'fesm5',
    'browser',
    'umd',
    'jsdelivr',
    'unpkg',
    'types',
    'typings',
    'typesVersions',
    'directories',
    'files',
    ...dependencyNames,
    'pnpm',
    'husky',
    'simple-git-hooks',
    'lint-staged',
    'eslintConfig'
  ];

  let props = sortJsonByOrders(properties, orders);

  props = dependencyNames.reduce((acc, item) => sortObjectPropertiesByKey(acc, item), props);

  props = sortExportsOfPackageJson(props);

  return props;
}

export function sortExportsOfPackageJson(properties: ObjectProperty[]) {
  const item = properties.find(property => property.key.value === 'exports');

  if (!item) return properties;

  if (item.value.type === 'ObjectExpression') {
    const exportsOrder = ['types', 'import', 'require', 'default'];

    const isMatchKey = (property: ObjectProperty) => {
      if (property.type === 'ObjectProperty') {
        const children = (property.value as ObjectExpression).properties;

        return children.some(child => exportsOrder.includes(child.key.value));
      }

      return false;
    };

    if (isMatchKey(item)) {
      item.value.properties = sortJsonByOrders(item.value.properties, exportsOrder);
    } else {
      item.value.properties = item.value.properties.map(property => {
        const p = property as ObjectProperty;

        if (isMatchKey(p) && p.value.type === 'ObjectExpression') {
          p.value.properties = sortJsonByOrders(p.value.properties, exportsOrder);
        }

        return property;
      }) as ObjectProperty[];
    }
  }

  return properties;
}

function sortTSConfig(properties: ObjectProperty[]) {
  const orders: string[] = ['extends', 'compilerOptions', 'references', 'files', 'include', 'exclude'];

  const compilerOptionsOrders: string[] = [
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
  ];
  let props = sortJsonByOrders(properties, orders);

  props = sortObjectPropertiesByKey(properties, 'compilerOptions', compilerOptionsOrders);

  return props;
}

function sortJsonByOrders(properties: ObjectProperty[], orders: string[]) {
  const others: ObjectProperty[] = [];
  const known = properties.filter(property => {
    if (orders.includes(property.key.value)) {
      return true;
    }
    others.push(property);
    return false;
  });

  known.sort((a, b) => alphabetSort(orders.indexOf(a.key.value), orders.indexOf(b.key.value)));

  others.sort(sortObject);

  return [...known, ...others];
}

function sortObjectProperties(properties: ObjectProperty[]) {
  const filesNode = properties.find(property => property.key.value === 'files');

  if (!filesNode) {
    return properties;
  }

  let readme: StringLiteral | undefined;
  let license: StringLiteral | undefined;

  const filesNodeValue = filesNode.value as StringArrayExpression;

  const [normals, negations] = filesNodeValue.elements.reduce<[StringLiteral[], StringLiteral[]]>(
    (acc, node) => {
      const value = node.value.toLowerCase();

      if (value === 'license') {
        license = node;
        return acc;
      }

      if (value === 'readme' || value === 'readme.md') {
        readme = node;
        return acc;
      }

      acc[Number(value.startsWith('!'))].push(node);

      return acc;
    },
    [[], []]
  );

  normals.sort(sortStringArray);
  negations.sort(sortStringArray);

  if (readme) {
    normals.push(readme);
  }

  if (license) {
    normals.push(license);
  }

  filesNodeValue.elements = [...normals, ...negations];

  return properties;
}

function sortObjectPropertiesByKey(properties: ObjectProperty[], key: string, orders: string[] = []) {
  const item = properties.find(property => property.key.value === key);

  if (!item) return properties;

  if (item.value.type === 'ObjectExpression') {
    if (orders.length) {
      item.value.properties = sortJsonByOrders(item.value.properties, orders);
    } else {
      item.value.properties.sort(sortObject);
    }
  }

  return properties;
}
