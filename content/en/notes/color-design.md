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

Syntax uses mono, struct (green), ref (blue) and action (orange). Other colors serve diagnostics, UI and terminal output. ANSI 1-6 reference the corresponding colored bases, and 9-14 reference highlights. Slots 0, 7, 8 and 15 come from neutral text tokens. ANSI 16 is a mapping of existing tokens.

## ANSI slot names and default colors

ANSI 0 is named black and ANSI 7 white. These are slot identities, not a requirement to use `#000000` and `#ffffff`. [XTerm distinguishes explicit colors from defaults](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html): SGR 30/37 select black/white foreground, while 39 restores the default foreground; 40/47 select black/white background, while 49 restores the default background. Changing the theme does not change these codes or slot names.

Light themes use different neutral mappings. [Catppuccin Latte](https://github.com/catppuccin/alacritty/blob/main/catppuccin-latte.toml) uses light gray `#bcc0cc` for black and dark gray `#5c5f77` for white, with its background separately set to `#eff1f5`. [Rosé Pine Dawn](https://github.com/rose-pine/alacritty/blob/main/dist/rose-pine-dawn.toml) similarly uses `#f2e9e1` for black and `#575279` for white against `#faf4ed`. Pure black is therefore not necessary for a light terminal theme.

LiG keeps those conventional slot names and reverses neutral polarity in light themes. ANSI 0 now references `text.dim`, rather than the identical canvas color; 7 references `text.primary`, 8 `text.subtle` and 15 `text.strong`. Default foreground and background remain independent tokens. This avoids an invisible ANSI 0 sample while preserving the shared gray scale. Dim slots remain low contrast and are not ordinary-text readability guarantees. Programs that hard-code assumptions about black/white may still behave differently across terminal themes.

WCAG 2.2 and APCA readings use the exported HEX and background. APCA is experimental; [WCAG 3 is still a draft](https://www.w3.org/TR/wcag-3.0/) with its contrast algorithm yet to be determined. Readability also depends on font size, weight and context.
