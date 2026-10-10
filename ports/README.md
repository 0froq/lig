# LiG preview compiler

Authoring source for the isolated Neovim/VS Code preview distributions and the shared lightweight tool ports.

```sh
pnpm ports:generate
pnpm ports:typecheck
pnpm ports:test
pnpm ports:check
nvim --headless -u NONE -i NONE -l ports/neovim/verify.lua
python3 ports/lightweight/verify.py
```

Generation needs TypeScript/jiti only. It does not need Nuxt preparation, a parser, or either editor. The optional native checks require Neovim or Python 3.11+ and the seven lightweight tools, respectively; lightweight validation uses isolated temporary configuration and servers.

- `core/spec.json` is the color source, with unchanged existing calibration plus shared terminal/UI aliases.
- `styles.ts` and `semantics.ts` define editor-independent intent.
- `neovim/` and `vscode/` bind native vocabularies and serialize data.
- `dist/ports/` contains installable distributions, manifests and checksums.
- `constants.ts` pins the preview package version and immutable source/distribution tags.
- Both preview identities are independent from stable LiG installations.

Neovim includes every implemented plugin module from lig.nvim at `7bb6ca25705baedaae22996eca17c3a8a1745bb2`: sixteen integrations, shared completion kinds and namespaced lualine/lightline entrypoints. `neovim/integrations/coverage.json` records upstream source hashes and exact legacy group names. The TypeScript bindings are now the maintained adapter source; generation does not depend on the legacy checkout. Correct which-key Icon aliases supplement the upstream misspelled lcon names. Plugin selection supports legacy module/plugin identifiers, boolean or `{enabled=...}`, lazy detection and the mini.nvim umbrella.

Mono profile and old `on_colors` compatibility are not included. The namespaced preview API uses `on_tokens` and `on_highlights`. The site still uses the compatible shared core; it has not yet been refactored to consume this compiler's style IR. `core/syntax.ts` remains a capture vocabulary bridge for the existing demo. Capture styles are explicit and never inferred from color equality; `@constructor.lua` maps table braces to neutral punctuation while other constructor captures retain the shared action intent.

Syntax role decisions are shared, but grammar/LSP classifications can differ. Native rendering and manual appearance are not asserted by data checks. The four supported variants are light, dark, light-paper and dark-paper. Paper changes surfaces and mono inks while retaining its standard mode’s chromatic token coordinates. Retired soft variants are no longer emitted. Generation prunes obsolete files owned by the previous output manifest, retaining unmanaged files.

Ghostty, fzf, Zellij, tmux, Starship, bat and eza ship together under `dist/ports/lightweight`, without separate repositories. `lightweight/` contains format adapters and installation notes; `catalog.ts` shares download paths with the site. bat reuses the existing TextMate bindings and style intent. All four variants are generated; no adapter maintains literal palette colors.

The standard compiler also copies identical lightweight bytes to ignored `public/ports/`; Nuxt build/generate runs it first. `ports:check` verifies both outputs, while a custom `--out` build stays isolated. CI uploads `lig-lightweight-ports` as a downloadable artifact. Lightweight provenance names the current source branch and exact input hash; historical native preview tags are not republished automatically.

The Workbench bindings are adapted from vscode-theme-LiG (MIT). Native Neovim family/group intent is based on lig.nvim (Apache-2.0). Original distribution licenses are retained under `licenses/`.
