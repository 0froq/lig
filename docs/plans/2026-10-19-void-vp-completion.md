# Void and Vite+ Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Void the production deployment entry, preserve native branch previews, and adopt Vite+ where it preserves the project's existing checks.

**Architecture:** Void owns the canonical deployment configuration and invokes Nuxt static generation. GitHub Actions provides an opt-in production deploy with concurrency control. Existing Cloudflare Workers Builds continues native branch previews because Void has no equivalent direct-Cloudflare preview lifecycle. Vite+ runs the non-UI tests, while Nuxt and ESLint retain framework-specific responsibilities.

**Tech Stack:** Nuxt 4, Void 1.1.12, Vite+ 1.3.0, pnpm 12, Node 24.21.0, GitHub Actions, Cloudflare Workers Previews.

---

## Task 1: Consolidate deployment configuration

**Files:** `void.config.ts`, `cloudflare.config.ts`, `package.json`, `void.lock.json`.

- Make Void configuration standalone and preserve the deployed domain, routing and visibility.
- Make `deploy` invoke Void, using `inference.build` as the only production build orchestration.
- Keep `preview:deploy` and a preview-only cf configuration derived from Void's canonical values.
- Preserve the user-added `mise.toml` and `into-the-void` dependency.
- Verify production config translation and cf preview build output without publishing.

## Task 2: Prepare safe production automation

**Files:** `.github/workflows/deploy.yml`, `docs/void-viteplus.md`.

- Use Node from `.node-version`, frozen pnpm installation and Void's official direct-Cloudflare deploy path.
- Add least-privilege workflow permissions, a timeout and production concurrency control.
- Gate automatic production deployment on `VOID_DEPLOY_ENABLED` so the new workflow cannot race Workers Builds before cutover.
- Document required Cloudflare credentials, readiness subdomain, verification, and the sequence to disable old production automation without disabling branch previews.
- Do not execute remote configuration changes or publish code as part of local implementation.

## Task 3: Migrate non-UI tests

**Files:** `core/tests/tokens.test.ts`, `syntax/tests/parser.test.ts`, `ports/contracts.test.ts`, `ports/lightweight/contracts.test.ts`, `ports/zed/contracts.test.ts`, `package.json`, `eslint.config.ts`, Vite+ test configuration.

- Keep every assertion and test case, switching only the test registration API to `vite-plus/test`.
- Preserve the ports aggregator's imported suites without running them twice.
- Keep generated-file checks and Python tests.
- Avoid a root `vite.config.ts` that Nuxt ignores. Validate the explicit test config with the installed CLI.
- Run core, syntax and port test commands plus their TypeScript projects.

## Task 4: Evaluate lint, formatting and hooks

**Files:** Vite+ lint/format configuration, `package.json`, `eslint.config.ts`.

- Inspect the installed tool capabilities and run non-mutating probes.
- Adopt Oxlint for compatible source checks without disabling Vue, Nuxt, MDC or existing format rules.
- Only migrate formatting and staged hooks when equivalent configuration can be shown. Do not reformat the entire repository or modify vendored UI rules.
- Document retained tools and their concrete compatibility reasons.

## Task 5: Validate and document

- Run project lint, type checking, all migrated tests and generated-artifact checks.
- Generate the static site and verify output files, headers and 404 policy.
- Validate the workflow and deployment configuration without browser UI tests or production deployment.
- Record remaining external setup. GitHub currently has no deployment secret, and Workers Builds still uses Node 22.
