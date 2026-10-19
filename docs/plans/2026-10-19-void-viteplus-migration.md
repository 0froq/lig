# Void and Vite+ Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adopt compatible VoidZero tooling without changing LiG's static rendering, URLs, editor ports, or lint rules.

**Architecture:** Keep Nuxt generating `dist` and deploy it as a static Workers asset site. Evaluate Void's direct Cloudflare deployment and Vite+'s core alias and task runner independently. Keep the existing `cf` production path until replacement routing and preview behavior are verified.

**Tech Stack:** Nuxt 4, pnpm 12 catalogs, Cloudflare Workers, Void 1.1.12, Vite+ 1.3.0.

---

## Task 1: Archive the current workspace

- Inspect tracked and untracked files for unrelated changes and secrets.
- Commit each purpose separately, retaining the existing Git identity.
- Push to `origin/main` and compare its remote SHA. Completed at `1dcb041`.
- Preserve this checkpoint without rewriting history.

## Task 2: Verify deployment compatibility

**Files:** `package.json`, `pnpm-workspace.yaml`, `cloudflare.config.ts`, `wrangler.config.ts`, `nuxt.config.ts`, `.gitignore`.

- Read Void's app-types, config and CLI references and inspect the installed CLI.
- Verify Node requirements using mise. Void 1.1.12 requires Node >=24.21.0.
- Use an explicit static app type and `dist` directory, never the auto-detected Nuxt SSR adapter.
- Preserve the Worker name, compatibility date, trailing-slash policy, 404 behavior, observability, `_headers`, and production/preview separation.
- Only replace `cf` when the replacement can be validated without changing production resources. Document blockers rather than silently dropping existing features.

## Task 3: Adopt compatible Vite+ tooling

**Files:** `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.gitignore`, `.github/workflows/tokens.yml`, `.github/workflows/ports.yml`.

- Review migration help and rules before using any migration command.
- Preserve the pnpm catalog layout, dependency trust policy, existing cssnano override, vendored UI and hooks.
- Keep ESLint, Vue type checking, Nuxt commands, node-based tests and Python checks.
- Evaluate the aligned Vite+ core alias with Nuxt. Do not add a root Vite config that Nuxt ignores.
- Use `vp run` for existing scripts. Check lifecycle generation hooks explicitly.
- Validate clean installation and generated output before changing CI commands.

## Task 4: Validate and document the result

**Files:** `docs/void-viteplus.md`.

- Run the existing token, syntax and port checks through the adopted runner.
- Run Nuxt type checking and static generation using the required Node version.
- Run deployment dry-run if the selected CLI supports it. Otherwise report the limitation and keep production deployment untouched.
- Verify generated homepage, localized pages, nested HTML, 404, headers, sitemap and downloadable ports without browser UI tests.
- Document exact local commands, Workers Builds changes, retained tools, blockers, and rollback checkpoint.

## Sources

- https://void.cloud/guide/app-types
- https://void.cloud/reference/config
- https://void.cloud/integrations/frameworks/nuxt
- https://viteplus.dev/guide/migrate-rules
- https://viteplus.dev/guide/run
