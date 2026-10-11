# Palette reference refinement implementation plan

**Goal:** Address the eight annotated issues in the current preview.

**Architecture:** Keep the shared variant and color resolver. Notes use a compact two-tone switch without the floating palette toolbar. Source separates a single neutral column from a single accent column; derived color tiers use a compact comparison grid. ANSI names remain slot identities; slot 0 uses an existing dim neutral instead of disappearing into the canvas.

**Tech Stack:** Nuxt, Vue 3 script setup, TypeScript, native CSS, Markdown, existing OKLab resolver.

1. Filter untitled placeholder notes in `app/pages/notes/index.vue` and `[slug].vue`; suppress the next-note link when no other published note exists.
2. Add a tone-only mode to `PaletteThemeSwitch.vue`, preserve the paper selection when switching tone, and show this nonfloating control on note routes. Remove the footer theme button.
3. Apply shared thin native scrollbars in `kit.css`, with local panel colors and a standard-CSS fallback. Preserve native scrolling and forced-color support.
4. In `PaletteShowcase.vue` / `palette.css`, place all 13 neutrals in the left column and all 8 accents in the right column. Keep columns at narrow widths, reduce samples instead of splitting neutrals.
5. Enlarge chart points, improve spacing, remove decorative chart clutter and use larger color marks for the lightness view.
6. Replace eight large triad blocks with a labeled, compact highlight/base/muted comparison grid; place UI roles in a separate disclosure and tighten their copy layout.
7. Keep ANSI slot names, distinguish bright names, describe default colors independently. Change ANSI 0 to `text.dim`, regenerate tokens and port artifacts, and add a non-UI contract regression for visible distinction from canvas.
8. Add the xterm/Catppuccin/Rosé Pine evidence to the bilingual note. Run lint, typecheck, token/port checks and static generation. No browser or UI tests. Push the preview branch and confirm CI/deployment.

## Result

Implemented all eight annotations. ANSI 0 is now an existing dim neutral, while ANSI slot identities and default foreground/background stay separate. Shared token version is 0.2.13; no native preview repositories were published.

Validation: lint, Nuxt/core/port typechecks, 21 token checks, 9 port checks, generated-artifact consistency and static generation passed (28 routes). Generated English/Chinese note HTML contains two theme options and no empty next-note link. Existing build warnings about the display-size expression and i18n baseUrl remain. No browser inspection or UI tests were performed; narrow palette columns, chart legibility, scrolling, copy interactions and theme changes require manual visual review.
