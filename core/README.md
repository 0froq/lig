# LiG core

`spec.json` is the authored source of truth. Ports consume this spec or `generated/tokens.json`; they do not maintain another palette or set of mix formulas. `palette/src` is the compatibility adapter for the website.

## Color contract

- `schemaVersion: 2`, token `version: 0.2.13`, `colorSpace: oklch`.
- Eight accents, thirteen achromatic neutrals and a separate low-chroma paper palette are authored only in `palette`, as `{ l, c, h }` coordinates.
- L is perceptual lightness in [0, 1], C is nonnegative chroma, H is degrees in [0, 360). Achromatic colors use `c: 0, h: null`.
- Eight accent primitives have individually calibrated OKLCH L/C and deliberate hue anchors; equal coordinates across hues are not a visual-balance requirement. Thirteen neutral primitives are designed on the achromatic OKLCH axis, with deliberate L steps rather than inherited RGB values.
- Resolution retains floating-point coordinates throughout the dependency graph. Quantization to lowercase 8-bit `#rrggbb` happens only at export.

For example, the calibrated green is authored as:

```json
{ "l": 0.74, "c": 0.120, "h": 148 }
```

`tokens` supplies shared semantic references and derived colors. `modes.light` / `modes.dark` supply mode-specific roles. The four `variants` select a mode and optional overrides. Dependencies always use the selected variant's final values, including overrides. Unknown references, cycles, invalid coordinates, weights, ramp parameters, schemas and overrides fail explicitly.

## Paper variants

`light-paper` and `dark-paper` are supported alternatives to standard light/dark. Their semantic accent coordinates and emphasis tiers exactly match the corresponding standard light/dark mode. They adjust surfaces and mono inks, rather than applying a warm filter to every color. Standard light/dark and the accepted paper color definitions are retained.

| Role                | Light paper                               | Dark paper                                 |
| ------------------- | ----------------------------------------- | ------------------------------------------ |
| Canvas              | `#f4f2ec`, L .96103 / C .00825 / H 91.48° | `#111113`, L .17853 / C .00407 / H 285.98° |
| Raised              | `#fdfcf9`, L .99                          | `#201f1c`, L .24                           |
| Selection           | `#e4e2dc`                                 | `#272622`                                  |
| Mono highlight      | paper_800 / `#2f2e2a`                     | paper_50 / `#f4f2ec`                       |
| Mono base           | paper_600 / `#5f5d59`                     | paper_300 / `#b9b7b2`                      |
| Mono muted          | paper_400 / `#9a9893`                     | paper_500 / `#7c7a75`                      |
| Primary WCAG / APCA | 5.87:1 / +75 Lc                           | 9.41:1 / −63 Lc                            |
| Muted WCAG / APCA   | 2.57:1 / +47 Lc                           | 4.40:1 / −31 Lc                            |

Paper ramp hue is approximately 91.48°, with C=.008 through paper_700, .006 at paper_800/900 and .003 at paper_950. Paper_50 reproduces the site's original warm background exactly; its L differs from neutral soft_50 by .00103. The dark canvas independently reproduces the site's slightly cool dark background; its warm raised surfaces and ink remain subtle. `app/app.config.ts` now reads both site canvas colors from core, avoiding independent background authoring.

The paper ramp is separate from `palette.neutrals`, whose C=0 contract remains intact. The website shows the matching paper ramp and canonical mono inks for the selected theme. A `?variant=light-paper` or `?variant=dark-paper` URL opens the chosen preview; an absent/invalid query retains the stored/default selection. WCAG/APCA readouts continue to report the actual chosen background.

Paper is a design treatment, not a claim of reduced eye strain or improved color discrimination. Manual comparison should inspect variable/keyword hierarchy, green/blue/orange separation, comments, selection and raised panels at actual editing sizes. Native compiler outputs include the two profiles, but editor preview repositories/releases are not republished by this website update.

## Calibrated accents

Each hue now has its own mode-specific baseline. Uniform L/C was numerically tidy but made light yellow olive and orange brown. This trial raises yellow lightness, increases red/magenta chroma, and gives light orange extra lightness/chroma. Neutral and paper surfaces remain unchanged.

