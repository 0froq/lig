# Syntax demo

The homepage shows two parsed examples.
The spans come from Neovim, not from hand-painted markup.

`samples/` is the source.
`generated/examples.json` stores the concrete trees, captures, priorities, and provenance.
The page colors those captures with `core/syntax.ts` and the active variant.

## Generate

```bash
pnpm syntax:generate
pnpm syntax:check
pnpm syntax:test
pnpm syntax:typecheck
```

Generation needs the Neovim and grammar revisions in `manifest.json`.
The default parser install is `~/.local/share/nvim/lazy/nvim-treesitter`.
Override it with `NVIM_TREESITTER_DIR`, or the Neovim binary with `NVIM_BIN`.
A revision mismatch fails.
Update the manifest and the vendored queries on purpose when the parser changes.

`parse.lua` runs headless, without user config, plugins, or LSP.
It walks every node and evaluates the vendored highlight queries.
TypeScript inherits the ECMA query.
The artifact records query checksums and upstream revisions.
It omits machine paths and clocks.

A normal site build uses the checked-in artifact.
It does not need Neovim.
Editing a sample requires `syntax:generate`.
This is a fixed demo, not a live editor.

## Mapping

`core/syntax.ts` maps captures to roles.
A dotted capture falls back through its parents.
`type.builtin` can resolve as `type`.
Each role points at a mono, struct, ref, or action tier.

Ordinary `@variable` uses `mono.highlight`.
General keywords and member properties use `mono.base`.
Parameters stay struct.
Builtin variables stay ref.
Unknown captures fall back to the primary foreground.
`@none` resets to that same foreground.
Overlaps resolve by priority, then by Neovim's capture order.

Hover selects the deepest node.
Click pins it.
Left and right move between segments.
Up and down move to the parent or child.
Escape clears the selection.
Switching variants recolors the same parse.

There is no LSP overlay and no injected-language tree.
Tree-sitter can see syntax.
It cannot see symbol resolution.

## Queries

`queries/{ecma,typescript,python}/highlights.scm` are unmodified nvim-treesitter snapshots.
The revision is in `manifest.json`.
The query set is Apache-2.0: [`queries/LICENSE`](queries/LICENSE).
The Python query also keeps Max Brunsfeld's MIT notice: [`queries/LICENSE.tree-sitter-python`](queries/LICENSE.tree-sitter-python).

## Check

Automated checks cover native parses, predicates, error recovery, UTF-8 offsets, and a stable artifact.
They do not open a browser.

Manually check hover, pin, keyboard movement, a long ancestor list, inspector scrolling, and all four variants with a node still selected.
