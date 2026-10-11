# Showcase polish implementation plan

**Goal:** Apply the four annotated display changes and verify whether the site uses 0froq/ui.

**Architecture:** Preserve canonical tokens and native port output. Change presentation in the existing Vue components and CSS; use the shared terminal color data for foreground/background examples.

**Tech Stack:** Vue Composition API, TypeScript, CSS, Nuxt static generation.

1. `PaletteOklch.vue`: distinguish extra accents (orange and azure) with hollow points in both coordinate plots; ANSI chromatic names stay solid.
2. `PaletteParsedCode.vue` and `palette.css`: keep the native select and keyboard behavior, draw an inset decorative chevron with reserved right padding.
3. `PaletteTerminal.vue`: retain the two ANSI banks, remove the duplicate warning and standalone WARN badge, and give each output row a foreground and background sample.
4. `PaletteSyntax.vue`, `palette.css`, locales: remove numeric/token metadata under family tiers, keep swatches/tier names/family descriptions and copying, update the aside.
5. Verify dependency/config/source evidence for 0froq/ui. Run lint, types and static generation; do not add UI tests or use a browser. Push the preview and verify CI. Manual acceptance: point distinction, select arrow and keyboard navigation, terminal alignment on narrow screens, family labels/copy behavior and four-theme switching.

## Verification

- `package.json`, `pnpm-lock.yaml`, Nuxt configuration and source imports show no 0froq/ui dependency. Paper and the ui-paper styles are local to this repository.
- ESLint, Nuxt type checking and static generation passed. No palette values or native port mappings changed.
- No UI tests or browser inspection. The visual and interaction acceptance items above remain manual.
