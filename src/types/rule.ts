import type {
  EslintRules,
  FlatESLintConfigItem,
  ImportRules,
  MergeIntersection,
  NRules,
  ReactHooksRules,
  ReactRules,
  RuleConfig,
  TypeScriptRules,
  UnicornRules,
  VueRules
} from '@antfu/eslint-define-config';
import type { Linter } from 'eslint';
import type { BuiltInParserName, LiteralUnion, RequiredOptions } from 'prettier';

export type PrettierCustomParser = 'astro' | 'svelte' | 'jsdoc-parser' | 'toml';

export interface PrettierOptions extends RequiredOptions {
  parser: LiteralUnion<BuiltInParserName | PrettierCustomParser>;
}

type WrapRuleConfig<T extends { [key: string]: any }> = {
  [K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

export type EslintFlatRules = WrapRuleConfig<
  MergeIntersection<
    EslintRules & ImportRules & NRules & UnicornRules & TypeScriptRules & VueRules & ReactRules & ReactHooksRules
  >
>;

export type FlatConfigItem = Omit<FlatESLintConfigItem<EslintFlatRules, false>, 'plugins'> & {
  plugins: Record<string, any>;
};

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig;
