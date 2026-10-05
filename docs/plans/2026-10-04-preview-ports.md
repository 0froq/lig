# LiG Preview Ports Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate and publish two isolated preview distribution repositories that can be installed on the user's MacBook.

**Architecture:** Keep the current dirty LiG checkout as the authoring source. Add a small TypeScript compiler with shared styles and separate native bindings. Publish a reproducible source snapshot on a dedicated LiG branch, and publish only generated native distributions to two new preview repositories.

**Tech Stack:** Existing OKLCH core, TypeScript, jiti, pnpm, JSON, a small native Lua loader, VSIX packaging.

The user authorized two new preview repositories. Do not alter the existing editor repositories, publish to extension marketplaces, or add UI tests. Preserve the existing site work. The executing-plans handoff is superseded by the user's request to implement in this session.

## Task 1: Shared contracts

- Add `ports/types.ts`, `ports/styles.ts`, shared UI/terminal token references.
- Extend `core/spec.json` only with missing UI/terminal aliases and recipes.
- Keep existing design calibration unchanged.

## Task 2: Native adapters

- Add Neovim base/capture/LSP bindings, Lua emitter and namespaced runtime.
- Add VS Code Workbench/TextMate/semantic bindings and JSON emitter.
- Both use shared style IDs and exact exported HEX values.

## Task 3: Build and verification

- Add deterministic compiler, input hashes, manifests and `--check`.
- Check types, token/style contracts, native serialization and package contents.
- Headless Neovim verifies API data/loader contracts only, without UI inspection.

## Task 4: Remote source and distributions

- Publish the compiler/core snapshot to a dedicated branch in `0froq/lig` using an isolated checkout; exclude unrelated site edits.
- Create `0froq/lig.nvim-preview` and `0froq/vscode-theme-LiG-preview` from generated distributions.
- Package VSIX, publish immutable preview tags/assets and installation instructions.

## Task 5: Delivery

- Verify remote refs and artifact checksums via fresh downloads/clones.
- Provide exact MacBook installation commands and manual behaviors to compare.