| Color   | H   | Dark base L / C | Light base L / C |
| ------- | --- | --------------- | ---------------- |
| red     | 22  | .74 / .13       | .59 / .16        |
| orange  | 60  | .74 / .13       | .64 / .15        |
| yellow  | 95  | .79 / .18       | .79 / .18        |
| green   | 148 | .74 / .12       | .60 / .14        |
| cyan    | 194 | .74 / .12       | .60 / .11        |
| azure   | 234 | .74 / .12       | .59 / .13        |
| blue    | 275 | .74 / .12       | .60 / .15        |
| magenta | 325 | .74 / .14       | .60 / .15        |

`palette.accents` remains the authored dark/reference palette. Light baselines use per-color offsets from those primitives in `modes.light`. Both paper profiles inherit their standard mode's full chromatic definition. The existing resolver/schema and mode-aware emphasis formulas are unchanged; no per-port color authoring is added.

These are design targets. sRGB mapping may reduce C at fixed L/H, notably light cyan/azure/yellow, light orange highlight and dark red/blue highlight. Consumers use the mapped generated hex values; the demo's OKLCH readouts show design coordinates. Raising target C at a gamut boundary cannot make the exported color more saturated.

### Replacement yellow

The yellow base itself is now L=.79/C=.18/H=95°, exporting `#dbb800` in all four variants. This replaces the over-bright `#f5ce00` base in the authored primitive, not through a terminal-only override. The source palette, warning/message/git roles, mode.replace and ANSI 3 all inherit the same replacement. The light-mode ANSI 3 override from the preceding trial is removed.

ANSI 11 again uses the ordinary mode-aware highlight formula: light `#c2a200`, dark `#f2cf3b`. Both remain derived from the new base. `accent.yellow.fill` is a compatibility alias to `accent.yellow.base`; `text.on.yellow` selects soft_900 (`#181818`) for text on the yellow background. No independent foreground/fill yellow palette is retained.

This is an explicit visual trial. On the light canvas, yellow base measures approximately 1.73:1 WCAG / +29 Lc. The terminal color reference reports the actual readings. Yellow still maps to the sRGB boundary at several tier endpoints, reducing C at constant L/H. Tests verify the requested base hex, role propagation, distinct normal/bright slots, gamut mapping and export accuracy.

### Verification and readability boundary

This visual trial deliberately relaxes the earlier chromatic contrast calibration: light non-yellow tiers are checked at ≥4:1 highlight, ≥3:1 base and ≥2.3:1 faded, with APCA ≥63/54/43 Lc respectively. Bright yellow is an explicit exception with its actual readings reported above. These are regression bounds for this trial, not WCAG AA text guarantees or APCA font recommendations. Neutral primary/secondary ink still meets ≥4.5:1. At smaller text sizes, light orange, green and muted type references need manual assessment. Dark accent tiers retain ≥4.5:1.

The terminal panel reads exactly `terminal.ansi.0–15` from the resolved preview. It shows normal/emphasis banks and simulated command output; each output row pairs colored text with an adaptive-label background sample. SGR codes and WCAG/APCA readings live in the separate Source reference. Only one warning row is shown, using ANSI 3 for both samples. ANSI 0 aliases `text.dim`, keeping it distinct from the canvas in all four variants. ANSI 7 uses primary ink, ANSI 8 subtle ink, and ANSI 15 strong ink. The names black/white identify ANSI slots, not literal RGB extremes; default terminal foreground/background are separate settings (SGR 39/49). Light themes intentionally reverse neutral polarity, as Catppuccin Latte and Rosé Pine Dawn do. Dim neutral slots still have low text contrast; this change does not promise readable ordinary text for every ANSI slot.

The website now displays canonical resolved tokens only. Coordinate editing and temporary L/C/background overrides are removed; the old lab route redirects to the syntax section. Syntax examples, terminal samples, contrast readings and lightweight downloads therefore share the selected theme without experimental edits.

This is a numerically calibrated starting design. Hue distinction and visual weight in real code still require manual assessment. The homepage's TypeScript/Python demos and polar plot consume these resolved coordinates. The demos use actual Neovim Tree-sitter trees and highlight captures; see [the parsing pipeline](../syntax/README.md). Capture-to-role mappings live in `core/syntax.ts`, separately from primitive colors. Every syntax role refers to an explicit `family.mono`, `family.struct`, `family.ref` or `family.action` tier in the spec. The global theme switch controls the site tone and all canonical token displays; the site's decorative green reads `accent.primary` from the selected tone.

