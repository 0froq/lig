# LiG preview 0.0.2 — plugin coverage

Source tag: `preview-ports-2026-10-04.2` in `0froq/lig`.
Distribution tag: `preview-2026-10-04.2` in the two preview repositories.

## Changes

All sixteen implemented plugin adapters from lig.nvim main at `7bb6ca25705baedaae22996eca17c3a8a1745bb2` are migrated to maintained TypeScript bindings. Upstream source hashes and all 185 original group names are recorded in `ports/neovim/integrations/coverage.json`. The port emits 194 plugin groups (including nine corrected WhichKeyIcon aliases), 34 shared completion kind links and namespaced lualine/lightline themes. Generation does not require the original repository or plugins.

Plugin selection supports lazy detection, mini.nvim umbrella, module names/full plugin names, boolean and enabled tables. Git/cursorword/diff overlays are shared core OKLab mix tokens. Existing palette calibration is unchanged. Lualine's unavailable legacy palette names and Lightline's missing Lua palette module are replaced by the shared mode tokens.

Captures now select styles explicitly. Booleans/constants/labels retain their color without inheriting link underlines. `@constructor.lua` paints table braces as neutral punctuation; constructor calls in other grammars retain action.

## Evidence

- Core and port typechecks, 18 core tests and 8 port data contracts pass.
- All upstream implemented plugin group names are covered; token/link references validate in every variant.
- Neovim 0.12.4 native API checks pass for all plugin foreground/background/special colors and decorations in all four variants, selected/disabled plugin transitions, lazy auto detection, mini umbrella and hooks.
- Actual native Lua parser/query data confirms table braces, boolean and function-call captures. No UI was rendered or tested.
- Four lualine and four lightline variants export valid palettes; reading them leaves the active colorscheme/background/highlights intact.
- VSIX identity/version, four contributions and every embedded file checksum match this source snapshot.
- ESLint and diff whitespace checks pass. Visual acceptance remains manual.

Input SHA-256: `8886a35874a44bb060b34926d21e7088314f9946a415951bee5f79c96995492b`.
VSIX SHA-256: `6420678a2d115cf8a59beb26706142498f5d74e33cfa855c3e14174a57e4f3f5`.

## MacBook update

Change lazy.nvim's preview tag to `preview-2026-10-04.2`, update that plugin and restart Neovim. Lualine theme should be `lig-preview` (or a fixed variant); Lightline uses `lig_preview` (or underscore variant names), so neither loads stable LiG's old entrypoint.

Manual checks: blink completion kinds, Telescope/fzf, which-key descriptions/icons, staged and inline git overlays, mini files/clue/cursorword/diff/jump/snippets/statusline/tabline. In Lua, true/false should have no link underline and table braces should be neutral. Review colors in both light and dark.

Target minimum Neovim 0.10 remains unverified; the native checks use 0.12.4. Mono and legacy on_colors compatibility remain outside this preview. Dark-soft still shares dark's token values.
