# LiG palette

froQ 的 LiG：**Less is Great**，用少量颜色做语法高亮。页面先讲这六种语法色，完整色板收在后面。基于 paper-landing：纸面、墨线、手写字体。

```bash
pnpm i
pnpm dev        # http://localhost:3000
pnpm build
pnpm palette:generate   # 从 palette/src 重新生成 palette/generated/*
```

## 内容在哪

| 路径 | 说明 |
| --- | --- |
| `palette/src/source.ts` | 与上游一致的**基础色**（accents + neutrals） |
| `palette/src/nvim-build.ts` | 变体推导（对齐 lig.nvim `lua/lig/colors/template.lua`） |
| `palette/generated/` | 生成的 `tokens.json`、CSS 变量、SCSS、Tailwind JSON |
| `app/components/palette/` | 色板页 UI |
| `app/pages/index.vue` | 首页（Less is Great） |
| `app/pages/lab.vue`（`/lab`） | 变体选择控件的五个方案，各自驱动同一段演示 |
| `app/components/palette/choice/` | 五个方案：句号、句子、命令行、圈、矩阵 |

笔记 / 文档 / changelog 等内容目录仍保留模板结构，首页已改为专用色板页。

## 颜色来源（勿臆造）

基础色必须同时存在于两个公开仓库，本仓库 `palette/src/source.ts` 从下列文件抄写：

| 色 | lig.nvim | vscode-theme-LiG |
| --- | --- | --- |
| accents（red … azure） | `lua/lig/colors/source.lua` → `M.accents` | `scripts/colors.ts` → `createThemePalette({ accents })` |
| neutrals `soft_*` | `lua/lig/colors/source.lua` → `M.neutrals` | `scripts/colors.ts` → `neutrals` |
| `black` / `white` | `source.lua` 显式 `#000000` / `#ffffff` | `colors.ts` 未列出；`template.ts` 默认同色 |

语义色与 syntax 角色由 `palette/src/nvim-build.ts` 按 nvim 的 `template.lua` 计算（与 vscode `scripts/template.ts` 同源算法）。

## 两源差异 / 冲突

**色值冲突（同一键、不同 hex）**：当前 accents 与 `soft_*` 在两仓库中一致，无冲突。

**结构差异（需知悉，非色值打架）**：

- `black` / `white`：nvim `source.lua` 写在 `neutrals` 里；vscode `colors.ts` 的 `neutrals` 对象省略这两项，由 `createThemePalette` 默认 `#000000` / `#ffffff` 补齐。

若日后两仓库基础色分叉，请更新 `source.ts` 并在 README 此节列出冲突，不要静默选边。

## 占位

- 预览代码块与纸卡片上的部分文案标为「占位」
- 站点未配置部署（仅本地）

## 命令

```bash
pnpm lint
pnpm typecheck
```

## 许可

手写字体见 `app/kit/hand-font.ts`（SIL OFL 1.1）。
