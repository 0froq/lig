# LiG

froQ 的 LiG：**Less is Great**，用少量颜色做语法高亮。本仓库维护 canonical token spec 和展示网站。

基础色、语义角色及四个变体的唯一事实源是 [`core/spec.json`](core/spec.json)。网站从 core 派生；Neovim、VS Code 与轻量工具 port 从同一套 core 生成，用户可以下载生成产物。

## 开发

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm tokens:generate
pnpm tokens:test
pnpm tokens:typecheck
pnpm tokens:check
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm palette:generate` 保留为 `tokens:generate` 的命令别名。

## 目录

| 路径 | 说明 |
| --- | --- |
| `core/spec.json` | 唯一手工维护的基础色、语义引用、混色公式和变体定义 |
| `core/resolve.ts` | 无全局状态的纯 token 解析器 |
| `core/generated/tokens.json` | 可供不同语言、不同 port 消费的确定性 JSON |
| `core/README.md` | token 契约、命名、混色规则和变体决策 |
| `core/tests/` | 非 UI 的契约与回归检查 |
| `palette/src/` | 将 core 转为现有网站 palette API 的适配层 |
| `palette/generated/` | 现有网站格式的 JSON、CSS、SCSS 和 Tailwind 色板 |
| `app/components/palette/` | 色板与代码预览 UI |
| `app/pages/index.vue` | 首页 |
| `ports/` | TypeScript port 编译器、原生映射与契约检查 |
| `ports/lightweight/` | Ghostty、fzf、Zellij、tmux、Starship、bat、eza 适配及安装说明 |
| `dist/ports/` | 本地生成的分发文件（不提交） |
| `public/ports/` | 构建时生成的轻量 port 下载文件（不提交） |

`core/generated/` 和 `palette/generated/` 的 token 产物提交到仓库，不能手工编辑；`tokens:check` 检查它们是否与 spec 一致，且不会写文件。port 分发文件在构建时生成，通过 `ports:check` 检查。

## 这一阶段的颜色决策

支持 `light`、`dark`、`light-paper`、`dark-paper` 四个变体。八种 accent、neutral 与 paper 灰阶及语义角色都在 core 中定义，计算不依赖调用顺序。`text.secondary` 与 `surface.status` 分开定义，避免把背景色用于次级文字；较弱的层级保留为 `text.subtle`。

paper 画布使用独立的暖灰阶，彩色变体使用按色相校准的 OKLCH 坐标，黄色单独校准。详见 [core 契约](core/README.md)。初始映射来自 `0froq/lig.nvim` 和 `0froq/vscode-theme-LiG`，之后这里是维护源，旧 port 是迁移输入。

`pnpm ports:generate` 生成两个编辑器 preview 分发包及七种轻量 port，各含四个变体。轻量文件集中在主仓库，通过网站下载与 CI 的 `lig-lightweight-ports` artifact 分发，无需独立仓库。`pnpm build` / `pnpm generate` 会先生成下载文件。安装说明见 [lightweight README](ports/lightweight/README.md)。本机配置不会被生成器修改，编辑器 preview 仓库仍独立发布。

## 手动验收

没有运行 UI 测试或浏览器检查。需要手动验收：四个主题切换后下载文件名与代码预览的一致性、旧 `/lab` 链接跳转、各工具的选中状态与边框、浅色背景黄色文字、tmux 内嵌颜色和 bat 语法高亮。原生配置解析检查不代表视觉验收。

## 许可

手写字体见 `app/kit/hand-font.ts`（SIL OFL 1.1）。
