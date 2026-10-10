---
title: 'How LiG defines color'
description: 'OKLab, shared tokens and a separate calibration for yellow.'
date: '2026-10-10'
---

LiG uses color to make structure, references and actions easier to recognize. Ordinary text stays quiet. The source palette contains more colors than code highlighting needs.

## OKLCH for controls, OKLab for mixing

[OKLab](https://bottosson.github.io/posts/oklab/) describes color through lightness L and two chromatic axes, a and b. OKLCH expresses those axes as chroma C and hue angle H. LiG defines its colors and variants in L/C/H, and mixes colors in OKLab.

These coordinates let us adjust lightness and chroma separately. L is not physical screen luminance, and C is not a normalized saturation percentage. Perceptual uniformity is approximate; the background, sample size and viewing conditions still matter. The neutral scale uses selected steps, and light and dark text do not need symmetrical assignments.

The compact chart shows design coordinates. Angle represents H, radius represents C, and a separate plot shows L. The circular plot combines colors at different lightnesses; its rings are not sRGB gamut boundaries.

## Calibrate each hue

Identical L/C values do not guarantee that every hue can be displayed. [The available sRGB gamut varies with hue and lightness](https://bottosson.github.io/posts/colorpicker/). LiG adjusts each hue separately, keeps its hue identity and evaluates it against the intended background.

At export, the resolver reduces out-of-gamut C while keeping L/H fixed, then quantizes the result to HEX. This strict boundary mapping is a project choice, rather than the browser's CSS gamut-mapping algorithm. The design chroma on the chart can therefore differ from the chroma reproduced by the exported HEX.

## The yellow exception

Earlier yellow used a lightness close to the other light-mode colors and looked olive. The current yellow has its own target: `L 0.79 / C 0.18 / H 95°`. After mapping, C is about `0.162` and the result is `#dbb800`. This is a visual choice for LiG, not a value prescribed by OKLab.

All four themes share this yellow base. The palette, ANSI 3 and warning roles reference it; ANSI 11 references its highlight. Highlight is darker than base in light themes and lighter in dark themes. Here, “bright” means emphasis rather than a promise of larger RGB values.

Higher yellow lightness reduces foreground contrast on light backgrounds. Against Light's `#f2f2f2`, the base measures about `1.73:1` and APCA `+29 Lc`, below WCAG AA for ordinary text. Yellow badges use dark text. Terminal foreground keeps the same yellow base so this tradeoff remains visible.

## One color source, several adapters

`core/spec.json` maintains the colors, modes and aliases. The resolver produces semantic tokens; port adapters translate them into each editor's format. Neovim highlight groups and VS Code scopes have their own mappings, without separate palettes.

Syntax uses mono, struct (green), ref (blue) and action (orange). Other colors serve diagnostics, UI and terminal output. ANSI 1-6 reference the corresponding colored bases, and 9-14 reference highlights. Slots 0, 7, 8 and 15 come from canvas and neutral text tokens. ANSI 16 is a mapping of existing tokens.

WCAG 2.2 and APCA readings use the exported HEX and background. APCA is experimental; [WCAG 3 is still a draft](https://www.w3.org/TR/wcag-3.0/) with its contrast algorithm yet to be determined. Readability also depends on font size, weight and context.
