# OKLCH core and longer code demos

**Goal:** Author LiG in OKLCH, derive predictable color layers, and show two substantial code examples on the homepage.

**Architecture:** Schema 2 stores L/C/H primitives. Resolution retains floating-point OKLCH values, uses OKLab for generic mixes and constant-hue L/C ramps for accents, and maps to sRGB only at export. Existing website adapters continue consuming hex.

**Tech Stack:** TypeScript, JSON, Vue 3 / Nuxt, existing pnpm scripts.

1. Implement pure conversions, OKLab mixing and deterministic constant-L/H chroma reduction for sRGB export in `core/color.ts`. Verify reference colors, round trips, neutral mixing, invalid inputs and gamut behavior with non-UI tests.
2. Migrate `core/spec.json`, types and resolver to schema 2. Preserve base colors and soft canvases; recalibrate accent highlight/faded layers. Keep generated hex alongside resolved OKLCH coordinates. Update the website primitive adapter and regenerate all artifacts.
3. Replace the homepage's short placeholder in `PaletteStage.vue` with longer TypeScript and Python examples. Bind every syntax class to its core semantic role; let long lines scroll within the editor on narrow screens.
4. Update the core contract documentation. Run core tests, artifact checks, lint, core/application type checks and a production build. No UI tests or browser checks; manual acceptance covers four variants, code legibility, narrow-screen overflow and pen animation placement. All changes remain local, without commits, pushes or PR updates.
5. Add `PaletteOklch.vue` to the homepage source section: a hue/chroma polar plot of every authored base accent, including azure and the additional orange, with L/C/H coordinates and accessible selection through table buttons. Use core coordinates and mapped hex; keep the reference hue ring explicitly separate from lightness and gamut boundaries. Verify with lint/types/build only; manual acceptance covers hover/focus/selection and narrow-screen layout.
