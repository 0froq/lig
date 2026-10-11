# Neovim Stable Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the current canonical LiG Neovim distribution to 0froq/lig.nvim.

**Architecture:** core/spec.json remains the color source. The maintained compiler emits the stable lig Lua namespace, colorschemes, statuslines and provenance; the official repository contains those native artifacts, not a second palette implementation. VS Code preview identity remains unchanged.

**Tech Stack:** TypeScript compiler, native Lua, Neovim, pnpm, GitHub Actions.

---

## Task 1: Stable compiler identity

Modify ports/compile.ts, ports/constants.ts, ports/readme.ts and ports/neovim/runtime/lua/lig/. Rename the runtime namespace from lig_preview to lig. Emit four standard/paper variants and compatibility entrypoints for retired soft names. Preserve background switching and provide explicit migration guidance for removed options. Save a versioned immutable source ref.

## Task 2: Official repository payload

Use an isolated worktree for lig.nvim, preserving local demo edits. Replace obsolete Lua palettes, generated extras, docs/build tooling and old CI with compiler output and native artifact verification. Preserve license and repository history. Document installation, hooks, plugin coverage, source regeneration and breaking changes.

## Task 3: Verification and publication

Run ports:typecheck, ports:generate, ports:test, ports:check and the existing non-visual Neovim API verification. Verify official payload checksums and load every entrypoint using isolated Neovim startup. Do not write UI tests or run browser/computer-use UI checks. Push source, tag its immutable snapshot, publish official main without force, verify remote state and CI. List manual rendering checks in the final report. Do not change the user's Neovim configuration.
