# LiG lightweight ports

Seven small ports, four variants: `light`, `dark`, `light-paper`, `dark-paper`. These files are generated together from `core/spec.json`; no separate repositories or palettes. Substitute the variant you want in the examples below. Commands assume you are in this download directory (`dist/ports/lightweight` after local generation).

Download individual files from the website's **Downloads & ports** section. For the whole set, check out the LiG repository's `codex/lig-core-tokens` branch and run `pnpm install --frozen-lockfile` then `pnpm ports:generate`, or download the `lig-lightweight-ports` artifact from its GitHub Actions run. This preview is not yet on `main`. `manifest.json` contains SHA-256 checksums and compiler/design versions. Native editor preview repositories are released separately.

## Ghostty

Copy the four files from `ghostty/` into `~/.config/ghostty/themes/`, then set:

```ini
theme = lig-dark
```

Or follow system appearance with one family:

```ini
theme = light:lig-light-paper,dark:lig-dark-paper
```

Reload Ghostty's configuration. Explicit `background`, `foreground`, `palette`, `selection-*` or `cursor-*` values in your main config take precedence over a theme; remove conflicting overrides if needed. These themes set colors only: they do not change fonts, keybindings, opacity or window appearance. Your existing `window-theme = dark` setting is separate from color selection.

[Ghostty theme documentation](https://ghostty.org/docs/features/theme)

## fzf

`fzf/lig-dark.fzfrc` contains one `--color` option, with explicit truecolor roles. Add that line **after** the old `--color` lines in your existing options file, or replace just those color lines. Preserve preview commands, dimensions, bindings and layout.

For an isolated trial:

```sh
FZF_DEFAULT_OPTS= FZF_DEFAULT_OPTS_FILE="$PWD/fzf/lig-dark.fzfrc" fzf
```

The local `.fzfrc` is already a full behavior config, so do not replace it wholesale. Explicit CLI color options still take precedence. [fzf options reference](https://github.com/junegunn/fzf/blob/master/man/man1/fzf.1)

## Zellij

Copy `zellij/lig-dark.kdl` to `~/.config/zellij/themes/`, then set this in `config.kdl`:

```kdl
theme "lig-dark"
```

The files use the component-based RGB theme format supported by Zellij 0.43.1: selected/unselected text, ribbons, tables, lists, frames, exit codes and ten multiplayer colors. RGB triples avoid the old theme's mixture of literal HEX and ANSI indices. Zellij does not automatically follow Ghostty's theme selection; choose the same variant explicitly.

[Zellij theme documentation](https://zellij.dev/documentation/themes)

## tmux

Save `tmux/lig-dark.conf` alongside your tmux configuration. Source it after existing color/style settings:

```tmux
source-file ~/.config/tmux/lig-dark.conf
```

The fragment sets style options only. It does not change status formats, keys, plugins or sessions. Your current formats contain inline `#[fg=...,bg=...]` segments; these override the corresponding style option. They continue to use Ghostty's ANSI colors, or you can remove inline color segments to use these explicit role colors. `tmux source-file ~/.config/tmux/tmux.conf` reloads the parent configuration.

[tmux configuration documentation](https://github.com/tmux/tmux/wiki/Getting-Started)

## Starship

`starship/lig-dark.toml` is a **palette fragment**, not a replacement prompt layout. Put its `palette = "lig_dark"` line at the root of your existing file (before the first `[table]`), and append its `[palettes.lig_dark]` table at the end. Switch the root palette name when changing variants.

The palette overrides standard names such as `green`, `red`, `blue`, `purple` and `cyan`, so your existing `[>](green)` / `[x](red)` character symbols keep their layout. It also offers `orange`, `azure`, `fg`, `bg`, `muted`, `strong` and bright color names. Literal HEX styles and unlisted numeric colors are unaffected. Starship has no native config-fragment include; do not concatenate the entire fragment after an existing TOML table or replace the full config.

For an isolated default-layout trial:

```sh
STARSHIP_CONFIG="$PWD/starship/lig-dark.toml" starship prompt
```

[Starship palette documentation](https://starship.rs/config/#prompt)

## bat

Copy the four `bat/LiG-*.tmTheme` files into `$(bat --config-dir)/themes/`, then run:

```sh
bat cache --build
bat --theme=LiG-dark --paging=never path/to/file.ts
```

To enable permanently, change only your existing bat `--theme` option to `--theme="LiG-dark"`. bat uses the filename as its theme name. The themes reuse LiG's shared TextMate scope/style mapping, including variable/keyword distinction. bat's grammars can classify code differently from Neovim or VS Code semantic tokens; matching intent does not promise identical highlighting.

[bat custom-theme documentation](https://github.com/sharkdp/bat#adding-new-themes)

## eza

Copy `eza/lig-dark.yml` to `~/.config/eza/theme.yml`, and keep your shell's config location explicit on macOS:

```sh
export EZA_CONFIG_DIR="$HOME/.config/eza"
```

If `theme.yml` already has filename/icon overrides, merge the color sections instead of replacing it. Existing `LS_COLORS` / `EZA_COLORS` settings can take precedence. These files style file kinds, permissions, git states and metadata, without changing icons or file matching.

[eza theme documentation](https://github.com/eza-community/eza-themes)

## Mapping and validation

Ghostty consumes exactly `terminal.background`, `terminal.foreground`, cursor/selection roles and `terminal.ansi.0–15`. Other tool adapters map role names to shared `surface.*`, `text.*`, `accent.*`, `git.*` and `diagnostic.*` tokens. bat additionally consumes the editor-independent style definitions and shared TextMate selectors. No adapter authors HEX colors.

Black/white remain conventional ANSI slot names; light themes reverse neutral polarity. Bright colors are emphasis tiers. The yellow base is shared `#dbb800`, so light-background yellow text deliberately remains low contrast. Read [the color design note](https://github.com/0froq/lig/blob/codex/lig-core-tokens/content/en/notes/color-design.md) for the tradeoff.

Generation and checksum tests verify data contracts. Native config parsers can verify syntax; neither establishes visual acceptance. On your MacBook, check active/selected rows, small yellow text, tmux inline colors, pane borders and syntax scopes. There is no cross-application live theme switcher in this batch.
