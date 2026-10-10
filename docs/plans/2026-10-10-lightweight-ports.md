# Lightweight ports and playground removal implementation plan

**Goal:** Remove coordinate editing and the retired choice lab; deliver four token-generated themes for the tools present in the user's dotfiles: Ghostty, fzf, Zellij, tmux, Starship, bat and eza.

**Architecture:** Extend the existing TypeScript port compiler with small format adapters and a shared download catalog. Colors reference core tokens; bat reuses the existing editor style/scopes mapping. Lightweight artifacts ship together in this repository and in the site's public downloads, with checksums and per-tool installation notes. No changes to installed user configurations or native editor distribution repositories.

**Tech Stack:** TypeScript/jiti, native tool config formats, Nuxt/Vue, Markdown.

1. Remove LabState, coordinate controls and override resolution from PaletteSyntax.vue. Use canonical resolveVariant results for every demo. Remove unused preview props and the choice CSS entry; redirect /lab to syntax. Keep syntax inspection and four global themes. Historical choice sources remain unused because deletion was blocked by a safety hook.
2. Add ports/lightweight adapters and ports/catalog.ts for the seven tools, all four variants. Ghostty consumes exact ANSI and default terminal tokens; fzf/tmux/Zellij/eza use UI roles; Starship provides a palette fragment that retains existing module layouts; bat serializes the shared TextMate bindings to tmTheme.
3. Extend compile.ts to emit lightweight distributions with a manifest/readme and publish the same bytes under public/ports. Generate before Nuxt build/generate; keep generated public output ignored and verify it in ports:check. Add downloadable links for the selected variant and installation notes.
4. Add non-UI contract tests for variant coverage, exact ANSI values, shared syntax styles, no literal adapter colors, checksum equivalence and serialization. Validate configs with installed native CLI parsers in isolated temporary directories/servers, without browser/UI inspection or user-config changes.
5. Update documentation and CI artifact delivery. Run lint/types/token and port contracts/static generation. Push the preview branch; verify CI and public download responses. Native visual appearance and theme switching remain manual acceptance.

## Verification

- Completed ESLint, Nuxt and port type checks; 21 token contracts and 15 port contracts passed.
- All seven installed native configuration parsers accepted all four variants, using temporary paths and an isolated tmux socket. bat's generated scope/settings entries also matched the shared VS Code emitter exactly.
- Static generation completed. The output contains 28 theme files plus installation notes and a manifest; each checksummed download matches its distribution bytes. `/lab` and `/zh/lab` emit redirects, and the homepage no longer contains coordinate controls.
- No UI tests, browser checks, installed configuration writes or native editor distribution publishing. Manual acceptance: selected states, borders, yellow text, tmux inline styles and bat grammar classification.
