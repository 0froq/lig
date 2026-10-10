# Palette Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Narrow the parsed demos, prevent inspector scroll bleed and show neutral tokens vertically; explain the light yellow appearance using current coordinates.

**Architecture:** Keep authored colors and parser behavior unchanged. Separate the inspector heading from its bounded scrolling content. Use a dedicated neutral ramp class to avoid changing accent swatches.

**Tech Stack:** Vue script setup, CSS Grid, TypeScript/OKLCH, Nuxt static generation.

## Task 1: Demo and inspector layout

Modify app/components/palette/PaletteParsedCode.vue and app/assets/css/palette.css. Center the parsed stage within a 72rem maximum and add 16px outer gutters where space permits. Place inspector details in an independently scrollable, focusable region below a fixed heading; provide an opaque background and a local stacking context. Keep existing hover, pin and keyboard navigation.

## Task 2: Vertical neutral palette

Modify app/components/palette/PaletteShowcase.vue and app/assets/css/palette.css. Replace the neutral strip with one token per row, showing a swatch, name, lightness and copy value. Wrap metadata on small screens; preserve click-to-copy and all four variant palettes.

## Task 3: Yellow evaluation

Read core/spec.json and core/color.ts. Calculate the current yellow and candidate hue/lightness coordinates, sRGB mapping and contrast against the actual paper background. Use primary OKLab documentation to distinguish hue from lightness. Do not change canonical colors as part of the layout fix.

## Task 4: Validation and preview

Run pnpm lint, pnpm typecheck and pnpm generate; inspect the diff. No UI tests or browser/computer-use checks. Commit and push the existing preview branch; verify Cloudflare completion and HTTP availability. User manual checks: narrower demos, inspector scrolling without bleed, hover/pin/keyboard interactions, vertical swatches and copying on narrow screens.

## Yellow evaluation

Calculated with core/color.ts against light-paper canvas #f4f2ec. None of these candidates needs chroma reduction for sRGB.

| L    | C    | H   | Hex     | WCAG contrast | APCA Lc |
| ---- | ---- | --- | ------- | ------------- | ------- |
| 0.55 | 0.11 | 100 | #81720e | 4.32:1        | +66     |
| 0.55 | 0.11 | 95  | #86700a | 4.33:1        | +66     |
| 0.55 | 0.11 | 90  | #8a6e08 | 4.35:1        | +66     |
| 0.62 | 0.11 | 95  | #9b852b | 3.24:1        | +56     |
| 0.65 | 0.12 | 95  | #a68e27 | 2.88:1        | +52     |

Inference: low lightness is the main constraint on the current yellow appearance; shifting H alone produces a warmer but still dark ochre. A brighter yellow requires a role-specific lightness exception, with reduced text contrast. Keep the canonical token unchanged in this layout patch. The proposed 0.65/0.12/95 candidate should be evaluated as a swatch before changing text/search/ANSI uses.

Reference: [Björn Ottosson's OKLab definition](https://bottosson.github.io/posts/oklab/#the-oklab-color-space) separates perceived lightness from chroma and hue. Appearance judgments here are inferred from the supplied screenshot and calculated coordinates, not browser verification.
