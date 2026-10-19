# LiG core

[`spec.json`](spec.json) is the only authored palette.
Ports read this spec, or `generated/tokens.json`.
They do not keep a second palette or a second set of mix formulas.
`palette/src` adapts the same tokens for the website.

## Contract

- Schema `2`. Token version `0.2.15`. Color space `oklch`.
- Eight accents, thirteen achromatic neutrals, and a separate low-chroma paper ramp.
- Authored only in `palette`, as `{ l, c, h }`.
- L is perceptual lightness in `[0, 1]`.
  C is nonnegative chroma.
  H is degrees in `[0, 360)`.
  Achromatic colors use `c: 0` and `h: null`.
- Resolution stays in floating point.
  Export quantizes to lowercase `#rrggbb`.

Green, for example:

```json
{ "l": 0.74, "c": 0.12, "h": 148 }
```

`tokens` holds shared roles and derived colors.
`modes.light` and `modes.dark` hold mode-specific roles.
Each variant picks a mode, then applies its overrides.
A reference always sees that variant's final value.
Unknown references, cycles, and invalid coordinates fail.

## Paper

`light-paper` and `dark-paper` match the chromatic coordinates of light and dark.
They change surfaces and mono inks.
They do not warm every color.

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

Paper hue is about 91.48°.
Chroma is .008 through paper_700, .006 at paper_800/900, and .003 at paper_950.
`palette.neutrals` stays at C=0.
`?variant=light-paper` or `?variant=dark-paper` opens that preview.
Paper is a surface treatment.
It is not a claim of less eye strain.

## Accents

Each hue has its own baseline.
One shared L/C made light yellow olive and orange brown.

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

`palette.accents` is the dark reference palette.
Light baselines are per-color offsets in `modes.light`.
Both paper variants inherit that mode's chromatic definition.

These are design targets.
sRGB export may lower C at fixed L/H.
Ports use the exported hex.
The site's OKLCH readouts show the design coordinates.

Yellow base is L=.79 / C=.18 / H=95°, exported as `#dbb800` in all four variants.
ANSI 11 uses the normal highlight formula: light `#c2a200`, dark `#f2cf3b`.
On the light canvas, yellow base is about 1.73:1 WCAG / +29 Lc.
That is an accepted exception, not a WCAG AA text claim.

Other light chromatic tiers are checked at ≥4:1 highlight, ≥3:1 base, and ≥2.3:1 faded.
Dark accent tiers stay ≥4.5:1.
Neutral primary and secondary ink stay ≥4.5:1.

## Neutrals

All neutrals have C=0 and H=null.

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

Near black, one 8-bit step covers a larger L interval.
The coordinates are the source.
The hex is the export.

Standard canvases use soft_950 and soft_50.
Raised surfaces use soft_900 and white.
Paper uses its own canvas and raised anchors.

## Derived colors

A token may be a reference, an OKLab mix, a constant-hue ramp, or a fixed OKLCH offset.

```json
{ "mix": ["surface.canvas", "text.primary"], "weight": 0.9 }
```

That is 90% of the first color and 10% of the second, mixed in OKLab.
Neutral endpoints stay neutral.

```json
{ "ramp": "accent.green.base", "toward": "surface.canvas", "lightness": 0.35, "chroma": 0.55 }
```

A ramp keeps H, moves L 35% toward the target, and multiplies C by 0.55.
The target's hue and chroma are not used.

```json
{ "offset": "accent.green.base", "lightness": 0.07, "chroma": -0.02 }
```

An offset adds the L and C deltas and keeps H.
Invalid results fail.
They are not clamped.

| Variant | Highlight ΔL / ΔC | Faded ΔL / ΔC |
| ------- | ----------------- | ------------- |
| dark    | +.070 / −.020     | −.070 / −.020 |
| light   | −.070 / 0         | +.070 / 0     |

Both sides start from that variant's base and keep H.
Equal distance is a calibration constraint.
It is not a claim that the steps look equally strong.

## Surfaces and text

| Variant     | Canvas               | Raised               | Mono highlight / base / muted     |
| ----------- | -------------------- | -------------------- | --------------------------------- |
| light       | soft_50 / `#f2f2f2`  | white / `#ffffff`    | soft_800 / soft_600 / soft_400    |
| dark        | soft_950 / `#090909` | soft_900 / `#181818` | soft_50 / soft_300 / soft_500     |
| light-paper | paper_50 / `#f4f2ec` | `#fdfcf9`            | paper_800 / paper_600 / paper_400 |
| dark-paper  | `#111113`            | `#201f1c`            | paper_50 / paper_300 / paper_500  |

| Role           | Light           | Dark            |
| -------------- | --------------- | --------------- |
| text.strong    | .30 / `#2e2e2e` | .96 / `#f2f2f2` |
| text.primary   | .48 / `#5d5d5d` | .78 / `#b7b7b7` |
| text.secondary | .52 / `#696969` | .68 / `#989898` |
| text.subtle    | .68 / `#989898` | .58 / `#7a7a7a` |

`text.secondary` is not `surface.status`.
Do not reuse a background role as terminal foreground.

The four syntax families are visual roles, not a full grammar:

- **mono** — ordinary reading. Variables use highlight. General keywords and properties use base. Comments and punctuation use muted.
- **struct** — parameters, modules, tags, modifiers.
- **ref** — types and values. Type references use muted. Constants and numbers use base.
- **action** — calls, constructors, and exception keywords use base. Definitions use highlight in dark modes and base in light modes.

Borders, shadows, and dim colors are decorative.
They have no normal-text contrast guarantee.

## Export

Conversion follows [Björn Ottosson's OKLab notes](https://bottosson.github.io/posts/oklab/).
In-gamut colors pass through.
Out-of-gamut colors reduce C at constant L/H until they sit on the sRGB boundary.
L=0 and L=1 export black and white.

`generated/tokens.json` has hex primitives and four variants.
Each variant has `mode`, mapped `tokens`, and design `oklch` from before gamut mapping.

## Check

```bash
pnpm tokens:generate
pnpm tokens:check
pnpm tokens:test
pnpm tokens:typecheck
```

```ts
import { resolveVariant } from './core'

const { tokens, oklch } = resolveVariant('dark')
```

Edit `spec.json`, then regenerate.
Do not hand-edit generated files.
