# Hue calibration and ANSI preview Implementation Plan

**Goal:** Trial a cleaner hue-specific palette, separate yellow fill from yellow ink, and show the actual sixteen terminal colors alongside code.

**Architecture:** Keep `core/spec.json` as the sole color source. Use existing per-color offset expressions for light-mode calibration and shared mode-aware emphasis tiers. Add a derived yellow fill role without changing the meaning of foreground accent tiers. The terminal component consumes the resolved `terminal.*` contract, including experimental syntax backgrounds; it does not parse terminal escapes or invent a second palette.

**Tech Stack:** TypeScript core/resolver, Vue 3 script setup, Nuxt, generated JSON/CSS and native port artifacts.

## Steps

1. Calibrate accent primitives and light-mode offsets in `core/spec.json`; add `accent.yellow.fill` and route search surfaces to it. Preserve neutral/paper canvases and syntax-family assignments.
2. Replace uniform cross-hue L/C assertions with non-UI checks for hue identity, emphasis direction, export fidelity, foreground contrast ranges and fill/ink alias separation. Keep resolver and native port contracts.
3. Add `PaletteTerminal.vue` below the first parsed code panel, using the same resolved preview. Include all normal/bright foregrounds, background samples, ANSI indices/codes, actual contrast and realistic colored command output. Keep narrow-screen wrapping and horizontal overflow local to the output panel.
4. Adapt the coordinate controls to select a chromatic family before editing its actual L/C; independent states persist per variant. Regenerate alias/mix dependencies through the core resolver so terminal and search previews remain synchronized.
5. Update English/Chinese copy and core documentation, then regenerate canonical/website artifacts and native port outputs. Run core/port contract checks, types, lint and static generation. Do not write UI tests or operate a browser. Manual checks: four-theme synchronization, yellow on light/paper, both ANSI banks, background label readability, narrow-screen scrolling, and family L/C/background edits.
6. Commit and push the reviewable site trial on the existing branch; confirm CI/deployment status and return the preview URL. Do not publish editor preview repositories/releases in this website iteration.
