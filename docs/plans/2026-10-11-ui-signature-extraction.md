# Paper signature extraction implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reuse LiG's ink washes, handwriting, pen route and native node select through @froq/ui without regressing mobile scroll stability.

**Architecture:** Move drawing and glyph logic to core/signature and lifetime management to vue/usePaperSignature. LiG supplies DOM anchors, its existing color mixer, theme colors and visibility classes; the library has no project selectors or Nuxt dependencies. Extend the existing Select rather than creating another control.

**Tech Stack:** TypeScript, Vue 3, Nuxt, Canvas 2D, WebGL2, pnpm, git subtree.

## 1. Close previous work

Merge PR #3 preserving subtree history, then work on codex/ui-paper-signature. Do not mutate the separate UI checkout or resume its paused release goal.

## 2. Extract drawing behavior

- Move app/kit drawing files into vendor/ui/src/core/signature, expose createInkWash, createPenStroke and signatureEllipse from core/index.ts.
- Replace project selectors with caller-supplied anchor elements, project color import with an injected mixColors function, document classes with lifecycle state returned by usePaperSignature.
- Keep shaders, glyph coordinates, geometry, speeds, delays, viewport slicing and progress restoration unchanged.
- Replace app/composables/useSignature.ts with a thin adapter. Remove old engine files once imports are migrated, including choice/Circle.vue.
- Document APIs, page-level canvas ownership, six-digit HEX colors, static settings, reduced-motion/fallback and cleanup behavior alongside Paper.md/Paper.zh.md; add a reusable demo.

## 3. Reuse Select and constrain panels

- Extend vendor/ui/src/components/select/Select.vue with a shared inset chevron and optional framed presentation. Document and demonstrate it.
- Replace PaletteParsedCode.vue native markup with Select; keep tree data, translation and pinning in LiG.
- Set .lig-parsed-stage max-width to 60rem; keep shrinkable tracks, local overflow and stable viewport heights.

## 4. Verify without UI automation

Run library ESLint, vue-tsc, token contract, LiG lint/typecheck and static generation. Compare the migrated mobile viewport byte-for-byte and inspect the route rebuild/progress logic against commit 0d4c264. Inspect generated artifacts for both examples and all four variants. No UI tests or browser/computer-use checks.

Manual acceptance: rapid mobile scrolling in both directions, browser toolbar expansion/collapse, rotation/real layout resize, theme changes during/after writing, bloom arrival, reduced motion and missing WebGL/2D fallback, route cleanup, native Select keyboard/touch navigation and code horizontal scrolling.

## 5. Publish focused work

Commit extraction and required consumer changes together; commit unrelated width adjustment separately. Push LiG branch, create focused PR and attach it. Push vendor/ui to UI main with git subtree push, without tags or force. Verify upstream tree equality and clean local state.

## Verification results

- PR #3 merged as a73d1a7 before extraction began.
- Library `pnpm check` passed: source/docs lint, source/docs typecheck, twelve-token contract.
- LiG lint and typecheck passed; static generation produced 26 routes.
- UI docs static generation produced 284 routes. The handwriting demo uses its internal glyph module directly; importing the core barrel from that demo caused a shared-module prerender resolution failure, and the direct import resolves it without changing docs architecture.
- Source comparison: canvas-viewport.ts, pen-geometry.ts, hand-font.ts and settle.ts are byte-identical to the original files. Pen rebuild/progress restoration and the content-size-only ResizeObserver block are byte-identical.
- Keep fallback classes synchronous: the pen's onReady hook activates the host's hand layout before the first geometry measurement.
- Generated LiG HTML contains the shared inset Select arrow and all four theme choices; generated CSS contains the 60rem panel bound. The old select wrapper is absent.
- Package tarball includes the signature source, composable, select styles and complete handwriting attribution/OFL notice.
- No UI tests or browser/computer-use checks were performed. Mobile/runtime/manual acceptance remains the checklist above.
