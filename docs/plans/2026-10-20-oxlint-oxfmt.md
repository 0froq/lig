# Oxlint and Oxfmt Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the application's ESLint checks and formatting with Vite+'s bundled Oxlint and Oxfmt.

**Architecture:** Keep Nuxt's application configuration independent of Vite+ test configuration. Oxlint and Oxfmt use native root configurations with explicit CLI paths so ignores apply from the project root. Keep vendored UI, generated output and MDC content outside the migration.

**Tech Stack:** Vite+ 1.3.0, Oxlint 1.88.0, Oxfmt 0.73.0, Nuxt 4, pnpm 12.

---

## Task 1: Replace configuration and dependencies

**Files:** `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `nuxt.config.ts`, `eslint.config.ts`, `tooling/vite.config.ts`, `.oxlintrc.json`, `.oxfmtrc.json`, `.vscode/settings.json`.

- Remove the Nuxt ESLint module, application ESLint configuration and direct lint dependencies.
- Enable Oxlint's supported Vue rules, preserving TypeScript and Vue type checks.
- Configure Oxfmt with single quotes, no semicolons and one Vue attribute per line.
- Exclude vendored UI, generated artifacts and MDC content without pretending old ESLint rules have one-to-one replacements.
- Update staged checks to invoke Oxlint and Oxfmt. Retain the existing hook mechanism because `vp staged` requires a root Vite config.

## Task 2: Establish and verify the formatter baseline

- Format maintained application source with Oxfmt.
- Inspect the diff for changes beyond formatting. Do not format or modify the vendored library, generated palettes or MDC.
- Run the formatter a second time in check mode to verify idempotence.
- Regenerate port artifacts whose provenance hashes include formatted compiler sources.

## Task 3: Update workflows and project guidance

**Files:** `.github/workflows/deploy.yml`, `AGENTS.md`, `docs/void-viteplus.md`.

- Add Oxfmt verification to the existing check commands.
- Document that formatting now follows Oxfmt, and record removed ESLint-only rule coverage.
- Leave production deployment and external CI credentials unchanged.

## Task 4: Validate

- Run `vp run lint`, `vp run fmt:check`, `vp run test` and `vp run typecheck`.
- Run token, syntax and port generated-file checks plus Python distribution tests.
- Build the static site with `WORKERS_CI=1` and validate the preview adapter without publishing.
- Check the workflow with actionlint and review ignored-path changes.
