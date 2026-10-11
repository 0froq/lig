# Download Feedback and Palette Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add shared per-file download feedback, simplify page copy, reshape semantic tiers and show the LiG icon beside the hero title.

**Architecture:** Keep Nuxt download state in the application, separate from its link renderer. The renderer exposes state to slots so a future UI condition component can consume it. Keep palette colors and brand SVGs derived from the existing core.

**Tech Stack:** Nuxt `useState`, Vue Composition API, Fetch/Blob downloads, CSS polygons.

---

## Task 1: Download state and renderer

- Create `app/composables/useDownloads.ts`: URL-keyed `idle → pending → started | error`; reject duplicate pending requests, permit retries and explicit reset.
- Create `app/components/DownloadLink.vue`: preserve native href/download fallback, handle ordinary activation, render arrow/progress/check/retry and accessible status. Expose `status` in default/icon slots.
- Wire all 41 Downloads links, including archives and manifest, in `PaletteDownloads.vue`.
- State persists through theme switches and client navigation, resets on reload, and records each file separately. A ZIP does not mark individual files as downloaded.
- `started` means the response was acquired and a browser download was triggered; no claim about saving to disk. Modified clicks and browser context-menu downloads retain native behavior and do not update application state.

## Task 2: Page refinement

- Remove the generated-token file list and unused styles/localized copy.
- Replace syntax swatch rows with `PaletteTierRamp.vue`: left highlight triangle, base parallelogram, right muted triangle. The three pieces tile a complete rectangle; each retains clipboard activation and keyboard focus feedback.
- Remove the hierarchy sentence, retaining spacing before code examples.
- Add the existing variant-specific LiG SVG before the hero wordmark; retain pen-line anchor elements and responsive typography.

## Task 3: Verification and preview

- Run ESLint, `pnpm typecheck`, `pnpm generate`, diff checks and inspect generated HTML/artifacts.
- Do not write UI tests or use browser/computer-use UI checks.
- Manually verify download transitions, retry, repeated activation, independent file/ZIP state, theme changes, keyboard activation and native modified clicks; palette copy/focus/shape seams; hero placement at narrow widths and all variants.
- Commit/push the current preview branch and await Pages deployment.