## Neutral lightness ramp

All neutrals have C=0 and H=null. The near-white samples use L=1/.96/.90/.84/.78 through soft_300; middle samples then use .10 steps through soft_700, while dark endpoints keep their independently calibrated intervals. The near-white gaps are .04/.06/.06/.06 rather than the earlier compressed .02/.04/.06/.10. This trial increases near-white separation without changing the middle/dark anchors. Display black level, ambient light and adaptation still affect their appearance; numeric intervals alone do not establish visual uniformity. Absolute white/black remain endpoints. The numeric names identify existing tokens, not percentages of RGB brightness.

| Neutral  | L    | Exported hex |
| -------- | ---- | ------------ |
| white    | 1.00 | `#ffffff`    |
| soft_50  | 0.96 | `#f2f2f2`    |
| soft_100 | 0.90 | `#dedede`    |
| soft_200 | 0.84 | `#cacaca`    |
| soft_300 | 0.78 | `#b7b7b7`    |
| soft_400 | 0.68 | `#989898`    |
| soft_500 | 0.58 | `#7a7a7a`    |
| soft_600 | 0.48 | `#5d5d5d`    |
| soft_700 | 0.38 | `#424242`    |
| soft_800 | 0.30 | `#2e2e2e`    |
| soft_900 | 0.21 | `#181818`    |
| soft_950 | 0.14 | `#090909`    |
| black    | 0.00 | `#000000`    |

The homepage labels these authored L values. Exported hex is quantized: near black, one 8-bit sRGB step covers a larger L interval, so the coordinates remain the source of truth rather than the rounded hex. The ramp is intentionally calibrated against the exported display colors, not forced into a symmetric numeric scale. White→50 now spans 13 sRGB byte values instead of 7; 50→100 spans 20 instead of 13. These separations are regression guards for this design trial, not experimentally established just-noticeable differences.

