# UI library and agent setup implementation plan

**Goal:** Embed 0froq/ui, provide a copyable confirm-before-install agent instruction, and redesign terminal output with inline color examples.

**Architecture:** Follow the library's subtree installation contract: full vendor/ui source, file dependency, Nuxt transpilation, stylesheet and locally mapped UI tokens. Use its CopyButton only for the new Ports instruction; preserve existing page components. Keep prompt content, locale, theme choice and URLs in LiG. Make terminal output a two-column log with compact inline background highlights.

**Tech Stack:** Nuxt, Vue Composition API, @froq/ui source, TypeScript, CSS.

1. Verify clean repositories and upstream source. Embed vendor/ui with git subtree, record upstream pull/push/extraction instructions verbatim in root AGENTS.md. Do not modify or publish the standalone UI repository.
2. Add file:vendor/ui dependency and lockfile, Nuxt transpilation/CSS, vendor lint ignore and a scoped twelve-token bridge to the site's existing colors/fonts.
3. Add PaletteAgentSetup.vue under Ports. Render one localized copyable instruction for the selected theme; resolve actual download origin after mount. Include manifest/README/source URLs and available port names. Require read-only installed-stack detection, versions/paths and proposed diffs first, explicit user confirmation before writes, preservation of existing behavior, reversible backups and verification after applying the confirmed plan. Do not run these instructions on this host.
4. Redesign PaletteTerminal.vue: retain sixteen color samples, one warning row, colored status words and compact highlights inside meaningful log text. Remove repeated full-width label backgrounds and allow natural wrapping.
5. Run lint, Nuxt type checking, static build and dependency/artifact checks. No UI tests or browser checks. Push the preview branch and verify deployment. Manual checks: clipboard success/denial, locale/theme-specific copied text, narrow-screen wrapping, terminal foreground/background samples, existing page styles and selected theme downloads.

## Verification

- Embedded upstream main at f5d257ffa53ea0444dd5763e38b58932698a1f6d with matching Git tree hashes. All 243 installed package source files match the vendored source. The standalone UI checkout remains unchanged.
- Confirmed file:vendor/ui in package.json and lockfile; no submodule, external source alias or workspace entry. Root AGENTS.md contains the upstream synchronization/extraction section verbatim.
- ESLint, Nuxt type checking, static generation and ports:check passed. Generation retained all 29 checksummed download entries. No color definitions or native port mappings changed.
- No local stack detection or installation was performed; the new text instructs the user's agent to wait for confirmation. Clipboard behavior and visual acceptance remain manual.
