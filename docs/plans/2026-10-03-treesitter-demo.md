# Tree-sitter demo implementation plan

**Goal:** Replace handwritten highlighting with Neovim Tree-sitter parsing and inspect every syntax node and capture in the two homepage examples.

**Architecture:** Generate portable full syntax trees and ordered captures with clean, headless Neovim, pinned TypeScript/Python parsers and vendored nvim-treesitter queries. The website resolves capture roles through core, renders lossless source segments, and lets hover, keyboard and tree selection inspect nodes. Generation is a developer command; the site builds and runs from checked-in JSON without Neovim.

**Tech stack:** Neovim Lua Tree-sitter API, TypeScript generation/model, Vue Composition API.

1. Extract source fixtures and pin parser/query provenance in syntax/manifest.json. Include upstream query licensing.
2. Implement syntax/scripts/parse.lua and generate.ts: full named/anonymous node tree, UTF-8 ranges, predicates, capture metadata and priorities. Fail on parser/version mismatch or erroneous example source.
3. Define capture-to-core semantic mappings and lossless UTF-8-to-JS segmentation. Preserve all overlapping captures and deterministic precedence.
4. Replace PaletteStage markup with parsed examples and an inspectable node panel: hover, click/tap, keyboard stepping, ancestors and full tree selector. Show capture, role, resolved color, node/field/range and provenance.
5. Verify parser and model contracts (non-UI), generated freshness, lint, typecheck and build. No UI tests/browser checks. Manual acceptance: both snippets, overlapping captures, Unicode, any node inspection, keyboard/touch, narrow layouts and variant switching.

Continue local work without committing, pushing or updating a PR. LSP semantic tokens, embedded-language injections and arbitrary live editing are outside these two fixed demos.
