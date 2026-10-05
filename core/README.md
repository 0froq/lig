# LiG core

`spec.json` is the authored source of truth. Ports consume this spec or `generated/tokens.json`; they do not maintain another palette or set of mix formulas. `palette/src` is the compatibility adapter for the website.

## Color contract

- `schemaVersion: 2`, token `version: 0.2.0`, `colorSpace: oklch`.
- Eight accents and thirteen neutrals are authored only in `palette`, as `{ l, c, h }` coordinates.
- L is perceptual lightness in [0, 1], C is nonnegative chroma, H is degrees in [0, 360). Achromatic colors use `c: 0, h: null`.
- Eight accent primitives are calibrated to a shared OKLCH lightness/chroma target with deliberate hue anchors. Thirteen neutral primitives are designed on the achromatic OKLCH axis, with deliberate L steps rather than inherited RGB values.
- Resolution retains floating-point coordinates throughout the dependency graph. Quantization to lowercase 8-bit `#rrggbb` happens only at export.

For example, the calibrated green is authored as:

```json
{ "l": 0.74, "c": 0.120, "h": 148 }
```

`tokens` supplies shared semantic references and derived colors. `modes.light` / `modes.dark` supply mode-specific roles. The four `variants` select a mode and optional overrides. Dependencies always use the selected variant's final values, including overrides. Unknown references, cycles, invalid coordinates, weights, ramp parameters, schemas and overrides fail explicitly.

## Calibrated accents

The eight colors are intended to have similar weight within each mode. Their design coordinates share L/C; H distinguishes the families. Hues are refined individually, including the additional orange and azure. The circular gaps are 38°, 40°, 48°, 46°, 40°, 41°, 50° and 57°: reasonably distributed without forcing all eight named families onto equal 45° steps.

| Mode               | Base L | Base C | Derivation from authored accents |
| ------------------ | ------ | ------ | -------------------------------- |
| dark / dark-soft   | 0.740  | 0.120  | Authored primitives              |
| light / light-soft | 0.550  | 0.110  | Offset L −.19, C −.010           |

All modes keep H. The authored `palette.accents` is the reference/dark palette; consumers must use `variants[variant].tokens` or `.oklch` for mode-specific colors. Soft variants retain the standard mode's base accent coordinates; they soften surface/strong-ink contrast and adjust tier spacing independently.

| Color   | H    | Dark hex  | Light hex |
| ------- | ---- | --------- | --------- |
| red     | 22°  | `#ed8b88` | `#a85554` |
| orange  | 60°  | `#e29858` | `#a06024` |
| yellow  | 100° | `#bdac4a` | `#81720e` |
| green   | 148° | `#73c07f` | `#3f834b` |
| cyan    | 194° | `#26c2c1` | `#008282` |
| azure   | 234° | `#51b7eb` | `#137ba8` |
| blue    | 275° | `#95a4f6` | `#5f6bb1` |
| magenta | 325° | `#d190d4` | `#915a95` |

The eight dark base accents retain their authored C=.120 in sRGB. All three chromatic syntax-family bases (green/blue/orange) retain C=.110 in both light variants. Some other accents and tier endpoints require chroma reduction at constant L/H: standard dark blue highlight (.100 → .0955), both light variants' yellow/azure highlights and all cyan tiers. Dark-soft's slightly narrower tiers are entirely in sRGB. Cyan base exports at C≈.0940 in both light variants. The spec coordinates remain the authored targets, not the mapped output coordinates. Raising the target C further does not increase colors already at the sRGB boundary.

Standard base/highlight accents and all dark faded tiers have ≥4.5:1 canvas contrast. Light faded tiers intentionally have lower contrast to preserve a lightness gradient: approximately 3.45–3.85:1 in light. Light-soft keeps the same base color identity on a gray canvas: base contrast is 3.86–4.30:1 / APCA +59.9–63.3 Lc, highlight 4.78–5.35:1 and faded 3.15–3.50:1 / +52.7–56.7 Lc. These are deliberate visual calibration choices, not WCAG AA guarantees for light-soft colored text or a font-size-independent APCA recommendation. Higher chroma increases colorfulness; it does not imply increased lightness or contrast. Eight-bit rounding gives each variant's colors small L/C differences; tests bound export error from gamut-mapped coordinates in Cartesian OKLab to <0.002 for accent tiers.

