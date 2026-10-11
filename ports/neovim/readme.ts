import type { BuildMetadata } from '../types'
import { NEOVIM_VERSION } from '../constants'

export function neovimReadme(metadata: BuildMetadata): string {
  return `# LiG for Neovim

A quiet colorscheme built from the same OKLCH tokens as [LiG](https://github.com/0froq/lig). Four variants: **light**, **dark**, **light-paper**, **dark-paper**. Native Lua; no Node.js, network access or runtime token downloads required.

## Install

Requires Neovim 0.10+ (native API checks passed on 0.10.4 and 0.12.4). With lazy.nvim:

\`\`\`lua
{
  "0froq/lig.nvim",
  lazy = false,
  priority = 1000,
  opts = { style = "dark" },
  config = function(_, opts)
    require("lig").setup(opts)
    vim.cmd.colorscheme("lig")
  end,
}
\`\`\`

Or install as a native package:

\`\`\`sh
git clone https://github.com/0froq/lig.nvim.git ~/.local/share/nvim/site/pack/lig/start/lig.nvim
\`\`\`

Then add \`vim.cmd.colorscheme("lig")\` to your configuration. Without an explicit style, \`lig\` follows \`vim.o.background\`. You can also select \`lig-dark\`, \`lig-light\`, \`lig-dark-paper\` or \`lig-light-paper\` directly. Changing \`background\` follows the selected light/dark family and remembers previously selected variants.

## Configure

Call setup before loading the colorscheme:

\`\`\`lua
require("lig").setup({
  style = "dark", -- dark / light / dark-paper / light-paper
  transparent = false,
  terminal_colors = true,
  lualine_bold = false,
  styles = { comments = { italic = true } },
  -- With lazy.nvim, detect installed plugins; otherwise enable all.
  plugins = { auto = true },
  -- plugins = { all = false, auto = false, telescope = true },
  on_tokens = function(tokens)
    -- Override resolved tokens. Direct aliases follow the override;
    -- mix/offset expressions are not recalculated.
    -- tokens["text.primary"] = "#abcdef"
  end,
  on_highlights = function(groups, tokens)
    -- Native nvim_set_hl attributes, e.g.:
    -- groups.Comment = { fg = tokens["text.subtle"], italic = true }
  end,
})
vim.cmd.colorscheme("lig")
\`\`\`

Supported style categories: comments, keywords, variables, functions, types. Plugin overrides accept a module name or plugin name and a boolean or \`{ enabled = ... }\` table. \`require("lig").get_tokens()\` returns a copy of the current resolved tokens.

## Plugin support

Classic syntax, Tree-sitter, LSP semantic tokens, diagnostics, terminal ANSI 0–15, blink.cmp, dashboard-nvim, fzf-lua, gitsigns.nvim, Telescope, which-key, and mini.clue / completion / cursorword / diff / files / indentscope / jump2d / snippets / statusline / tabline. All sixteen previously implemented integrations are retained. mini.nvim umbrella detection is supported. Tree-sitter parsers and language servers are configured separately by the user.

Lualine:

\`\`\`lua
require("lualine").setup({ options = { theme = "lig" } })
-- Fixed variants: lig-dark, lig-light, lig-dark-paper, lig-light-paper.
\`\`\`

Lightline:

\`\`\`vim
let g:lightline = { 'colorscheme': 'lig' }
" Fixed variants: lig_dark, lig_light, lig_dark_paper, lig_light_paper.
\`\`\`

Reading either statusline palette does not change highlights or background.

## Migration from 0.1 / preview

- The official repository and API remain \`0froq/lig.nvim\`, \`require("lig")\` and \`:colorscheme lig\`.
- If using \`0froq/lig.nvim-preview\`, replace that plugin specification (including any preview tag) with the install example above. Replace \`lig_preview\` / \`lig-preview\` in API and statusline configuration with \`lig\`. Remove the preview plugin to avoid two active copies.
- Retired \`dark-soft\` / \`light-soft\` styles and colorscheme/lualine entrypoints redirect to \`dark-paper\` / \`light-paper\`. These are new paper colors, not the old soft palette.
- \`on_colors(colors)\` is replaced by \`on_tokens(tokens)\`. The second argument to \`on_highlights\` is now the resolved token map, not the old flat palette. Migrate color references explicitly. The old \`lig.colors\`, \`lig.util\` and internal group modules are no longer public entrypoints.
- The optional mono profile is retired. Enabled mono and legacy \`on_colors\` hooks produce a migration error rather than being silently ignored.
- \`cache\`, \`day_brightness\`, \`dim_inactive\`, and \`styles.sidebars\` / \`styles.floats\` are retired. Use core tokens or \`on_highlights\` for customization. \`transparent\`, \`terminal_colors\`, syntax styles, plugin selection and \`lualine_bold\` remain supported.
- The old extras/build scripts and screenshots describe the previous palette. Current lightweight ports are generated in the [LiG source repository](https://github.com/0froq/lig/tree/${metadata.sourceRef}/ports/lightweight), not maintained as duplicate palettes here. This repository is the Neovim distribution.

## Source and verification

Edit [core and adapter source](https://github.com/0froq/lig/tree/${metadata.sourceRef}) rather than generated files here. From that source checkout, run \`pnpm ports:generate\`; \`dist/ports/neovim\` is the installable payload. To import it into this checkout, run \`python3 scripts/sync /path/to/lig/dist/ports/neovim\` and review the Git diff before committing. \`lig-build.json\` records the immutable source ref, input hash and each generated file checksum. Run \`python3 scripts/verify\` in this repository to check checksums and native API contracts with your installed Neovim.

Version: ${NEOVIM_VERSION} · Design: ${metadata.designVersion} · Compiler: ${metadata.compilerVersion}

Input SHA-256: \`${metadata.inputHash}\`

Non-visual verification covers loading/switching variants, native highlight/token values, all implemented integrations, statusline palettes and hooks. Actual rendering, installed plugin appearance and terminal readability still need manual review in your configuration. Lua booleans should have no underline; Lua table braces should use neutral punctuation colors.

Licensed under Apache-2.0; repository history retains the original implementation.
`
}
