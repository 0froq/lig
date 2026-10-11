# Zed Repository Port Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Distribute Zed as an independent editor theme repository alongside Neovim and VS Code.

**Architecture:** Keep the adapter and color source in LiG. Generate an installable Zed theme extension with a native manifest, four themes, license and reproducible provenance; publish that output to `0froq/zed-theme-LiG` with an initial preview release. Keep existing web JSON downloads compatible and link the editor card to the new repository.

**Tech Stack:** TypeScript/jiti compiler, Zed JSON/TOML, GitHub repositories/releases, existing Vue/Nuxt site.

## Task 1: Native repository distribution

- Add `ports/zed/distribution.ts` for `extension.toml`, `themes/*.json`, README, Apache-2.0 license, build checksums and archive.
- Update `ports/compile.ts` and `.github/workflows/ports.yml` to emit/upload the extension separately from compatible local-theme downloads.
- Update `ports/zed/README.md` with clone/dev-extension installation, direct-file alternative, update/rollback and source provenance.
- Extend `ports/zed/contracts.test.ts` to validate extension structure and parity with web downloads. Run `pnpm ports:generate`, `pnpm ports:typecheck`, `pnpm ports:test`, `pnpm ports:check`.

## Task 2: Website and instructions

- Link Zed's editor card to its independent repository in `PaletteDownloads.vue`; retain per-variant downloads and shared download state.
- Update bilingual notes and agent instruction to recognize the repository extension.
- Run scoped lint, `pnpm typecheck`, `pnpm generate`. No UI tests or browser checks; user manually validates links, downloads and native Zed rendering.

## Task 3: Publish and verify

- Commit/push the LiG source and immutable `zed-port-2026-10-11` source tag.
- Create public `0froq/zed-theme-LiG` from generated extension output, commit/push and publish `v0.1.0` as a prerelease with ZIP and build manifest.
- Fresh-clone the remote and compare every checksum with generated output; inspect release assets and site deployment status.
- Do not install into the user's Zed or submit to the Zed extension store. Execute in this session; no separate worktree or agent needed for the clean existing checkout.