This is a numerically calibrated starting design. Hue distinction and visual weight in real code still require manual assessment. The homepage's TypeScript/Python demos and polar plot consume these resolved coordinates. The demos use actual Neovim Tree-sitter trees and highlight captures; see [the parsing pipeline](../syntax/README.md). Capture-to-role mappings live in `core/syntax.ts`, separately from primitive colors. Every syntax role refers to an explicit `family.mono`, `family.struct`, `family.ref` or `family.action` tier in the spec. The site's decorative green also reads `accent.primary` from core for the site's light/dark mode, separately from the demo variant selector.

## Neutral lightness ramp

All neutrals have C=0 and H=null. The middle ramp uses mostly uniform OKLCH steps, while the white and black ends use deliberately different intervals. This trial keeps near-white surfaces light and lifts the darkest levels to improve their separation in exported sRGB. Display black level, ambient light and adaptation still affect their appearance; numeric intervals alone do not establish visual uniformity. Absolute white/black remain endpoints. The numeric names identify existing tokens, not percentages of RGB brightness.

| Neutral  | L    | Exported hex |
| -------- | ---- | ------------ |
| white    | 1.00 | `#ffffff`    |
| soft_50  | 0.98 | `#f8f8f8`    |
| soft_100 | 0.94 | `#ebebeb`    |
| soft_200 | 0.88 | `#d7d7d7`    |
| soft_300 | 0.78 | `#b7b7b7`    |
| soft_400 | 0.68 | `#989898`    |
| soft_500 | 0.58 | `#7a7a7a`    |
| soft_600 | 0.48 | `#5d5d5d`    |
| soft_700 | 0.38 | `#424242`    |
| soft_800 | 0.30 | `#2e2e2e`    |
| soft_900 | 0.21 | `#181818`    |
| soft_950 | 0.14 | `#090909`    |
| black    | 0.00 | `#000000`    |

The homepage labels these authored L values. Exported hex is quantized: near black, one 8-bit sRGB step covers a larger L interval, so the coordinates remain the source of truth rather than the rounded hex. The ramp is intentionally calibrated against the exported display colors, not forced into a symmetric numeric scale.

## Derived colors

A token may be a reference, an OKLab mix, a constant-hue OKLCH ramp, or a fixed OKLCH offset.

```json
{
  "mix": ["surface.canvas", "text.primary"],
  "weight": 0.9
}
```

This is 90% of the first color and 10% of the second, interpolated in Cartesian OKLab. Neutral endpoints stay neutral. It replaces the old encoded-sRGB mix; the black/white midpoint changes from `#808080` to `#636363`. The hex `blend()` compatibility helper follows the same OKLab rule, including the website's pen fades.

```json
{
  "ramp": "accent.green.base",
  "toward": "surface.canvas",
  "lightness": 0.35,
  "chroma": 0.55
}
```

A ramp retains source H, moves L 35% toward the target's L, and multiplies source C by 0.55. The target's hue/chroma does not enter the calculation. A zero-chroma result has `h: null`.

The accent tiers use fixed offsets instead of interpolation toward differently spaced foreground/background endpoints:

```json
{
  "offset": "accent.green.base",
  "lightness": 0.07,
  "chroma": -0.02
}
```

An offset adds the signed L/C deltas and retains source H. Non-finite deltas or invalid result coordinates fail rather than silently clamp; zero chroma clears H.

| Variant    | Highlight ΔL / ΔC | Faded ΔL / ΔC | Distance from base |
| ---------- | ----------------- | ------------- | ------------------ |
| dark       | +.070 / −.020     | −.070 / −.020 | .07280             |
| dark-soft  | +.060 / −.020     | −.060 / −.020 | .06325             |
| light      | −.070 / 0         | +.070 / 0     | .07000             |
| light-soft | −.050 / 0         | +.050 / 0     | .05000             |

