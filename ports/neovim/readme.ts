import type { BuildMetadata } from '../types'
import { NEOVIM_VERSION } from '../constants'

export function neovimReadme(metadata: BuildMetadata): string {
  return `# LiG for Neovim

Same palette as [LiG](https://github.com/0froq/lig).
Four variants: **light**, **dark**, **light-paper**, **dark-paper**.
Native Lua.
No Node.js, and no token download at startup.

## Install

Neovim 0.10 or newer.
Checked on 0.10.4 and 0.12.4.

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

Or as a package:

\`\`\`sh
git clone https://github.com/0froq/lig.nvim.git ~/.local/share/nvim/site/pack/lig/start/lig.nvim
\`\`\`

Then \`vim.cmd.colorscheme("lig")\`.
Without \`style\`, \`lig\` follows \`vim.o.background\`.
You can also set \`lig-dark\`, \`lig-light\`, \`lig-dark-paper\`, or \`lig-light-paper\`.
Changing \`background\` stays inside the light or dark family you already picked.

## Configure

Call setup before the colorscheme:

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
    -- Direct aliases follow the override.
    -- mix and offset expressions are not recalculated.
    -- tokens["text.primary"] = "#abcdef"
  end,
  on_highlights = function(groups, tokens)
    -- groups.Comment = { fg = tokens["text.subtle"], italic = true }
  end,
})
vim.cmd.colorscheme("lig")
\`\`\`

Style keys: comments, keywords, variables, functions, types.
A plugin override takes a module or plugin name, and \`true\` or \`{ enabled = ... }\`.
\`require("lig").get_tokens()\` returns a copy of the resolved tokens.

## Plugins

Classic syntax, Tree-sitter, LSP semantic tokens, diagnostics, and terminal ANSI 0–15.
Also blink.cmp, dashboard-nvim, fzf-lua, gitsigns.nvim, Telescope, which-key, and the mini modules that were already implemented: clue, completion, cursorword, diff, files, indentscope, jump2d, snippets, statusline, tabline.
The mini.nvim umbrella is detected.
Parsers and language servers stay in your own config.

\`\`\`lua
require("lualine").setup({ options = { theme = "lig" } })
-- lig-dark, lig-light, lig-dark-paper, lig-light-paper
\`\`\`

\`\`\`vim
let g:lightline = { 'colorscheme': 'lig' }
" lig_dark, lig_light, lig_dark_paper, lig_light_paper
\`\`\`

Reading a statusline palette does not change highlights or \`background\`.

## Migrate

The repository, \`require("lig")\`, and \`:colorscheme lig\` stay the same.

- Replace \`0froq/lig.nvim-preview\` with the install block above.
  Rename \`lig_preview\` and \`lig-preview\` to \`lig\`.
  Remove the preview plugin so two copies are not loaded.
- \`dark-soft\` and \`light-soft\` redirect to \`dark-paper\` and \`light-paper\`.
  Paper is a new surface, not the old soft palette.
- \`on_colors\` is now \`on_tokens\`.
  \`on_highlights\` receives the resolved token map.
  \`lig.colors\`, \`lig.util\`, and the old group modules are not public.
- The mono profile is gone.
  Turning it on, or calling \`on_colors\`, raises a migration error.
- \`cache\`, \`day_brightness\`, \`dim_inactive\`, \`styles.sidebars\`, and \`styles.floats\` are gone.
  \`transparent\`, \`terminal_colors\`, syntax styles, plugin selection, and \`lualine_bold\` remain.

Lightweight ports are generated in [LiG](https://github.com/0froq/lig/tree/${metadata.sourceRef}/ports/lightweight).
They are not maintained in this repository.

## Source

Edit [the LiG snapshot](https://github.com/0froq/lig/tree/${metadata.sourceRef}).
Run \`pnpm ports:generate\` there.
\`dist/ports/neovim\` is this repository.
Import it with \`python3 scripts/sync /path/to/lig/dist/ports/neovim\`, then \`python3 scripts/verify\`.

Version ${NEOVIM_VERSION}.
Design ${metadata.designVersion}.
Compiler ${metadata.compilerVersion}.
Input SHA-256 \`${metadata.inputHash}\`.

Checks cover loading, variant switches, highlight values, integrations, and statusline palettes.
They do not cover how your installed plugins look.
Lua booleans have no underline.
Lua table braces use neutral punctuation.

## License

MIT.
See LICENSE.
`
}
