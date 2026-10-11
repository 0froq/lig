# LiG OKLCH accent calibration

**Goal:** Replace the inherited RGB accent values with an intentional OKLCH palette for all eight maintained colors.

**Architecture:** Author a shared lightness/chroma target directly in the eight core primitives (L=0.74, C=0.105), with simple hue anchors preserving the color families and widening red/magenta and red/orange separation. Dark mode uses those values. Light mode derives base accents with the existing constant-hue ramp toward primary text (lightness 0.6, chroma 0.8), giving L≈0.519/C=0.084. Highlight/faded depend on mode-specific base accents, so each layer shares L/C across all hues. Existing neutrals and soft canvases remain in scope as stable endpoints.

**Tech Stack:** Existing TypeScript resolver, JSON spec, generated hex exports and Nuxt demo.

1. Audit sRGB chroma limits at candidate lightness levels and exported contrast on all four canvases. Select a common C below every hue's boundary, avoiding silent export clipping. Record the chosen values and provisional visual intent.
2. Edit `core/spec.json`: set the eight accent L/C/H coordinates, add light-mode base ramps, and make highlight/faded depend on `accent.<name>.base`. Do not create another palette source, a new expression type or a new schema.
3. Replace the historical-accent preservation test with calibration checks: uniform authored and per-mode L/C, hue separation and identity, no gamut reduction for base/highlight/faded, tight exported L/C spread, base text contrast ≥4.5:1 on every canvas. Keep historical neutral checks and existing resolver/conversion tests. No UI tests.
4. Document the design targets, mode derivation, exact exported values and measured limits in `core/README.md`. Replace the site decorative accent literals in `app/app.config.ts` with mode-specific core references. Regenerate artifacts; the homepage demo and polar plot already read the resolver and update automatically.
5. Run token/artifact checks, lint, core/application types and production build. No browser/computer-use checks. Manual acceptance: compare TypeScript/Python syntax, hue distinction, four variants, and palette selection on narrow screens. All work stays local; no commit, push or PR update.
