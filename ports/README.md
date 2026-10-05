# LiG preview compiler

Authoring source for the isolated Neovim and VS Code preview distributions.

```sh
pnpm ports:generate
pnpm ports:typecheck
pnpm ports:test
pnpm ports:check
nvim --headless -u NONE -i NONE -l ports/neovim/verify.lua
```

Generation needs TypeScript/jiti only. It does not need Nuxt preparation, a parser, or either editor. Neovim is only required for the optional native API contract check.

- `core/spec.json` is the color source, with unchanged existing calibration plus shared terminal/UI aliases.
- `styles.ts` and `semantics.ts` define editor-independent intent.
- `neovim/` and `vscode/` bind native vocabularies and serialize data.
- `dist/ports/` contains installable distributions, manifests and checksums.
- `constants.ts` pins the preview package version and immutable source/distribution tags.
- Both preview identities are independent from stable LiG installations.

Neovim includes every implemented plugin module from lig.nvim at `7bb6ca25705baedaae22996eca17c3a8a1745bb2`: sixteen integrations, shared completion kinds and namespaced lualine/lightline entrypoints. `neovim/integrations/coverage.json` records upstream source hashes and exact legacy group names. The TypeScript bindings are now the maintained adapter source; generation does not depend on the legacy checkout. Correct which-key Icon aliases supplement the upstream misspelled lcon names. Plugin selection supports legacy module/plugin identifiers, boolean or `{enabled=...}`, lazy detection and the mini.nvim umbrella.

Mono profile and old `on_colors` compatibility are not included. The namespaced preview API uses `on_tokens` and `on_highlights`. The site still uses the compatible shared core; it has not yet been refactored to consume this compiler's style IR. `core/syntax.ts` remains a capture vocabulary bridge for the existing demo. Capture styles are explicit and never inferred from color equality; `@constructor.lua` maps table braces to neutral punctuation while other constructor captures retain the shared action intent.

Syntax role decisions are shared, but grammar/LSP classifications can differ. Native rendering and manual appearance are not asserted by data checks. The four variants are separate installable identities; current dark/dark-soft values are identical.

Small ports such as Ghostty/fzf should eventually be grouped under the main LiG release artifacts. This compiler currently emits only the two requested editor distributions.

The Workbench bindings are adapted from vscode-theme-LiG (MIT). Native Neovim family/group intent is based on lig.nvim (Apache-2.0). Original distribution licenses are retained under `licenses/`.
