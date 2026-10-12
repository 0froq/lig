# Zed capture parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align available Zed captures with Neovim semantic intent without changing language extensions, palette, fonts or releases.

**Architecture:** Audit pinned upstream queries for JS/TS/TSX, Vue/HTML, Python, Rust, Lua, JSON and Markdown. Keep native capture translation in the Zed adapter and color/style truth in shared roles. Record query inventories and semantic examples for data contracts; document information lost before themes receive captures.

**Tech Stack:** TypeScript, Tree-sitter query evidence, JSON fixtures, pnpm, Python distribution verification.

## 1. Capture audit and adapter

- Add `ports/zed/fixtures/capture-parity.json` with pinned query sources, SHA-256 and native captures.
- Extend `ports/zed/emit.ts` for Python decorators/keyword arguments, Lua parameters, builtin functions, keyword operators, Rust lifetimes and text fallbacks.
- Add cross-editor semantic data checks in `ports/zed/contracts.test.ts`; compare generated foreground and font intent for all variants using Neovim capture roles.
- Run the data checks before and after the adapter change, then port typecheck and deterministic generation checks. Do not test editor UI.

## 2. Documentation and delivery

- Document audited scope, fallback behavior, query ambiguities and manual examples in `ports/zed/README.md`.
- Increment compiler metadata to 0.7.3, regenerate the verified Zed distribution and update the existing source/Zed review PRs.
- Sync only the four Zed JSON files and their provenance to dotfiles; verify hashes, inherited weight and deployed links, then push dotfiles. Keep other editor artifacts and versions unchanged.
- No tag, release, registry update or publishing. Manual acceptance: Vue/JSX tags and attributes, Python decorators/keyword arguments, Lua parameters, Rust lifetimes, JSON keys/strings and Markdown prose/emphasis in all four variants.
