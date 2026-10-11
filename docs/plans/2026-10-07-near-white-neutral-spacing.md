# Near-white Neutral Spacing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make near-white palette steps easier to distinguish while retaining the current soft canvas and color calibration.

**Architecture:** Author neutral L anchors in `core/spec.json`, keeping C=0/H=null and the middle/dark anchors. Separate light-soft surface roles from palette sampling: canvas stays L=.94 and raised stays .98 through offsets from white. Allow the lab to select the actual `surface.canvas` token when it is not itself a neutral-ramp entry. All ports keep using the same resolved spec.

**Tech Stack:** OKLCH, TypeScript/Vue, pnpm, existing token and port generators.

## Research and interpretation

[OKLab's derivation](https://bottosson.github.io/posts/oklab/#motivation-and-derivation-of-oklab) assumes normal viewing conditions and uses a cube-root response; it does not model arbitrary background adaptation. [Rudd's lightness model and cited psychophysical evidence](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2014.00640/full) describe contextual, spatial and lightness/darkness induction effects. [Radix's scale guidance](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) assigns different steps to surfaces, borders and text rather than requiring equal intervals.

These justify contextual calibration and separating surface roles from the displayed scale. They do not prescribe our exact numeric anchors or prove that symmetry is always wrong. The new anchors are a design trial based on the user's current observation, not a psychophysically validated uniform scale. WCAG and APCA evaluate foreground/background contrast; neither is used as a swatch-distance metric.

## Task 1: Rebalance and guard color data

Change soft_50/.100/.200 L from .98/.94/.88 to .96/.90/.84. White-end adjacent gaps become .04/.06/.06/.06 through soft_300; keep soft_300 and all darker anchors. Preserve light-soft canvas/raised through white offsets −.06/−.02. Reselect dark-soft strongest/inverse ink from soft_200 to soft_100 so primary .78 retains a .12 L separation; otherwise shifting soft_200 to .84 would compress that hierarchy to .06. Update numeric contracts, including minimum exported adjacent L gaps and byte separations in the near-white range; preserve achromatic, unique and monotonic export checks. Verify existing color/foreground contrast policy and unchanged accents.

## Task 2: Preserve the lab's actual background

Modify `app/components/palette/PaletteSyntax.vue` so an unmatched canvas falls back to `surface.canvas`, not white. Add that semantic background option alongside neutral choices; compute preview/contrast from the selected resolved coordinates. No UI tests or browser checks. Document the ramp, changed inherited surface/strong/inverse roles and retained soft surfaces in `core/README.md`.

## Task 3: Synchronize and deliver

Regenerate tokens and native ports. Run data/port contracts, generated checks, standalone types, lint, app types and static generation. Commit/push the existing preview branch, verify deployment and provide the user a comparison of near-white anchors. Manual checks: white/50/100/200 swatch separation, neutral-background choices, independent variant state and unchanged light-soft default background/contrast readouts. No editor-distribution release in this site iteration.
