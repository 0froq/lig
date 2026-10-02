# LiG core

`spec.json` is the authored source of truth. The old Neovim and VS Code repositories supplied the initial palette; they no longer define this repository's tokens. Future ports consume this spec or the resolved `generated/tokens.json`, rather than maintaining their own palette or mix formulas.

## Contract

- `schemaVersion: 1` identifies the spec and resolved bundle formats.
- `version` identifies the token release, independent of the website's package version. This is the initial `0.1.0` contract; ports and releases are a later phase.
- `palette.accents` contains the eight historical accent colors; `palette.neutrals` contains the thirteen historical neutral colors. Only this section authors hex literals.
- `tokens` defines shared semantic references and mixes.
- `modes.light` and `modes.dark` supply mode-specific roles.
- `variants` selects a mode and optional overrides: `light`, `dark`, `light-soft`, `dark-soft`.

A token is either a reference string (for example `palette.neutrals.soft_300` or `text.primary`) or a mix:

```json
{
  "mix": ["surface.canvas", "text.primary"],
  "weight": 0.9
}
```

This means 90% of the first color and 10% of the second. Blend encoded 8-bit sRGB channels, then round each channel to the nearest integer, with halves rounded up. This retains the historical LiG convention; it is not linear-light or perceptual mixing. All resolved values use lowercase `#rrggbb`. Unknown references, cycles, invalid colors, invalid weights and unknown overrides fail explicitly.

Resolution has no ambient background/foreground state. Dependencies use the selected variant's final values, including overrides. For example, `surface.status` always mixes that variant's canvas with its primary text.

## Roles

| Namespace                                      | Purpose                                                                                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `surface.*`                                    | Canvas, raised/floating/inverse surfaces, highlight, selection, folded, status, search/substitute backgrounds                   |
| `text.*`                                       | Primary, secondary, subtle, dim, strong and inverse foregrounds                                                                 |
| `accent.<color>.base`                          | The unmodified historical accent                                                                                                |
| `accent.<color>.highlight`                     | 60% base + 40% variant primary text                                                                                             |
| `accent.<color>.faded`                         | 60% base + 40% variant canvas                                                                                                   |
| `accent.primary`, `accent.secondary`           | Green and orange emphasis roles                                                                                                 |
| `syntax.*`                                     | Keywords, strings, comments, types, constants, numbers, functions, methods, operators, specials, variables, properties and tags |
| `git.*`, `diagnostic.*`, `message.*`, `mode.*` | Shared code/editor semantics; platform-specific bindings belong in ports                                                        |
| `border.*`, `shadow.*`                         | Decorative boundaries and shadows                                                                                               |

`text.secondary` is readable secondary text: `#a1a1a1` in dark modes and `#525252` in light modes. Its contrast against each variant's canvas is at least 4.5:1. A status surface is a background and must not be reused for terminal secondary text. The future terminal adapter must make its ANSI slot mapping explicit; core does not equate ANSI bright black with a surface.

`text.subtle` preserves the historical weaker foreground (`#525252` dark, `#a1a1a1` light), currently used for comments, strings and operators. `text.dim`, borders, shadows and accent syntax colors have no normal-text contrast guarantee. Only the secondary-on-canvas pairing has the above guarantee; this phase does not claim complete accessibility compliance or redesign all syntax colors.

## Explicit variant decisions

| Variant    | Canvas    | Primary text | Secondary text |
| ---------- | --------- | ------------ | -------------- |
| light      | `#fafafa` | `#404040`    | `#525252`      |
| dark       | `#0a0a0a` | `#d4d4d4`    | `#a1a1a1`      |
| light-soft | `#eeeeee` | `#404040`    | `#525252`      |
| dark-soft  | `#161616` | `#d4d4d4`    | `#a1a1a1`      |

Soft canvases mix 95% of the normal canvas with 5% absolute black (light) or absolute white (dark). Light-soft's raised surface is `soft_200`. This replaces the old resolver's accidental dependence on whichever variant ran previously. Accent highlight/faded endpoints now consistently use the selected variant's text/canvas. Generated accent ramps and soft backgrounds therefore intentionally differ from the old order-dependent outputs; base colors remain unchanged.

## Consume and verify

```ts
import { resolveVariant } from './core'

const { tokens } = resolveVariant('dark')
const foreground = tokens['text.primary']
```

Non-TypeScript consumers can load `core/generated/tokens.json`: the bundle contains schema/token versions, primitives and four `{ mode, tokens }` variants. Every semantic entry is a single resolved hex color; there are no joined triads or application-specific CSS names. For formulas and dependencies, use `core/spec.json`.

```bash
pnpm tokens:generate  # core JSON + existing website exports
pnpm tokens:check     # compare committed artifacts without writing
pnpm tokens:test      # non-UI contract/regression checks
pnpm tokens:typecheck # standalone core, adapter, generator and test types
```

The `Core tokens` CI job runs these core checks with install scripts disabled, without Nuxt preparation or an application build.

Artifacts omit clocks, absolute paths and other machine-dependent metadata. Edit the spec and regenerate; never hand-edit generated files. `palette/src` maps core roles to the existing website API and CSS names. It is an adapter, not another color authority. Old port repositories, port generation, downloads and publishing are outside this phase.
