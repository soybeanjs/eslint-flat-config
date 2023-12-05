# SoybeanJS's ESLint flat config presets

- Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Add support ReactNative, SolidJS, Svelte, Astro.

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
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "editor.formatOnSave": false,
  "eslint.experimental.useFlatConfig": true,
  "eslint.validate": [ // add file types to be validated
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "svelte",
    "astro",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "css",
    "html",
    "toml",
    "markdown"
  ],
  "prettier.enable": false
}
```
