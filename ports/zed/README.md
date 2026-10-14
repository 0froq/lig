# LiG for Zed

Same palette as [LiG](https://github.com/0froq/lig).
Four variants: **LiG Light**, **LiG Dark**, **LiG Light Paper**, **LiG Dark Paper**.
This repository is generated.
It is not yet in the Zed extension store.

## Install

Pin a release:

```sh
git clone --branch v{{VERSION}} https://github.com/0froq/zed-theme-LiG.git
```

In Zed, run `zed: install dev extension` and select the directory that contains `extension.toml`.
Then `theme selector: toggle`.
The package is a theme only.
It does not include a language server.

Or download `lig-zed-extension.zip` from [releases](https://github.com/0froq/zed-theme-LiG/releases), extract it, and select that directory.
Install one copy.

[Developing extensions](https://zed.dev/docs/extensions/developing-extensions)

### Local files

Use the JSON files in `themes/`, or download one variant from the LiG site.
`lig-zed-all.zip` on the site is the four local theme files, not the extension.

Copy them to `~/.config/zed/themes/` on macOS and Linux, or `%USERPROFILE%\AppData\Roaming\Zed\themes\` on Windows.
Reload Zed and pick a theme.
Do not install the extension and the local files under the same names.

To follow the system appearance, merge this into the existing settings:

```json
{
  "theme": {
    "mode": "system",
    "light": "LiG Light Paper",
    "dark": "LiG Dark Paper"
  }
}
```

Back up the previous `theme` value first.

### Update

For the dev extension, check out the new tag and reload it.
To roll back, check out the previous tag and reload.
To uninstall, remove the extension in Zed and restore the previous theme setting.
For local files, replace or delete only LiG's JSON.

## Source

Do not edit the generated themes here.
Change [the LiG snapshot](https://github.com/0froq/lig/tree/{{SOURCE_REF}}), then run `pnpm ports:generate`.
`dist/ports/zed-extension/` is this repository.
Import it with:

```sh
python3 scripts/sync.py /path/to/lig/dist/ports/zed-extension
python3 scripts/verify.py
```

`lig-build.json` records the source ref, versions, and a SHA-256 for each file.
Installing the theme does not download tokens and does not need Node.js.

## Scope

The theme uses Zed's [theme format](https://zed.dev/docs/extensions/themes).
It does not install languages, rewrite queries, turn on semantic tokens, or change fonts and keys.

Zed capture names are mapped to LiG's shared roles.
A language query can still classify the same code differently from Neovim.
Link underlines are not in the theme format.
Foreground, italic, and weight are.
Ordinary syntax inherits `buffer_font_weight`.
Only `title` and `emphasis.strong` set weight 700.
Dim terminal slots reuse the normal ANSI colors.
Bright slots keep the shared emphasis colors.

`attribute` is neutral, so HTML and Vue attribute names stay gray while tags stay green.
Some languages also use `attribute` for annotations.
Those captures share the same neutral fallback.

| Zed capture                               | Intent                    |
| ----------------------------------------- | ------------------------- |
| `attribute`, `attribute.jsx`              | Gray template property    |
| `function.decorator`, `attribute.builtin` | Green annotation          |
| `function.kwargs`, Lua `parameter`        | Green parameter           |
| `function.builtin`, `function.special`    | Builtin function or macro |
| `function.method.constructor`             | Constructor               |
| `keyword.operator`                        | Neutral operator          |
| `keyword.operator.regex`                  | Escape / reference        |
| Rust `lifetime`                           | Green annotation          |
| `tag.jsx`                                 | JSX tag                   |
| `text`, `none`                            | Ordinary prose            |

A theme cannot recover every query distinction:

- JS and TS reuse `function` for both definitions and calls. The generic fallback is call ink.
- `keyword.control` mixes control flow, return, async, and exceptions. Bare keywords stay neutral.
- Rust annotations and HTML attributes can share `attribute`. A specific Python decorator can still be green.
- Lua table braces and constructor names can share `constructor`.
- Injected languages and semantic tokens can override the same span.

Compare a Vue or TSX template, a Python decorator, a Lua parameter, a Rust lifetime, JSON, and Markdown with Neovim.
Report the capture name and the language-extension version if a color still looks wrong.

Data checks do not prove the theme looks right in Zed.
Look at text, selections, completion, panels, diagnostics, Git colors, and the terminal.

## Store

The extension id is `lig-theme`.
A stable GitHub release can sync the registry after the first reviewed registration.
Follow [PUBLISHING.md](https://github.com/0froq/zed-theme-LiG/blob/main/PUBLISHING.md).
A green build is not a store update.

## License

MIT.
See `LICENSE`.
