# LiG release audit — 2026-10-12

The four supported variants are `light`, `dark`, `light-paper` and `dark-paper`.
No blocking token, package or native configuration problem was found within the
checks below. This does not establish visual acceptance.

## Corrections

- Removed obsolete preview-branch installation instructions from the root,
  compiler and lightweight-port READMEs. Updated the handwriting license path.
- Download provenance uses the immutable `release-audit-2026-10-12` source tag.
  Only documentation/provenance changed; palette values and native adapters did
  not change. Existing editor release tags/assets remain immutable.
- The host VS Code installation was still `froq.theme-lig@0.1.3`. Updated it to
  the verified `0.2.0` GitHub VSIX and checked all four installed theme files
  against the release. User settings stayed byte-identical. The previous extension
  and settings are backed up outside the repository under the host's
  `.local/state/dots/migrations/lig-vscode-stable-20261012-135242` directory.
  Reload VS Code to activate the updated extension in existing windows.

## Verification

- Core: typecheck, 21 contract checks and deterministic generated-file check.
- Syntax: typecheck, five native parser/data checks and artifact check.
- Ports: typecheck, 19 contract checks and all 103 generated artifacts checked.
- Application: typecheck, lint and static generation of 26 routes.
- Ghostty, fzf, Zellij, tmux, Starship, bat and eza: all four variants accepted
  by their native configuration parsers using temporary configuration/state.
- Official Neovim `v0.2.1`: 33 payload checksums, native API checks on Neovim
  `0.10.4` and `0.12.4`, and all 149 tokens in each variant equal to core.
  Actual host startup loaded the official tag and muted `@string = #7a7a7a`.
- Official VS Code `v0.2.0`: 12 repository payload checksums; remote VSIX digest,
  package identity and all four packaged theme files checked.
- Official Zed `v0.1.1`: ten repository payload checksums; all seven remote release
  asset digests, extension ZIP payload and local theme JSON checked.
- Before the documentation correction, all 42 live preview download files matched
  the served SHA-256 manifest. Production and preview download manifests matched.
  VS Code and Zed repository payloads matched the compiler byte-for-byte.
  Documentation changes alter provenance/input hashes without changing theme JSON.
- Paper/mobile source review: document-anchored canvas slices, overscan bounded by
  document height, conditional bitmap resizing, actual-content-size observation,
  retained stroke progress and stable viewport units are still present. Both
  parsed examples share the same sticky-inspector component/style. No drawing or
  layout code was changed during this audit.

## Distribution boundaries

- Neovim: install from `0froq/lig.nvim`, tag `v0.2.1`.
- VS Code: install `theme-lig-0.2.0.vsix` from GitHub Releases. Marketplace/Open VSX
  publication is separate; a store installation can still retrieve an older theme.
- Zed: install `0froq/zed-theme-LiG` tag `v0.1.1` as a dev extension, or use the
  four local JSON files. It is not yet listed in Zed's extension store.
- Website UI extraction/layout changes are on PR #4, not yet merged into `main`.
  The current preview and production must not be described as the same UI release.
- Native `*-soft` Neovim names redirect to paper for compatibility; they are not
  additional authored variants. Neutral token names `soft_50` etc. are gray steps.
- Light-background yellow text deliberately has low contrast. ANSI black/white
  are conventional slot names, not promises of literal black/white.
- Static generation reports an unset i18n `baseUrl` for SEO links. It does not
  prevent generation or port installation; canonical-domain setup remains separate.

## Manual acceptance

Project rules prohibit UI tests and browser/computer-use UI checks. Remaining
checks require a person: mobile scrolling/toolbars/orientation without ink jitter;
all four theme switches and navigation; both inspectors' sticky/internal scrolling
and Select keyboard/touch behavior; copy/download success and failure feedback;
native editor rendering, syntax and terminal readability. Existing editor color
overrides and language grammars can affect the result.
