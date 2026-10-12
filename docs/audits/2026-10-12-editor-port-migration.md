# Editor port migration — 2026-10-12

This follow-up resolves the four remaining distribution/host/highlighting gaps in the earlier display audit.

- VS Code: migrate the original `froQ.theme-lig` identity to canonical generation, version 0.2.0. Contribute Light, Dark, Light Paper and Dark Paper; remove the old duplicate palette compiler and Soft theme files. Old Soft settings require selecting the corresponding Paper theme. The separate preview extension is not an alias for this extension.
- Zed: update the independent native repository to 0.1.1, from the same generated files served by the site. Generate install version and source ref in README instead of retaining the first-release snapshot.
- Both repositories: payload checksums, a guarded import script and native data checks run in CI. GitHub releases are separate from editor stores. Packaging VS Code no longer automatically publishes to stores.
- Markdown: Nuxt Content receives the exact four TextMate themes emitted to VS Code, including muted string/comment inks. The active variant selects foreground and font decorations together. The documentation currently has no fenced blocks; parser artifact checks exercise a synthetic code fence without adding product content or UI tests.
- Host Neovim: managed spec pins `0froq/lig.nvim` v0.2.1 and uses `require('lig')` / `colorscheme lig`. Remove the unused retired `lig.colors` call from Incline. Only the old/new LiG entries change in the local untracked lockfile; other plugin pins remain intact. Backup of the previous host files is under `~/.local/state/dots/migrations/lig-stable-20261012-124027`.

Source snapshot: `editor-ports-2026-10-12`; design 0.2.14, compiler 0.6.0. The published Neovim v0.2.1 keeps its earlier immutable provenance; its resolved colors match the current core. A compiler metadata change alone does not require republishing Neovim.

Verification covers generated data/checksums, package contents, types, static generation and native Neovim APIs. It does not prove native editor visuals. Manual acceptance: select all four themes in VS Code/Zed; check strings/comments, UI/diagnostics, semantic highlighting on/off and terminal colors; check Neovim's file-window label; check Markdown variant switching when adding a fenced block. Existing editor customizations can override themes.
