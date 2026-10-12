# Editor Port and Documentation Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update official VS Code and Zed distributions to the current LiG tokens, use those tokens for Markdown highlighting in all four variants, and migrate the host Neovim configuration to the stable plugin.

**Architecture:** Keep core/spec.json as the palette source. Generate the stable VS Code package and Zed repository payload with immutable source provenance, checksums and sync/verify tools. Feed the shared TextMate styles into Nuxt Content's highlighter, selecting the exact four theme variants without adding independent colors. Change managed Neovim configuration in dotfiles; keep the local lockfile outside Git and preserve unrelated plugins and demo edits.

**Tech Stack:** TypeScript/jiti, Nuxt Content/Shiki, Vue, JSON theme distributions, Python verification, native Neovim/lazy.nvim.

---

1. Read native package identity/licensing/workflows and the installed Nuxt Content highlighting API. Inspect local Neovim imports and retired API calls.
2. Generate stable VS Code 0.2.0 under its existing extension identity, with four themes, a repository payload and reproducible metadata. Update Zed installation/provenance documentation for the current patch. Use non-UI adapter/package checks.
3. Register four LiG TextMate themes for Markdown, and select colors/decorations using the existing variant data attribute. Build and inspect generated artifacts; do not write UI tests or use a browser.
4. Publish a source PR and immutable snapshot; update VS Code and Zed in separate PRs and release packages. Refresh the current site preview branch.
5. Back up host Neovim config/lock state. Switch the dotfiles plugin spec to official lig.nvim v0.2.1, remove retired unused API calls, install only that plugin and verify real startup/groups. Keep lockfile/state local; commit/push only the managed configuration.
6. Report published versions, verification limits and manual theme/interaction checks. Do not submit editor-store releases or change VS Code/Zed host preferences as a side effect.
