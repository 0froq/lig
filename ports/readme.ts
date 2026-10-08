import type { BuildMetadata } from './types'
import { PACKAGE_VERSION, PREVIEW_TAG } from './constants'

export function portReadme(port: 'neovim' | 'vscode', metadata: BuildMetadata): string {
  const installation = port === 'neovim'
    ? `
## 安装（lazy.nvim）

\`\`\`lua
{
  "0froq/lig.nvim-preview",
  tag = "${PREVIEW_TAG}",
  lazy = false,
  priority = 1000,
  config = function()
    require("lig_preview").setup({ style = "dark" })
    vim.cmd.colorscheme("lig-preview")
  end,
}
\`\`\`

或者无需插件管理器：

\`\`\`sh
git clone --branch ${PREVIEW_TAG} https://github.com/0froq/lig.nvim-preview.git ~/.local/share/nvim/site/pack/lig-preview/start/lig.nvim-preview
\`\`\`

安装后：\`:colorscheme lig-preview-dark\`、\`lig-preview-light\`、\`lig-preview-dark-soft\`、\`lig-preview-light-soft\`、\`lig-preview-dark-paper\`、\`lig-preview-light-paper\`。

## 配置

\`\`\`lua
require("lig_preview").setup({
  style = "light", -- dark / light / dark-soft / light-soft / dark-paper / light-paper
  transparent = false,
  terminal_colors = true,
  -- 默认检测 lazy.nvim；不用 lazy 时默认启用全部插件高亮。
  -- plugins = { all = true },
  -- plugins = { all = false, auto = false, telescope = true },
  -- 支持 module 名、完整 plugin 名、boolean 或 { enabled = ... }。
  -- lualine_bold = true,
  styles = { comments = { italic = true } },
  on_tokens = function(tokens)
    -- 覆盖最终 token；直接 aliases 传播，mix/offset 派生值不重算。
    -- tokens["text.primary"] = "#abcdef"
  end,
  on_highlights = function(groups, tokens)
    -- 最终 Neovim 原生高亮覆盖。
  end,
})
\`\`\`

目标 Neovim 0.10+；本次原生 API 契约校验使用 Neovim 0.12.4，尚未验证最低版本。Tree-sitter 与 LSP 由你自己的 Neovim 配置启用。

## 插件覆盖

迁入原版 lig.nvim 已实现的全部 16 个模块：blink.cmp、dashboard-nvim、fzf-lua、gitsigns.nvim、Telescope、which-key，以及 mini.clue / completion / cursorword / diff / files / indentscope / jump2d / snippets / statusline / tabline。支持 mini.nvim 整包检测。原版注释掉的插件尚未实现，不在本次覆盖范围。

所有颜色引用 core tokens；插件不需要安装才能加载主题。Git overlays 和 cursorword 背景使用 core 中的 OKLab mix token。完整模块/group count 记录在 lig-build.json。

Lualine：

\`\`\`lua
require("lualine").setup({ options = { theme = "lig-preview" } })
-- 也可用 lig-preview-dark / light / dark-soft / light-soft / dark-paper / light-paper。
\`\`\`

Lightline：

\`\`\`vim
let g:lightline = { 'colorscheme': 'lig_preview' }
" 固定变体：lig_preview_dark / light / dark_soft / light_soft / dark_paper / light_paper。
\`\`\`

迁移时将 statusline 配置中旧的 lig 主题名换成上面的 preview 名称，避免加载正式版入口。所有 statusline palette 读取都不会切换 colorscheme 或修改 background。
`
    : `
## 安装（MacBook 的 VS Code）

\`\`\`sh
curl -fL https://github.com/0froq/vscode-theme-LiG-preview/releases/download/${PREVIEW_TAG}/theme-lig-preview-${PACKAGE_VERSION}.vsix -o /tmp/theme-lig-preview.vsix
code --install-extension /tmp/theme-lig-preview.vsix
\`\`\`

若终端没有 \`code\`，在 VS Code 命令面板使用 \`Extensions: Install from VSIX...\` 选择下载文件。
随后 \`Preferences: Color Theme\` 选择 LiG Preview Dark / Light / Dark Soft / Light Soft / Dark Paper / Light Paper。

Extension ID 是 \`froQ.theme-lig-preview\`，与现有 \`froQ.theme-lig\` 独立。最低 VS Code 版本沿用 1.107.0。
`
  return `# LiG ${port === 'neovim' ? 'Neovim' : 'VS Code'} Preview

这是一套供人工试用的生成产物，未替换正式 LiG 主题。六套 variant（含 light-paper / dark-paper 试验）来自同一个 OKLCH core 与 shared styles。

${installation}
## 覆盖与测试重点

- 基础编辑界面、诊断、选区、terminal 16 色。
- ${port === 'neovim' ? '经典 syntax、Tree-sitter、LSP、原版已实现的 16 个插件模块与 lualine/lightline。' : '191 个 Workbench keys、TextMate 与 semantic tokens；是否收到 semantic tokens 取决于语言扩展。'}
- 对比 TS/Python 中的 variable / keyword、类型定义 / 引用、函数定义 / 调用、字符串 / 注释。
- 试用六套主题、选区/搜索/诊断。${port === 'neovim' ? '手动检查 completion kinds、Telescope/fzf、which-key、git overlays、mini windows/snippets、statusline/tabline；透明背景与 hooks 可单独检查。Lua true/false 不应有下划线，表括号应为灰色。' : '比较 semantic highlighting 开启与关闭时的分类。'}
- Paper 变体使用微染色的面板与灰阶；彩色 token 沿用对应 light/dark。Soft 变体另行调整背景、强调范围和灰阶。
- 字体与最终视觉效果由用户在实际编辑器手动确认；构建检查不等于视觉验收。

## 单一事实源

请在 [LiG source snapshot](https://github.com/0froq/lig/tree/${metadata.sourceRef}) 修改 design/core/compiler；不要手改这里的 generated 文件。

Design version: ${metadata.designVersion}
Compiler version: ${metadata.compilerVersion}
Input SHA-256: \`${metadata.inputHash}\`

\`lig-build.json\` 包含该 repo 的每个文件 checksum。Preview 是静态 native 产物，安装时无需 Node，也不会从网络加载 tokens。
`
}
