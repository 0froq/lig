# Muted mono and Zed attribute parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make ordinary HTML/Vue attributes neutral in Zed and separate muted syntax from mono base in all four variants without publishing releases.

**Architecture:** Keep color truth in core/spec.json. Offset mono muted from existing UI subtle ink by +0.04 lightness in light modes and -0.04 in dark modes, preserving UI ink. Map native Zed attribute captures to the property role. Generate and checksum all distributions from the same source; retain machine-local locks/caches and pinned unpublished commits in dotfiles.

**Tech Stack:** TypeScript, OKLCH, pnpm, generated JSON/Lua/TextMate, Python dotfiles setup.

## 1. Shared source and Zed mapping

- Modify core/spec.json mode overrides, ports/zed/emit.ts and provenance constants.
- Update existing core/port data contracts for muted separation and attribute/tag intent. No UI tests.
- Generate tokens and ports; run source typechecks, existing data contracts, deterministic artifact checks and lint.

## 2. Native distributions

- Sync verified compiler payloads to isolated Neovim and VS Code branches and a Zed branch.
- Validate native data and payload checksums, commit/push, and open review PRs. No tags, releases, registry updates or store publishing.

## 3. Dotfiles

- Replace four Zed and bat assets and the verified local VSIX; pin the generated Neovim commit without requiring a release tag.
- Retain four variants and Dark Paper selection; do not change font settings.
- Validate hashes, safe setup behavior and deployed paths; commit/push dotfiles and apply local dependency update.
- Manual acceptance: compare attributes versus tags in the supplied Vue example, compare strings/comments against base text in all four variants, and check normal weight inheritance in Zed.