Both sides start from the selected variant's base, retain H and have equal Cartesian OKLab distances from it. Light tiers retain base C: darker highlight, base and lighter faded. The design L triplets are .48/.55/.62 for light, .50/.55/.60 for light-soft, .81/.74/.67 for dark and .80/.74/.68 for dark-soft. Equal numerical distance is a calibration constraint, not a guarantee of identical subjective prominence. Tests also bound asymmetry after sRGB mapping and 8-bit export. The website displays equal-width swatches and reports actual WCAG/APCA contrast for manual assessment.

## Soft variant intent

Soft reduces luminance extremes while retaining hue/color identity and the shared semantic mapping. It is not a desaturated preset. Earlier dark-soft resolved identically to dark; earlier light-soft darkened accents to L=.49 despite its lighter canvas. Both behaviors are replaced by explicit surface, neutral-ink and tier calibrations.

| Variant    | Canvas L / hex  | Raised L / hex  | Mono highlight/base/muted selections |
| ---------- | --------------- | --------------- | ------------------------------------ |
| light      | 1 / `#ffffff`   | .98 / `#f8f8f8` | soft_800 / soft_600 / soft_400       |
| light-soft | .94 / `#ebebeb` | .98 / `#f8f8f8` | soft_700 / soft_600 / soft_500       |
| dark       | .21 / `#181818` | .30 / `#2e2e2e` | soft_50 / soft_300 / soft_500        |
| dark-soft  | .30 / `#2e2e2e` | .34 / `#383838` | soft_200 / soft_300 / soft_500       |

Light-soft lifts the darkest neutral ink from L=.30 to .38 and brings muted comments from .68 to .58 so they remain visible on the grayer canvas. Its raised panels are deliberately lighter than the canvas. Dark-soft lifts the canvas, caps strongest ink at .88 instead of .98 and uses a smaller .04 L surface gap; its raised color is the OKLab midpoint of soft_800/soft_700. Border/dim use soft_700 so they do not disappear into the new canvas. Inverse roles follow the softened strongest-ink/canvas pair.

Strong-ink canvas contrast falls from 13.58 to 8.43:1 in light-soft and from 16.72 to 9.44:1 in dark-soft. Primary/secondary neutral ink remains ≥4.5:1 on both soft canvases; primary also meets that bound on raised panels. Soft/base accents remain identical to their standard mode, and syntax/ANSI/diagnostic references continue to consume the selected variant. These numerical checks do not establish visual acceptance or contrast for every possible surface/foreground pair. User assessment should compare gray keyword/variable/comment hierarchy, color identity and panel separation at actual editing sizes.

## sRGB export and gamut