[OKLab's derivation](https://bottosson.github.io/posts/oklab/#motivation-and-derivation-of-oklab) already uses nonlinear response compression and assumes normal viewing conditions; applying a second generic gamma/Weber curve to L would not automatically improve uniformity. [Rudd's lightness model and psychophysical evidence](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2014.00640/full) discuss contextual, spatial and lightness/darkness induction effects. They do not provide one universally valid UI gray-scale formula or imply that all symmetric ramps are wrong. [Radix's use-case scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) assigns steps to surfaces, borders and text; its purpose is useful role distinctions, not equally spaced swatch differences. Our exact anchors are a contextual design trial responding to the user's observed near-white compression. WCAG/APCA measure text/background contrast and are not used to equalize swatch distances.

Standard canvases directly select dark=soft_950 (.14) and light=soft_50 (.96); raised surfaces select soft_900 (.21) and white (1). Paper selects its separate canvas/raised anchors from `palette.paper`. The website exposes the selected canvas through its code/terminal samples.

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

| Variant | Highlight ΔL / ΔC | Faded ΔL / ΔC | Distance from base |
| ------- | ----------------- | ------------- | ------------------ |
| dark    | +.070 / −.020     | −.070 / −.020 | .07280             |
| light   | −.070 / 0         | +.070 / 0     | .07000             |

Both sides start from the selected variant's base, retain H and have equal Cartesian OKLab distances from it. Light tiers retain base C: darker highlight, base and lighter faded. Triplets are centered on each hue’s calibrated baseline rather than a universal L value. Equal numerical distance is a calibration constraint, not a guarantee of identical subjective prominence. Tests also bound asymmetry after sRGB mapping and 8-bit export, except the deliberately vivid yellow whose endpoint gamut mapping is checked directly. The website displays equal-width swatches and reports actual WCAG/APCA contrast for manual assessment.

## Surface and mono roles

| Variant     | Canvas                  | Raised                   | Mono highlight/base/muted         |
| ----------- | ----------------------- | ------------------------ | --------------------------------- |
| light       | soft_50 / `#f2f2f2`     | white / `#ffffff`        | soft_800 / soft_600 / soft_400    |
| dark        | soft_950 / `#090909`    | soft_900 / `#181818`     | soft_50 / soft_300 / soft_500     |
| light-paper | paper_50 / `#f4f2ec`    | light_raised / `#fdfcf9` | paper_800 / paper_600 / paper_400 |
| dark-paper  | dark_canvas / `#111113` | dark_raised / `#201f1c`  | paper_50 / paper_300 / paper_500  |

Paper uses the standard mode's mono L hierarchy with small chroma additions. Primary/secondary ink remains at least 4.5:1 on the authored canvases. Light selection mixes canvas/primary at .9/.1; dark selection mixes raised/primary at .95/.05. Both policies also apply to the matching paper mode, with at least .03 design L separation from the canvas and at least 4.5:1 primary-text contrast. These numerical checks do not establish visual acceptance for every foreground/surface pair.

The supported set is exactly light, dark, light-paper and dark-paper. Website bookmarks and local preferences using the retired soft names migrate to their corresponding paper names. Soft definitions, native entrypoints and exports are removed; historical plans remain as dated records.

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
| text.strong    | .30 / `#2e2e2e` | .96 / `#f2f2f2` |
| text.primary   | .48 / `#5d5d5d` | .78 / `#b7b7b7` |
| text.secondary | .52 / `#696969` | .68 / `#989898` |
| text.subtle    | .68 / `#989898` | .58 / `#7a7a7a` |

Mono highlight/base/muted select the appropriate achromatic or paper ramp. Standard light/dark L gaps are .18/.20; paper retains the same hierarchy, with a .00103 L adjustment at paper_50 to reproduce the site color. Secondary ink remains between base and muted: primary +.04 L in light modes, soft_400/paper_400 in dark modes. Strong/primary/secondary ink retains at least 4.5:1 canvas contrast. Muted ink intentionally trades contrast for hierarchy: light is 2.58:1 / APCA +47 Lc, light-paper 2.57:1 / +47 Lc, dark 4.64:1 / −32 Lc and dark-paper 4.40:1 / −31 Lc. Muted ink is not a normal-text readability guarantee, especially for small or thin text. The website no longer exposes experimental L/C controls.

The larger light-mode span is a visual calibration choice, not a theoretical requirement. [OKLab's derivation](https://bottosson.github.io/posts/oklab/#motivation-and-derivation-of-oklab) assumes normal viewing conditions without explicitly modelling background adaptation. [APCA](https://github.com/Myndex/SAPC-APCA/blob/master/documentation/README.md) evaluates text/background polarity and relates contrast to typography, while [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) assigns scale steps by intended use. These support independent role calibration on each background rather than mirrored indices. Radix's text contrast targets are not a claim that this experimental muted tier meets them.

The four syntax families describe visual roles, not a complete taxonomy of language constructs:

- `mono`: ordinary reading—variables use highlight, while general keywords and member properties use base, following lig.nvim's Tree-sitter mapping. Comments/punctuation use muted, strings/operators use secondary. Parameters and builtin variables retain their struct/ref roles.
- `struct`: bindings and structural context—parameters, modules, tags and modifiers.
- `ref`: types and values—type references use muted, constants/numbers use base, type definitions/builtins/escapes use highlight.
- `action`: execution—function/method definitions use highlight in dark modes and base in light modes, avoiding the brown cast of the darker orange highlight. Calls, constructors and coroutine/return/exception keywords use base. Light-mode definitions and calls intentionally share the same color; this iteration does not add a new typographic distinction.

This preserves the family approach from lig.nvim. A declaration is not automatically `struct`: type definitions remain `ref`. The website legend shows each family once, with highlight/base/muted levels. All three chromatic families use the shared accent tier formulas, including `ref.muted`; there is no special blue-only muting formula. Default syntax foregrounds follow the explicit per-variant contrast calibration above. Light chromatic base/muted roles may fall below 4.5:1, as do quieter mono tiers. These are visual hierarchy choices, not guaranteed AA-readable text. Experimental L/C/background settings have no minimum-contrast guarantee.

Borders select `soft_200`/`paper_200` in light modes and `soft_800`/`paper_800` in dark modes. Border, shadow and dim colors are decorative and have no normal-text contrast guarantee. Canvas checks do not establish contrast on every raised, selected or highlighted surface.

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
