# LiG Core Tokens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish one portable, authoritative LiG token spec in this repository.

**Architecture:** A JSON spec owns primitives, semantic references and four variants. A pure TypeScript resolver produces normalized colors; the existing website palette API becomes an adapter. Generated token artifacts are deterministic and checked for drift.

**Tech Stack:** JSON, TypeScript, Node test/assert via existing jiti, pnpm, Nuxt.

---

## Task 1: Core contract

Create `core/tests/tokens.test.ts`, `core/spec.json`, `core/types.ts`, `core/color.ts`, `core/resolve.ts`, `core/index.ts`.

1. Write non-UI regression tests for order independence, valid references, cycle rejection and readable secondary text.
2. Run `pnpm exec jiti core/tests/tokens.test.ts`; confirm failure before implementation.
3. Implement explicit sRGB mixing and recursive reference resolution without mutable context.
4. Preserve existing primitives; define soft backgrounds explicitly and separate text from surface roles.
5. Run the tests; expect all pass.

## Task 2: Website adapter and artifacts

Modify `palette/src/source.ts`, `palette/src/nvim-build.ts`, `palette/src/util.ts`, `palette/src/index.ts`, `palette/scripts/generate.ts`, `package.json`. Remove the unused synthetic two-source conflict comparison. Create `core/scripts/generate.ts` and `core/generated/tokens.json`.

1. Route website palette helpers through core, retaining the current UI API and CSS names.
2. Add `tokens:generate`, `tokens:check` and `tokens:test`; retain `palette:generate` as a command alias.
3. Generate portable core JSON and refresh existing website artifacts with no timestamps.
4. Add adapter/order/export checks and run generation twice; expect byte-identical results.

## Task 3: Documentation and verification

Update `README.md` and create `core/README.md`.

1. Document token names, mix weighting, variants, contrast boundaries and historical provenance.
2. Run `pnpm tokens:test`, `pnpm tokens:check`, `pnpm tokens:typecheck`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
3. Review the diff and report manual website acceptance behaviors without UI tests or browser checks.

Ports, release automation, remote downloads, local theme installation and old port repositories are outside this phase.