The conversion matrices follow [Björn Ottosson's public-domain OKLab reference](https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab). Polar OKLCH and interpolation are described in [CSS Color 4](https://www.w3.org/TR/css-color-4/#ok-lab).

Every hex export uses one deterministic mapping policy: colors already in sRGB pass through; out-of-gamut colors reduce C at constant L/H to the strict sRGB boundary using 32 binary-search iterations (linear-channel tolerance 1e-7). L=0/1 exports black/white. Final channel clipping only absorbs numerical tolerance before 8-bit rounding. This is a conservative chroma-reduction policy, not the CSS local-MINDE algorithm; native browser mapping can produce different output for out-of-gamut colors.

The generated bundle includes:

- Hex `palette` primitives for existing consumers.
- Four `{ mode, tokens, oklch }` variants. `tokens` contains mapped hex values; `oklch` contains design coordinates before gamut mapping and quantization.
- Schema, token version and authored color-space metadata.

Use the spec for formulas and dependencies. A future port can use the OKLCH coordinates for another target gamut, while existing terminal/editor ports can continue consuming hex. Port generation, downloads and publishing remain a later phase.

## Semantic roles

`surface.*`, `text.*`, `border.*` and `shadow.*` define interface roles. Accent families feed `syntax.*`, `git.*`, `diagnostic.*`, `message.*` and `mode.*`; application-specific bindings belong in ports.

Foreground roles form a deliberate L hierarchy:

| Role           | Light L / hex   | Dark L / hex    |
| -------------- | --------------- | --------------- |
| text.strong    | .30 / `#2e2e2e` | .98 / `#f8f8f8` |
| text.primary   | .48 / `#5d5d5d` | .78 / `#b7b7b7` |
| text.secondary | .52 / `#696969` | .68 / `#989898` |
| text.subtle    | .68 / `#989898` | .58 / `#7a7a7a` |

Mono highlight/base/muted select the existing neutral ramp independently for all four variants, as listed above. Standard light gaps are .18/.20 and standard dark gaps .20/.20; light-soft uses .10/.10 and dark-soft .10/.20. Secondary ink remains between base and muted: primary +.04 L in light modes, `soft_400` in dark modes. Strong, primary and secondary retain at least 4.5:1 contrast on their default canvases. Muted ink intentionally trades some contrast for hierarchy: standard light is 2.88:1 / APCA +55 Lc; light-soft is 3.60:1 / +58 Lc; dark-soft is 3.16:1 / −27 Lc. Muted ink is not a normal-text readability guarantee, especially for small or thin text. WCAG/APCA readings remain visible rather than forcing every tier to meet a threshold. Website L/C controls affect chromatic families only, preserving the selected mono ramp steps.

The larger light-mode span is a visual calibration choice, not a theoretical requirement. [OKLab's derivation](https://bottosson.github.io/posts/oklab/#motivation-and-derivation-of-oklab) assumes normal viewing conditions without explicitly modelling background adaptation. [APCA](https://github.com/Myndex/SAPC-APCA/blob/master/documentation/README.md) evaluates text/background polarity and relates contrast to typography, while [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) assigns scale steps by intended use. These support independent role calibration on each background rather than mirrored indices. Radix's text contrast targets are not a claim that this experimental muted tier meets them.

The four syntax families describe visual roles, not a complete taxonomy of language constructs:

- `mono`: ordinary reading—variables use highlight, while general keywords and member properties use base, following lig.nvim's Tree-sitter mapping. Comments/punctuation use muted, strings/operators use secondary. Parameters and builtin variables retain their struct/ref roles.
- `struct`: bindings and structural context—parameters, modules, tags and modifiers.
- `ref`: types and values—type references use muted, constants/numbers use base, type definitions/builtins/escapes use highlight.
- `action`: execution—function/method definitions use highlight in dark modes and base in light modes, avoiding the brown cast of the darker orange highlight. Calls, constructors and coroutine/return/exception keywords use base. Light-mode definitions and calls intentionally share the same color; this iteration does not add a new typographic distinction.

This preserves the family approach from lig.nvim. A declaration is not automatically `struct`: type definitions remain `ref`. The website legend shows each family once, with highlight/base/muted levels. All three chromatic families use the shared accent tier formulas, including `ref.muted`; there is no special blue-only muting formula. Default syntax foregrounds have at least 4.5:1 canvas contrast except mono muted roles, chromatic muted roles in light modes and chromatic base roles in light-soft. These follow the explicit contrast calibration described above. Experimental L/C/background settings have no minimum-contrast guarantee.

Borders are independently assigned `soft_200` in light modes, `soft_800` in dark and `soft_700` in dark-soft. Border, shadow and dim colors are decorative and have no normal-text contrast guarantee. Canvas checks do not establish contrast on every raised, selected or highlighted surface.

`text.secondary` stays separate from `surface.status`: an ANSI adapter must map terminal foreground slots explicitly rather than reuse a background role.

## Consume and verify

```ts
import { resolveVariant } from './core'

const { tokens, oklch } = resolveVariant('dark')
const foreground = tokens['text.primary']
const designColor = oklch['accent.green.faded']
```

```bash
pnpm tokens:generate  # core JSON + website JSON/CSS/SCSS/Tailwind exports
pnpm tokens:check     # check generated artifacts without writing
pnpm tokens:test      # non-UI contract, conversion and gamut checks
pnpm tokens:typecheck # standalone core, adapter, generator and test types
```

Artifacts omit clocks, absolute paths and machine-dependent metadata. Edit the spec and regenerate; never hand-edit generated files. The core CI job runs without Nuxt preparation or a website build.
