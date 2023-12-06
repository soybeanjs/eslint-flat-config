# SoybeanJS's ESLint flat config presets

- Default config Lint JavaScript and TypeScript.
- Support Vue, React, ReactNative, SolidJS, Svelte and Astro on demand.
- Use Prettier to format JSON, JSONC, YAML, CSS, HTML, TOML, Markdown and so on.

## Usage

### Install

```bash
pnpm i -D eslint typescript @soybeanjs/eslint-config
```

### ESLint config file

create config file "eslint.config.js"

### ESLint settings in VSCode

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  },
  "editor.formatOnSave": false,
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [
    // add the languages you want to lint here
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "svelte",
    "astro",
    "html",
    "css",
    "json",
    "jsonc",
    "yaml"
    "toml",
    "markdown"
  ],
  "prettier.enable": false
}
```
