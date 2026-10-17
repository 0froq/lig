# Port compiler

This directory builds the Neovim, VS Code, and Zed distributions,
and the shared lightweight ports.
Colors come from [`core/spec.json`](../core/spec.json).
No adapter keeps its own palette.

```bash
pnpm ports:generate
pnpm ports:typecheck
pnpm ports:test
pnpm ports:check
```

Generation needs TypeScript only.
It does not need Nuxt, a parser, or an installed editor.

Optional native checks:

```bash
nvim --headless -u NONE -i NONE -l ports/neovim/verify.lua
python3 ports/lightweight/verify.py
pnpm exec jiti ports/lightweight/verify-hatoba.ts /path/to/Hatoba
```

The Neovim check needs Neovim.
The lightweight check needs Python 3.11+ and the seven native CLI tools.
It uses a temporary config.
It does not edit the machine's real config.
The separate Hatoba check reads a source checkout without modifying it or starting the app.

## Layout

| Path                        | Role                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `styles.ts`, `semantics.ts` | Editor-independent intent                                                                         |
| `neovim/`                   | Lua colorscheme for [lig.nvim](https://github.com/0froq/lig.nvim)                                 |
| `vscode/`                   | JSON theme for [vscode-theme-LiG](https://github.com/0froq/vscode-theme-LiG), id `froQ.theme-lig` |
| `zed/`                      | Extension for [zed-theme-LiG](https://github.com/0froq/zed-theme-LiG)                             |
| `lightweight/`              | Ghostty, Hatoba, fzf, Zellij, tmux, Starship, bat, eza                                            |
| `dist/ports/`               | Generated payloads and checksums. Not committed                                                   |

`constants.ts` and `zed/distribution.ts` pin package versions and the source ref.
GitHub Releases and the editor stores are published separately.
A merged commit is not a store update.

Neovim keeps the sixteen integrations from lig.nvim at `7bb6ca25705baedaae22996eca17c3a8a1745bb2`.
`neovim/integrations/coverage.json` records the upstream hashes and group names.
The TypeScript bindings are the maintained source.

`on_tokens` replaces `on_colors`.
The old hook fails with a migration error.
Soft colorscheme names redirect to the paper variants.

Paper changes surfaces and mono inks.
It keeps the standard mode's chromatic coordinates.
The four variants are `light`, `dark`, `light-paper`, and `dark-paper`.

Capture styles are explicit.
They are not inferred from two tokens happening to share a hex.
`@constructor.lua` uses neutral punctuation.
Other constructor captures stay action.

## Output

`pnpm ports:generate` writes `dist/ports/`.
The same lightweight and Zed download bytes are copied to `public/ports/`, which is gitignored.
`pnpm build` and `pnpm generate` run the compiler first.
`ports:check` compares both trees and does not write.
A custom `--out` directory stays isolated.

Hatoba's four `TermScheme` JSON objects and `lig-hatoba-all.zip` ship with the
lightweight distributions, manifests, and website downloads via `catalog.ts`.
Hatoba currently has no runtime custom-theme loader; these are source-registry
entries, not config files. See [the installation steps](lightweight/README.md#hatoba).

CI uploads `lig-lightweight-ports` (including Hatoba) and `lig-zed-port`.
Generating files does not publish a release.
A docs-only compiler change can change the input hash without changing theme colors.

## License

Generated Neovim, Zed, VS Code, and lightweight packages copy the repository [MIT license](../LICENSE).
The VS Code package also keeps the Primer and Anthony Fu lines in [`licenses/MIT-vscode.txt`](licenses/MIT-vscode.txt).
[`licenses/Apache-2.0.txt`](licenses/Apache-2.0.txt) is the earlier lig.nvim notice.
It is not copied into new packages.
