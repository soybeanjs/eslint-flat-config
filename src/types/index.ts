import type { JsdocOptions } from 'prettier-plugin-jsdoc';

export type Awaitable<T> = T | Promise<T>;

export interface PrettierRules {
  /**
   * Specify the line length that the printer will wrap on.
   *
   * @default 80
   */
  printWidth: number;
  /** Specify the number of spaces per indentation-level. */
  tabWidth: number;
  /** Indent lines with tabs instead of spaces */
  useTabs?: boolean;
  /** Print semicolons at the ends of statements. */
  semi: boolean;
  /** Use single quotes instead of double quotes. */
  singleQuote: boolean;
  /**
   * Change when properties in objects are quoted.
   *
   * @default 'as-needed'
   */
  quoteProps: 'as-needed' | 'consistent' | 'preserve';
  /** Use single quotes in JSX. */
  jsxSingleQuote: boolean;
  /** Print trailing commas wherever possible. */
  trailingComma: 'none' | 'es5' | 'all';
  /** Print spaces between brackets in object literals. */
  bracketSpacing: boolean;
  /**
   * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   */
  bracketSameLine: boolean;
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   *
   * @deprecated Use bracketSameLine instead
   */
  jsxBracketSameLine: boolean;
  /**
   * Include parentheses around a sole arrow function parameter.
   *
   * @default 'always'
   */
  arrowParens: 'avoid' | 'always';
  /** Format only a segment of a file. */
  rangeStart: number;
  /**
   * Format only a segment of a file.
   *
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number;
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer. In some
   * cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   *
   * @default 'preserve'
   */
  proseWrap: 'always' | 'never' | 'preserve';
  /**
   * How to handle whitespaces in HTML.
   *
   * @default 'css'
   */
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   *
   * @default false
   */
  vueIndentScriptAndStyle: boolean;
  /**
   * Which end of line characters to apply.
   *
   * @default 'lf'
   */
  endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
  /**
   * Control whether Prettier formats quoted code embedded in the file.
   *
   * @default 'auto'
   */
  embeddedLanguageFormatting: 'off' | 'auto';
  /**
   * Enforce single attribute per line in HTML, Vue and JSX.
   *
   * @default false
   */
  singleAttributePerLine: boolean;
}

export type PrettierParser =
  | 'acorn'
  | 'angular'
  | 'babel-flow'
  | 'babel-ts'
  | 'babel'
  | 'css'
  | 'espree'
  | 'flow'
  | 'glimmer'
  | 'graphql'
  | 'html'
  | 'json-stringify'
  | 'json'
  | 'json5'
  | 'less'
  | 'lwc'
  | 'markdown'
  | 'mdx'
  | 'meriyah'
  | 'scss'
  | 'typescript'
  | 'vue'
  | 'yaml';

export interface PrettierLanguageRules extends PrettierRules, Partial<JsdocOptions> {
  parser?: PrettierParser;
  plugins?: string[];
}

export interface Option {
  cwd: string;
  prettier: {
    /**
     * Default prettier rules
     *
     * @default
     * ```json
     * {
     *   "printWidth": 120,
     *   "singleQuote": true,
     *   "trailingComma": "none",
     *   "arrowParens": "avoid",
     *   "htmlWhitespaceSensitivity": "ignore"
     * }
     * ```
     */
    rules?: Partial<PrettierLanguageRules>;
    /**
     * Whether to use prettierrc
     *
     * If true, the rules in prettierrc will override the default rules
     *
     * @default true
     */
    usePrettierrc?: boolean;
  };
  /**
   * @default
   * {
   *  "html": true,
   *  "css": true,
   *  "json": true,
   * }
   */
  formatter: {
    html?: boolean;
    css?: boolean;
    json?: boolean;
    markdown?: boolean;
    yaml?: boolean;
    // toml?: boolean;
  };
}
