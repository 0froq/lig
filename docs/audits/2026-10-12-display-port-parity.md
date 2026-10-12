# Display and port parity audit — 2026-10-12

Scope: current source token aliases, website palette and parsed examples, terminal samples, generated native distributions, official repository snapshots and the locally installed Neovim plugin. This is a source/data/native-API audit, not visual acceptance.

| Finding                                                              | Evidence                                                                                                                                                              | Resolution                                                                                                                                                              |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strings used an undisplayed mono tier                                | `syntax.string` referenced `family.mono.secondary`; the displayed quiet tier is `family.mono.muted`                                                                   | Use muted in all four variants; regenerate every port                                                                                                                   |
| Note captures had different colors                                   | Website `comment.note` fell back to gray `syntax.comment`; native Neovim used green `diagnostic.hint`                                                                 | Add the explicit shared capture mapping                                                                                                                                 |
| Markup captures were incomplete                                      | Headings/strong/link colors and bold/italic/underline/strikethrough were missing from the website capture bridge                                                      | Share color and decoration contracts; preserve foreground underneath decoration-only captures; reject divergent native capture bindings during compilation              |
| Yellow sample documentation was stale                                | Terminal filled samples already use `terminal.background` for their text; notes claimed yellow badges use dark text                                                   | Describe the actual reverse-color samples in both languages                                                                                                             |
| Generated provenance named old snapshots                             | Generic and lightweight manifests referred to historical preview refs; Zed reused its initial source ref                                                              | All new manifests identify the current immutable source snapshot; generated Zed patch version is 0.1.1                                                                  |
| Generated VS Code installation instructions downloaded an older VSIX | The historical preview URL cannot deliver the newly generated palette                                                                                                 | Give instructions to package this source snapshot instead of claiming the old release contains it                                                                       |
| Independent editor repositories are different releases               | Official VS Code is 0.1.3 with real Soft themes, canvas `#0a0a0a` and string `#525252` in dark. Zed 0.1.0 is design 0.2.13/compiler 0.4.0, with dark string `#989898` | Website labels distinguish the legacy VS Code distribution and Zed repository snapshots from current downloads. Migrating/releasing these repositories is separate work |
| The host still uses the old Neovim preview                           | User configuration pins `0froq/lig.nvim-preview` at `preview-2026-10-04.2`, whose four variants include Soft                                                          | No host configuration change. Official `lig.nvim` has four real variants and retains Soft names only as redirects to Paper                                              |

A further boundary remains: Markdown documentation blocks are configured with `vitesse-light` / `vitesse-dark` in `nuxt.config.ts`, whereas the homepage interactive examples use LiG tokens. They are not examples of the native LiG port. Unifying that documentation highlighter would require a separate integration, not a token alias fix.

Intentional differences retained:

- `mono.secondary` remains the operator/UI secondary ink. Strings now explicitly use muted; this does not require changing the neutral ramp or all secondary UI text.
- `soft_50` through `soft_950` are names of neutral palette steps, not additional theme variants.
- Download checkmarks mean the fetched file was handed to the browser (`started`), not confirmed saved to disk; the current status wording already says this.
- ANSI black/white are slot names, not promises of literal black/white. Slots 0/7/8/15 intentionally map to neutral tokens; terminal foreground/background are separate.
- The OKLCH chart shows design coordinates while HEX exports are gamut-mapped sRGB. The explanatory note already states this distinction.
- The website examples use pinned Tree-sitter captures only. LSP providers and third-party editor integrations can classify the same text differently; matching token values does not prove identical editor rendering.

Verification:

- All 65 native Tree-sitter bindings compared with the website capture contract across four variants: no remaining foreground or decoration differences.
- Generated VS Code and Zed string foregrounds and canvases match core values in all four variants; current manifests share the source ref.
- Existing token (21), port (18) and parser/model (5) contracts pass; native Neovim 0.10.4 and 0.12.4 API/checksum checks pass.
- App/core/ports/syntax type checks and generated artifact drift checks pass. Static generation succeeds for 26 routes with independent worktree dependencies. A first attempt using another checkout’s symlinked dependencies failed due to shared Nuxt cache resolution; no source change was needed to resolve it.
- Manual acceptance remains: switch all four themes, inspect string/note/markup samples and overlapping decorations, verify hover/pin/keyboard/select behavior, and compare installed editor plugins with the intended repository/version. No UI tests or browser checks were run.

## Follow-up

The user authorized the remaining migrations. See [editor port migration](2026-10-12-editor-port-migration.md) for the VS Code/Zed canonical distributions, LiG Markdown integration and host Neovim switch. The independent-repository and host boundaries above describe the pre-migration audit, not the current outcome.
