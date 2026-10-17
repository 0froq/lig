# Lightweight ports

Eight tools, four variants: `light`, `dark`, `light-paper`, `dark-paper`.
All of them are generated from [`core/spec.json`](../../core/spec.json).
There is no second palette and no separate repository.

The examples below use `dark`.
Swap the variant name for the one you want.
Commands assume this download directory
(`dist/ports/lightweight` after a local generate).

Download one variant from the site, or the ZIP of all four.
To rebuild them, check out [LiG](https://github.com/0froq/lig) and run `pnpm ports:generate`.
`manifest.json` records the source ref, versions, and SHA-256 checksums.
Editor ports live in [lig.nvim](https://github.com/0froq/lig.nvim), [vscode-theme-LiG](https://github.com/0froq/vscode-theme-LiG), and [zed-theme-LiG](https://github.com/0froq/zed-theme-LiG).

## Ghostty

Copy `ghostty/` into `~/.config/ghostty/themes/`, then:

```ini
theme = lig-dark
```

Or follow the system appearance:

```ini
theme = light:lig-light-paper,dark:lig-dark-paper
```

Reload Ghostty.
These files set colors only.
Fonts, keys, opacity, and window appearance stay yours.
An explicit `background`, `foreground`, `palette`, `selection-*`, or `cursor-*` in the main config wins over the theme.

[Ghostty themes](https://ghostty.org/docs/features/theme)

## Hatoba

**Source-build integration only.** The Hatoba checkout reviewed at
[`fa38f4f9a9ac3ca91e5b2cfb60ea975126004157`](https://github.com/scarletkc/Hatoba/tree/fa38f4f9a9ac3ca91e5b2cfb60ea975126004157)
has built-in schemes, not a theme-file importer or a user theme directory.
Copying JSON into Hatoba's config directory does not install a scheme.

`hatoba/lig-dark.json` is one JSON object matching `TermScheme` in
[`apps/desktop/src/features/terminal/schemes.ts`](https://github.com/scarletkc/Hatoba/blob/fa38f4f9a9ac3ca91e5b2cfb60ea975126004157/apps/desktop/src/features/terminal/schemes.ts).
It contains `id`, `name`, `mode`, `contrast`, and `colors`.
`colors` uses xterm's camelCase keys: `background`, `foreground`, `cursor`,
`cursorAccent`, `selectionBackground`, the eight ANSI names, and `brightBlack`
through `brightWhite`. All 16 ANSI slots keep LiG's shared terminal mapping.

To use it in your own writable Hatoba checkout:

1. Download the variants you want (or `hatoba/lig-hatoba-all.zip`).
2. Open `apps/desktop/src/features/terminal/schemes.ts` and paste each complete
   JSON object as an entry inside `SCHEMES: readonly TermScheme[]`, adding a comma
   between entries. JSON object syntax is valid TypeScript here. Do not replace
   the array or the default Hatoba entries.
3. Follow Hatoba's [development guide](https://github.com/scarletkc/Hatoba/blob/main/docs/development.md)
   for the Rust/Tauri prerequisites, then run `pnpm install` and `pnpm typecheck`
   from that checkout. For an unsigned local build on Windows/Linux, use
   `pnpm tauri build --no-sign`. On macOS, keep the ad-hoc signature and use
   `pnpm tauri build --config '{"bundle":{"createUpdaterArtifacts":false}}'`
   instead, as Hatoba's README describes. Install and launch that build.
4. In **Settings → Appearance → Terminal Colors**, pick **LiG Dark** (or
   **LiG Dark Paper**) for dark and **LiG Light** (or **LiG Light Paper**) for light.
   Choose **Match Appearance** to follow the app, or force light/dark terminal mode.

Hatoba saves only the selected IDs in `terminal.dark_scheme` and
`terminal.light_scheme`. Unknown IDs fall back to the mode's default, so all
synced devices need a build containing these entries. There is no vault or
settings-file edit to perform. This port changes terminal colors, not the app UI,
fonts, cursor shape, or key bindings.

`contrast` is xterm's `minimumContrastRatio`: 1 for dark, 3 for light, matching
Hatoba's third-party scheme convention. xterm may adjust rendered light ANSI text
for readability; the exported colors remain exactly LiG's tokens.
Hatoba derives search highlights from the palette when `search` is omitted.
`cursorAccent` uses the terminal background for text inside the block cursor.

### Upstream contributions

Hatoba maintains the built-in palettes in `SCHEMES`, not in a `themes/` directory
or an external theme registry. Adding entries upstream is how a scheme becomes
available in official builds; a local source build is the alternative today.
There is no documented theme-specific submission process or promise of acceptance.
Follow Hatoba's [CONTRIBUTING.md](https://github.com/scarletkc/Hatoba/blob/main/CONTRIBUTING.md):
agree on an issue with a maintainer before a nontrivial change, keep one PR to one
issue, use Conventional Branch/Commit names, and leave the app version unchanged.
Docs must be English and contributions are MIT licensed. UI-changing PRs require
light/dark screenshots with sample data and visual review, in addition to checks.
This LiG port does not submit or modify Hatoba upstream.

### Validation

Optional read-only source check, run from the LiG repository after generation:

```sh
pnpm exec jiti ports/lightweight/verify-hatoba.ts /path/to/Hatoba
```

This checks the generated keys against Hatoba's source declarations and runs its
actual registry lookup and search-highlight helpers without starting the UI.
For manual acceptance in your Hatoba build, switch among the four schemes,
check the 16 ANSI slots, selection and block cursor, try terminal search, and
check both forced modes and **Match Appearance** after changing app appearance.

## fzf

`fzf/lig-dark.fzfrc` is one `--color` line.
Put it after the old `--color` lines, or replace those lines.
Keep preview commands, size, bindings, and layout.

```sh
FZF_DEFAULT_OPTS= FZF_DEFAULT_OPTS_FILE="$PWD/fzf/lig-dark.fzfrc" fzf
```

Do not replace an existing `.fzfrc` with this file.
A later `--color` on the command line still wins.

[fzf options](https://github.com/junegunn/fzf/blob/master/man/man1/fzf.1)

## Zellij

Copy `zellij/lig-dark.kdl` to `~/.config/zellij/themes/`, then in `config.kdl`:

```kdl
theme "lig-dark"
```

The file is the RGB theme format from Zellij 0.43.1.
Zellij does not follow Ghostty's theme.
Pick the same variant yourself.

[Zellij themes](https://zellij.dev/documentation/themes)

## tmux

Source the fragment after your other color settings:

```tmux
source-file ~/.config/tmux/lig-dark.conf
```

It sets style options only.
It does not change status formats, keys, plugins, or sessions.
Inline `#[fg=...,bg=...]` segments still override the matching style option.
Reload with `tmux source-file ~/.config/tmux/tmux.conf`.

[tmux](https://github.com/tmux/tmux/wiki/Getting-Started)

## Starship

`starship/lig-dark.toml` is a palette fragment, not a prompt layout.
Put `palette = "lig_dark"` at the root of your file, before the first table.
Append `[palettes.lig_dark]` at the end.

Existing `[>](green)` and `[x](red)` symbols keep their layout.
The palette also defines `orange`, `azure`, `fg`, `bg`, `muted`, `strong`, and the bright names.
Literal hex styles are left alone.
Do not paste the whole fragment after an existing table, and do not replace the whole config.

```sh
STARSHIP_CONFIG="$PWD/starship/lig-dark.toml" starship prompt
```

[Starship palettes](https://starship.rs/config/#prompt)

## bat

Copy `bat/LiG-*.tmTheme` into `$(bat --config-dir)/themes/`, then:

```sh
bat cache --build
bat --theme=LiG-dark --paging=never path/to/file.ts
```

To keep it, set `--theme="LiG-dark"`.
bat uses the filename as the theme name.
The scopes follow LiG's TextMate mapping.
bat's grammars can still classify a file differently from Neovim.

[bat themes](https://github.com/sharkdp/bat#adding-new-themes)

## eza

Copy `eza/lig-dark.yml` to `~/.config/eza/theme.yml`.

```sh
export EZA_CONFIG_DIR="$HOME/.config/eza"
```

If `theme.yml` already has filename or icon overrides, merge the color sections.
`LS_COLORS` and `EZA_COLORS` can still take over.
Icons and file matching are unchanged.

[eza themes](https://github.com/eza-community/eza-themes)

## Colors

Ghostty and Hatoba use `terminal.background`, `terminal.foreground`, cursor, selection, and `terminal.ansi.0–15`.
The other tools map shared `surface`, `text`, `accent`, `git`, and `diagnostic` tokens.
bat also uses the shared TextMate styles.
No file in this directory authors a hex by hand.

ANSI 0 and 7 keep the names black and white.
Light themes reverse the neutral polarity.
Bright slots are emphasis, not a promise of a larger RGB value.
Yellow base is `#dbb800`, so yellow text on a light background stays low contrast.
See [the color note](https://github.com/0froq/lig/blob/main/content/en/notes/color-design.md).

Checksums check the files.
They do not check how a tool looks.
Look at the active row, small yellow text, tmux colors, pane borders, and syntax in the tool you use.

## License

MIT.
See `LICENSE` in this directory.
Each tool ZIP includes the same file.
