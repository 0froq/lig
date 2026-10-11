# Mono String Muted Correction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make strings use the displayed mono muted tier in all four variants and the official Neovim port.

**Architecture:** Correct the syntax.string alias in core/spec.json; preserve existing gray ramps and secondary UI/operator ink. Regenerate shared artifacts and publish an immutable 0.2.1 native distribution. Audit shared capture colors/decorations, terminal documentation and distribution provenance. Explain existing soft compatibility names and the user's pinned preview without changing local configuration.

**Tech Stack:** JSON tokens, TypeScript compiler, native Lua, Neovim, pnpm.

---

1. Modify core/spec.json and the existing non-visual token contract to map strings to family.mono.muted; bump token/compiler/Neovim patch versions and source snapshot ref.
2. Regenerate core/palette/native artifacts; run token and adapter contracts, artifact drift checks, and existing native API verification.
3. Commit/publish the source patch and official Neovim distribution, then refresh the existing website preview branch with the merged source. Preserve unrelated UI work and local demo/configuration files. List actual rendering checks for manual review; do not write UI tests or use a browser.
