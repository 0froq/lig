# LiG preview ports — 2026-10-04

Authoring snapshot: `preview-ports-2026-10-04.1` in `0froq/lig`.
Distribution tag: `preview-2026-10-04.1` in `0froq/lig.nvim-preview` and `0froq/vscode-theme-LiG-preview`.

This snapshot contains the current OKLCH core, shared syntax styles and native port compiler. It deliberately excludes the unrelated, unfinished landing-page edits from the local checkout. No stable theme repository or Marketplace listing is updated.

## Reproduce

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm tokens:check
pnpm ports:generate
pnpm ports:typecheck
pnpm ports:test
pnpm ports:check
nvim --headless -u NONE -i NONE -l ports/neovim/verify.lua
```

VSIX packaging uses the official `@vscode/vsce` 4.0.0 CLI with `package --no-dependencies` in `dist/ports/vscode`. The extension is declarative: four theme JSON files, no executable extension entrypoint.

## Local evidence

- Core typecheck and 18 core tests passed; generated tokens match source.
- Port typecheck and 6 data contracts passed; ESLint and diff whitespace checks passed.
- An isolated source checkout reproduced the same 20 artifacts and input hash.
- Neovim 0.12.4 loaded every variant repeatedly; native API colors matched resolved tokens. Terminal slots, transparent surfaces, style overrides, token alias propagation and namespaced entrypoints passed.
- VSIX identity, four theme contributions, 191 Workbench keys per variant, semantic rules and embedded file checksums were inspected from the archive.

Input SHA-256: `677c3003409f405a885b9cad88783ae302a172a76918871b83024a10ddb8e813`.
VSIX SHA-256: `fb2ef1a51201c48751ed8d564d4922ec888ba47acd5c2fb68721d747ed49617b`.

## Manual acceptance and boundaries

No visual or UI test was performed. On the MacBook, compare variables versus keywords, type definitions versus references, function definitions versus calls, comments, selection/search and diagnostics in TypeScript and Python. Try all four variant names and compare VS Code semantic highlighting on/off. Font rendering and actual contrast need human review.

Neovim 0.10+ is the target; this run did not verify the minimum version. Tree-sitter/LSP setup remains in the user's editor configuration. Third-party Neovim plugin groups, lualine/lightline and the old customization API are not migrated in this first preview. Dark and dark-soft currently resolve to identical tokens. Editor parser vocabularies differ, so shared styles do not imply identical token classification.

Small ports such as Ghostty/fzf can later be generated into a shared release/download directory. They do not require independent distribution repositories.
