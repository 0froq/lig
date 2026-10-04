# Neovim Tree-sitter demo

The homepage renders two complete parsed examples, not hand-assigned spans. `samples/` contains their source. `generated/examples.json` contains the full concrete syntax trees (named and anonymous nodes), capture ranges, priorities, iteration order and provenance. The browser applies the capture mapping from `core/syntax.ts` to the active variant's core tokens.

## Generation

```sh
pnpm syntax:generate
pnpm syntax:check
pnpm syntax:test
pnpm syntax:typecheck
```

Generation and native parser tests need the Neovim version and installed grammar revisions in `manifest.json`. The default parser installation is `~/.local/share/nvim/lazy/nvim-treesitter`; override it with `NVIM_TREESITTER_DIR`, or the Neovim executable with `NVIM_BIN`. Parser libraries live in `parser/<language>.so` and their upstream revision records in `parser-info/<language>.revision`. A mismatch fails explicitly. Install/build the pinned grammars with nvim-treesitter before regenerating. Update the manifest and queries deliberately when upgrading the parser stack.

`parse.lua` runs in clean headless Neovim without user configuration, plugins or LSP. It uses `get_string_parser`, traverses every child, and evaluates the vendored highlight queries with Neovim's native `iter_captures`, including predicates and directive ranges/priorities. TypeScript inherits the vendored ECMA query. Query checksums and upstream revisions are recorded in the artifact; machine paths and clocks are omitted. JSON object keys are canonicalized.

Normal website development/build/deployment consumes the checked-in artifact and does not need Neovim, parser binaries, external services or runtime WASM downloads. Editing a sample requires `syntax:generate`. This is a fixed-source demonstration, not a live code editor.

## Color resolution and inspection

`core/syntax.ts` contains the shared capture-to-role mapping. Dotted captures fall back through their parents when no specific binding exists (for example `type.builtin` → `type`). Each syntax role points to a mono/struct/ref/action family tier in the core spec; the inspector shows this intermediate layer. Function definitions and calls have distinct action tiers, constructors use action.base, and type references remain a muted ref tier. Helper captures and spell metadata do not paint text. Unknown captures remain inspectable and fall back to primary foreground when no mapped capture wins. Overlapping color captures resolve by priority, then Neovim capture iteration order; all competing captures remain available in the inspector. `@none` resets to the primary foreground.

`model.ts` splits the source at every node/capture boundary, including uncolored whitespace. It translates UTF-8 byte offsets into JavaScript UTF-16 indices without splitting code points. It does not rewrite the source or synthesize nodes. End offsets are exclusive. The inspector displays one-based rows and byte columns alongside zero-based absolute byte offsets.

Following lig.nvim's Tree-sitter hierarchy, ordinary `@variable` uses `mono.highlight`; general keywords (including import, conditional and repeat captures) and member properties use `mono.base`. Parameter bindings retain struct, builtin variables retain ref, and action/modifier keywords retain their specialized families. This distinction lives in the core aliases, so the demo and inspector resolve the same colors without changing parser queries.

Hover selects the deepest node at that source segment. Clicking/tapping pins it. The ancestor buttons and full-tree selector can select any node, including containers and recovery nodes with no visible text. A selected container shows its source range and the captures at its first non-whitespace segment. Keyboard focus on code supports left/right segment navigation, up/down parent/child navigation and Escape to clear. Changing variants recolors the same parse without losing selection. The inspector has a viewport-bounded fixed height and scrolls internally, with a sticky heading and stable scrollbar space; selecting a large subtree does not expand the page.

This demo deliberately contains no LSP semantic overlay, editor-specific capture overrides or injected-language trees. Tree-sitter queries can recognize syntax and naming conventions, but cannot reproduce language-server facts such as symbol resolution or default-library modifiers. The two examples do not require embedded-language parsers. Extending to code that does requires exporting those child trees and their highlight precedence as well.

## Upstream queries

`queries/{ecma,typescript,python}/highlights.scm` are unmodified snapshots from nvim-treesitter at the revision in `manifest.json`. Its Apache-2.0 license is included as `queries/LICENSE`; the Python query also retains its upstream MIT attribution (Max Brunsfeld), with the license in `queries/LICENSE.tree-sitter-python`.

## Verification boundary

Non-UI checks cover actual native parses, predicate filtering, error recovery, UTF-8/emoji offsets, lossless segmentation, complete ancestry, capture overlap/priority, core role coverage and deterministic artifact regeneration. No browser or UI tests are used.

Manual checks: hover punctuation/string/identifier; pin and resume; traverse parents and select the root; keyboard navigation; touch selection; long ancestry and root-source inspection without page-height jumps; internal inspector scrolling in wide and narrow layouts; and switching all four variants while a node remains selected.
