# LiG

froQ 的 LiG：**Less is Great**，用少量颜色做语法高亮。本仓库维护 canonical token spec 和展示网站。

基础色、语义角色及四个变体的唯一事实源是 [`core/spec.json`](core/spec.json)。网站从 core 派生；后续 Neovim、VS Code、终端等 port 也从同一套 core 生成，用户可以下载生成产物。

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
| `app/pages/lab.vue` | 变体选择控件实验页 |

生成产物均提交到仓库，不能手工编辑。`tokens:check` 检查它们是否与 spec 一致，且不会写文件。

## 这一阶段的颜色决策

原有八种 accent 和十三种 neutral 色值保留。四个变体的计算不再依赖调用顺序。`text.secondary` 与 `surface.status` 分开定义，避免把背景色用于次级文字；它在四种画布上的对比度都至少为 4.5:1。原有较弱的注释、字符串和 operator 色暂时保留为 `text.subtle`。

soft 画布和 accent 派生端点现在有明确公式；与旧的、依赖全局状态的结果可能不同。详见 [core 契约](core/README.md)。初始基础色来自 `0froq/lig.nvim` 和 `0froq/vscode-theme-LiG`，之后这里是维护源，旧 port 是迁移输入。

当前只完成 core 与网站的数据接入。port 生成、发布流程、远端下载和本机主题安装留待后续。

## 手动验收

没有运行 UI 测试或浏览器检查。数据层改动可能影响：反复切换四个变体时的色板与代码预览、soft 背景、accent 的 highlight/faded 色、色板复制的 HEX/RGB/HSL/CSS 值、语义表新增的次级文字色。这些行为需要手动验收。

## 许可

手写字体见 `app/kit/hand-font.ts`（SIL OFL 1.1）。
