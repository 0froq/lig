# Global Theme Switch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Use one four-theme selection for the floating header, all palette displays and the global light/dark appearance; compact neutral and accent swatches.

**Architecture:** Keep useLigVariant as shared state and derived token data. Initialize and persist it once at the app root, synchronizing useTheme and the URL. Use the same validated preference before paint to avoid conflicting initial appearances. Replace the header's section tracking with a scroll-only floating theme control; retain the footer toggle through the shared variant.

**Tech Stack:** Vue script setup, Nuxt composables/router, TypeScript, CSS, static generation.

## Task 1: Centralize preference synchronization

Modify app/composables/useLigVariant.ts, app/composables/useTheme.ts and app/app.vue; add app/composables/useLigTheme.ts. Query variant takes precedence over stored variant, then the existing site light/dark preference. Synchronize storage, URL and global appearance after initialization; preserve paper treatment when the footer changes tone. Initialize useTheme only once per app.

Add shared/theme-preference.ts and update nuxt.config.ts so the pre-paint script uses the supported variants from core. Handle blocked storage independently of a valid query. Preserve old soft bookmark migration.

Wrap the router's existing scroll behavior at the app root: a variant query change with the same path/hash preserves the current or saved position, while all other navigation delegates to Nuxt's behavior. Restore the original callback on unmount.

## Task 2: Replace the header control

Add app/components/palette/PaletteThemeSwitch.vue using VARIANT_OPTIONS and radioKey. Modify SiteHeader.vue to use it both in the header and after scrolling, without usePageSections. Modify kit.css for the floating theme control and narrow-screen wrapping. Remove the redundant inline variant control from PaletteSyntax.vue. Remove the parser statistics from PaletteParsedCode.vue.

## Task 3: Compact palette displays

Modify palette.css. Reduce neutral row/fill height from 44/40px to 28/24px and row gaps from 6px to 3px; limit swatch width. Reduce accent fill height from 28px to 20px and internal spacing from 8px to 4px; use four columns on tablet and two on phones. Leave token coordinates and copy formats unchanged.

## Task 4: Validation and preview

Check preference selection with a temporary Node VM script using minimal storage/media/dataset stubs; this is data/initialization validation, not a UI test. Run lint, app typecheck and static generation; review the diff and generated artifact markers. No browser or computer-use checks. Commit/push the existing preview branch and verify CI, deployment and HTTP availability. Manual checks: four themes, every palette/code/inspector update, site light/dark mode, refresh/query/storage, footer preserving paper, arrow-key selection, compact swatches and copying.
