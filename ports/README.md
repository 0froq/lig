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

This is the first implementation slice. Neovim third-party integrations, mono profile and old `on_colors` compatibility are not included. The namespaced preview API uses `on_tokens` and `on_highlights`. The site still uses the compatible shared core; it has not yet been refactored to consume this compiler's style IR. `core/syntax.ts` remains a capture vocabulary bridge for the existing demo.

Syntax role decisions are shared, but grammar/LSP classifications can differ. Native rendering and manual appearance are not asserted by data checks. The four variants are separate installable identities; current dark/dark-soft values are identical.

Small ports such as Ghostty/fzf should eventually be grouped under the main LiG release artifacts. This compiler currently emits only the two requested editor distributions.

The Workbench bindings are adapted from vscode-theme-LiG (MIT). Native Neovim family/group intent is based on lig.nvim (Apache-2.0). Original distribution licenses are retained under `licenses/`.
