# LiG for Zed

Zed is an editor port: the adapter covers editor chrome, syntax, diagnostics, Git states, player selections and the integrated terminal. It shares the same `core/spec.json` and style intent as Neovim and VS Code. Distribution is local JSON; no extension-store release or separate repository is required.

## Install

Download a single `lig-light.json`, `lig-dark.json`, `lig-light-paper.json` or `lig-dark-paper.json`, or extract `lig-zed-all.zip` for all four.

Copy the JSON files into `~/.config/zed/themes/` on macOS/Linux, or `%USERPROFILE%\AppData\Roaming\Zed\themes\` on Windows. Keep filenames distinct, then reload Zed and use `theme selector: toggle` to choose **LiG Light**, **LiG Dark**, **LiG Light Paper** or **LiG Dark Paper**.

Optional system appearance switching in Zed's existing settings:

```json
{
  "theme": {
    "mode": "system",
    "light": "LiG Light Paper",
    "dark": "LiG Dark Paper"
  }
}
```

Merge only the theme selection after approval; keep other settings. Back up conflicting files first. Remove the added theme files and restore the previous `theme` value to roll back.

## Scope and verification

The adapter emits Zed's [v0.2.0 theme format](https://zed.dev/docs/extensions/themes). Local paths and selection follow [Zed's theme documentation](https://zed.dev/docs/themes#local-themes). It does not install languages, modify capture queries, enable semantic tokens, change fonts/keybindings or configure external tools.

Zed's native capture names are mapped explicitly to LiG's shared roles. Language queries and optional semantic tokens can classify the same code differently from Neovim/VS Code. The theme format cannot express every shared style modifier (for example link underlines); supported foreground, italic and weight intent is preserved. Dim terminal slots reuse the normal ANSI colors; bright slots retain the shared emphasis colors.

Data checks validate token provenance, all 16 ANSI slots, appearance metadata, artifact checksums and ZIP contents. They do not establish native visual acceptance. Manually check all four variants in Zed: editor text and syntax, selections/cursor, completion menus, panels/tabs, diagnostics/Git colors and ANSI output. Zed settings or theme overrides may take precedence.
