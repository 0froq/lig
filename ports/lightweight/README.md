# Lightweight ports

Seven tools, four variants: `light`, `dark`, `light-paper`, `dark-paper`.
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

Ghostty uses `terminal.background`, `terminal.foreground`, cursor, selection, and `terminal.ansi.0–15`.
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
