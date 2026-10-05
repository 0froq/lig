# Neovim Plugin Integrations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the preview's existing lig.nvim plugin coverage so the user's full Neovim configuration can be debugged.

**Architecture:** Keep native group bindings in TypeScript, with color references resolved only through core tokens. Plugin definitions are emitted as independent tables selected by the Lua loader. Statusline entrypoints consume the same token palette without loading a colorscheme or modifying editor state. Keep stable repositories and the previous preview tag intact.

**Tech Stack:** Existing TypeScript/jiti compiler, native Lua/Vimscript distribution, node:test data contracts, clean headless Neovim API checks.

## Tasks

1. Inventory all implemented modules in `0froq/lig.nvim` at `7bb6ca25705baedaae22996eca17c3a8a1745bb2`; save source provenance and exact group-name coverage under `ports/neovim/integrations/coverage.json`. Implement blink, dashboard, fzf-lua, gitsigns, ten mini modules, Telescope, which-key, and shared completion kinds. Do not invent implementations for commented-out plugins.
2. Add shared `surface.git.*`, cursorword/diff overlay and statusline tokens to `core/spec.json` using existing OKLab expressions, then run `pnpm tokens:generate`. Preserve accent/neutral calibration.
3. Replace color-to-style reverse lookup in `ports/neovim/bindings.ts` with explicit capture styles. Add `@constructor.lua` as neutral punctuation and regression data for booleans/constants/labels. Preserve shared constructor-call intent for other grammars.
4. Update `ports/neovim/emit.ts`, runtime `init.lua`, and new statusline helper. Support legacy plugin names/module aliases, `{enabled=...}`, lazy auto detection and mini.nvim umbrella. Keep statusline wrappers namespaced and side-effect free.
5. Extend compiler artifacts, generated readmes and manifest coverage. Update compiler/package/tag constants for `0.0.2`, `preview-2026-10-04.2` and source `preview-ports-2026-10-04.2`.
6. Verify source-derived group coverage, valid token references across four variants, completion links, plugin selectors, hooks, statusline palettes and Lua capture classifications. Use data/native API checks only; no UI tests or browser inspections.
7. Copy only authorized source files to the existing isolated snapshot checkout, commit/push branch and new source tag. Publish immutable native distribution tags/releases and package VSIX from the same compiler snapshot. Fresh-download checksums and native loading must pass before delivery.

## Verification commands

```sh
pnpm tokens:generate
pnpm ports:generate
pnpm tokens:typecheck
pnpm tokens:test
pnpm tokens:check
pnpm ports:typecheck
pnpm ports:test
pnpm ports:check
pnpm exec eslint ports core/syntax.ts
nvim --headless -u NONE -i NONE -l ports/neovim/verify.lua
git diff --check
```

Manual acceptance: user should inspect completion kinds/menu, Telescope/fzf, which-key, git signs/staged overlays, mini windows/snippets/statusline/tabline and Lua syntax in the actual MacBook configuration. Native data checks cannot establish visual acceptance.
