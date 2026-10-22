# Palette 下载与语法组迁移记录

本批沿用总计划和 batch 2 的迁移方式。只移动 `palette.css` 中属于下载与语法组的规则，不改模板、类名、脚本或库源码。

## 组件与规则迁移

共移动 37 个规则块，其中 36 个进入 scoped，1 个为保持级联进入组件内 unscoped。包含三个原有 `@media` 上下文，没有 keyframes 或 supports 需要迁移。

| 组件 | 迁移内容 |
| --- | --- |
| `PaletteDownloads.vue` | 24 个规则块。`lig-group`、`lig-ports`、`lig-port`、`lig-port-title`、`lig-project-icon` 及 `is-mark`、`lig-port-actions`、`lig-install-link`、`lig-port-variants`、`lig-port-all`、`lig-lightweight`、`lig-port-manifest`，含子元素、hover、focus-visible 和 860px 覆盖 |
| `PaletteLightweight.vue` | 6 个规则块。`lig-matrix`、`lig-matrix-port`，下载表上下文中的 `lig-download-link`、`lig-download-symbol`，含 hover、focus-within 和 reduced-motion |
| `PaletteSyntax.vue` | 7 个规则块。`lig-palette-heading`、`lig-swatch-groups`、`lig-swatch-group`、`lig-family-description` 及标题覆盖、900px 规则。保留原有 scoped 规则在前，追加迁移规则 |
| `PaletteAgentSetup.vue` | 无需改动。现有规则已在本组件 scoped，没有属于它的独占规则留在 `palette.css` |
| `PaletteTierRamp.vue` | 无需改动。形状、caption、focus、状态播报均已 scoped |
| `PaletteNeutralRibbon.vue` | 无需改动。色带、readout、outline、reduced-motion 均已 scoped，已有 MotionOutline deep 规则保留 |

新增 scoped 的下载组件仍使用原来的子组件根元素和 slot，不增加包装。`GridTable` 的 row-header slot 中的 `lig-matrix-port` 由 `PaletteLightweight` 编译，生成 HTML 中确实带有其 scope。

规则声明和原规则的相对顺序保持不变。Syntax 的基础 `lig-swatch-groups` 单独放入 unscoped 块，原因见下文。`palette.css` 剩余原有注释均保留，本次移动的规则没有附属原注释。没有新增共用组件。

## 共用与留下的规则

- `.lig-semantic-families + .lig-parsed-stage` 留在 `palette.css`。跨越 Syntax 与 Stage，两边属于不同 worker，不能把 Stage 的类迁入本批。
- `.lig-source-palette > .lig-palette-column > .lig-palette-heading` 和 `.lig-source-palette .lig-palette-heading > span:last-child` 留在原处。上下文属于 Showcase，不迁其他组件的类。本批只迁 Syntax 实际使用的标题基础规则和 group 覆盖。
- pinned title 的混合组 `.ui-collapsible.lig-more.is-open > .ui-collapsible-trigger, .lig-ui .ui-code-block.is-collapsible.is-open > .ui-code-block-header` 原样留下。涉及多处库组件，含 AgentSetup 的折叠代码块，不拆组。
- `lig-ui` 的全局 token 桥接留在 `ui.css`，其他展示、预览、终端表、强调表和全局状态规则未改。
- `DownloadLink.vue` 的下载图标、disabled cursor、announcement 基础规则原样保留。该组件在本批多个位置使用，本批仅迁移父级上下文覆盖，不迁共享组件基础规则。
- `choice.css` 有另一个 `.lig-matrix` 规则，原样留下。全仓库搜索确认当前没有 `choice.css` 导入，Nuxt 的全局 CSS 列表也不包含它。本批不处理这份历史样式。当前下载表的有效基础来自库 `GridTable` 和 `palette.css`。

没有因为“当前未命中”而删除外部上下文规则。共用规则和混合组不拆分。

## 级联风险

以下结论来自源码、Vue `compileStyle` 编译结果、基线 CSS 与生成 HTML，不是浏览器视觉验证。特异性按 `(ID, class/attribute/pseudo-class, type)` 记录。

1. Syntax 的 `.lig-semantic-families` 原本已 scoped，特异性 `(0,2,0)`，压过全局 `.lig-swatch-groups` 的 `(0,1,0)`。若直接追加 scoped 基础规则，两者会同特异性，后面的基础 gap `28px 24px` 会错误覆盖原 gap `24px 16px`，540px 两列也会被基础四列覆盖。因此基础规则迁入同组件 unscoped 块，注明原因。原 scoped 覆盖继续胜出，基础 margin-top `28px` 仍生效。
2. 900px 的 `.lig-swatch-groups:not(.lig-semantic-families)` 跟着基础族迁入 Syntax scoped。实际 Syntax 根元素带 `lig-semantic-families`，原来不匹配，迁移后仍不匹配。保留规则，不视为死规则删除。
3. `lig-palette-heading` 基础与 `.lig-swatch-group .lig-palette-heading` 覆盖同在 Syntax scoped，顺序不变。后者从 `(0,2,0)` 变为 `(0,3,0)`，继续覆盖基础的颜色和下间距。留下的 source-palette 上下文不匹配当前 Syntax DOM，不与之竞争。
4. 下载区的基础、actions、lightweight 覆盖同进 Downloads scoped。`.lig-port-actions .lig-install-link` 继续压过基础 margin-top `14px`，实际为 `4px`。`.lig-lightweight .lig-group` 继续压过基础 margin `48px 0 0`，实际为 `0`，font-weight 仍为 `400`。
5. Zed 的 `.lig-port-variants` 透传到 `SlidingUnderline` 根元素，根上有 Downloads scope。其内部链接和图标使用 `:deep()`，不要求 `DownloadLink` 内部 span 带父级 scope。`a.is-current` 和 `.lig-port-all` 继续覆盖普通链接 muted 色，860px 的 all 链接 margin-left 覆盖仍排在末尾。
6. 原 `.lig-port a:hover` 与 `.lig-port-variants a.is-current` 均为 `(0,2,1)`，hover 规则在后，所以当前 variant 悬停时 accent 胜出。迁移后两者均为 `(0,3,1)`，仍由 hover 胜出。`.lig-port a:hover` 原本也压过 `.lig-install-link:hover` 的 `(0,2,0)`，迁移后保持这个胜负，不改成 install-link 自己的 fg 色。
7. 下载表内部元素使用 `.lig-matrix :deep(.lig-download-link)`、`.lig-matrix :deep(.lig-download-symbol)`。Vue 编译为 `.lig-matrix[data-v-*] .lig-download-*`，特异性从 `(0,2,0)` 变为 `(0,3,0)`。原图标基础 `.lig-download-symbol[data-v-*]` 为 `(0,2,0)`，基线 HTML 中它内联在全局 palette stylesheet link 之前，原本由后加载的表格规则将 margin-inline-start 设为 `0`。迁移后表格规则直接以更高特异性胜出，最终仍为 `0`。没有改变原赢家。
8. 下载表 hover/focus-within 的图标规则从 `(0,4,0)` 变为 `(0,5,0)`，继续压过静止图标，保持 accent 与 scale `1.3`。reduced-motion 的同选择器覆盖跟着迁入，继续关闭 transition。全局 reduced-motion 的已有 `!important` 不改，本批没有新增 `!important`。
9. `.lig-port .ui-code-block` 用 `:deep()`，可继续命中库根元素。`.lig-port h3, .lig-port p` 保留为同一混合组并使用 deep，保持原本对子孙标题、段落的匹配范围。没有给库内部元素错误添加 scope 要求。
10. Matrix 根的 margin 从全局迁入 scoped，仍为 `24px 0 0`。库 `.ui-grid-table` 没有 margin 声明，grid display、width、overflow 和 typography 不被本批改动。未导入的 choice 历史规则不参与当前级联，不趁本批修改它。

## 死规则

没有删除死规则。没有修改 `scripts/css-rules.baseline.json`、`scripts/css-rules.removed.txt` 或检查脚本。

## 验证

Node 通过 `mise exec --` 使用项目要求的 `24.21.0`。开始时 Git 工作树干净，HEAD 为 `47bc146`。`/tmp/lig-dist-base` 已存在，直接使用用户提供的基线，没有覆盖它。

实际执行：

```sh
mise exec -- pnpm generate
python3 scripts/dom-compare.py /tmp/lig-dist-base dist
mise exec -- node scripts/css-rules.mjs
mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/palette.css app/components/palette/PaletteDownloads.vue app/components/palette/PaletteLightweight.vue app/components/palette/PaletteSyntax.vue docs/plans/2026-10-22-scoped-styles-palette-downloads.md
mise exec -- pnpm lint
mise exec -- pnpm typecheck
git diff --check
```

- `pnpm generate`：退出码 0，生成 `dist/`。
- DOM：`28 pages compared, 0 differ`。
- 规则集：`617 rules, baseline 617, lost 0, new 0, removed on purpose 0`。脚本实际扫描源码 CSS/SFC style，不验证特异性或加载顺序，级联另按上文核查。
- 格式检查：通过。首次检查发现 CSS 文件尾空行，删除后重跑。报告在配置的 `docs/plans/**` 排除范围内，命令仍显式包含它。
- lint：`Found 0 warnings and 0 errors.`。
- typecheck：通过。已有 og-image static preset compatibility 警告保留。
- `git diff --check`：通过。
- 补充通过 `vue/compiler-sfc` 的 `compileStyle` 检查三个组件，无编译错误。初次直接导入 `@vue/compiler-sfc` 被 pnpm 的依赖边界拒绝，改用已安装 `vue` 的 `vue/compiler-sfc` 导出，没有添加依赖。
- 解析生成 HTML，确认 GridTable 根、row-header slot 和 SlidingUnderline 根上的父级 scope 均存在。内部下载 span 由 deep 命中。

没有添加 UI 测试，没有用浏览器或 computer use。DOM 一致与规则集一致不能代替视觉验收。

## 手动验收

- 首页中英文，Neovim、VS Code、Zed 的标题、图标、左边线、代码块与操作链接间距。
- Zed 当前 variant、hover、键盘 focus、滑动下划线和 All 链接，860px 两侧的换行及 margin-left。
- lightweight 表格的标题、列选择、横向滚动、居中下载箭头，hover/focus 放大和 reduced-motion。
- 下载 idle、pending、started、error 状态的图标、cursor 和播报，Manifest 下载链接。
- Syntax 四列、540px 两列、标题颜色、family 描述、三档复制形状与旁边 Stage 的间距。
- AgentSetup 折叠与复制、notice bar 下 pinned header、NeutralRibbon hover/focus/readout 和 TierRamp 复制，确认未迁移组件保持原状。
- light/dark/paper variants，首页直接加载、切到内页再返回。

## 决定与后续边界

没有待用户裁决的问题。Syntax 保留一个 unscoped 基础块是为保留已有 scoped 覆盖与“旧规则在前”的约束，已在源码注明。跨组件兄弟规则、source-palette 上下文、共用 pinned-title 混合组和未导入的 choice 历史样式留给其拥有批次。没有 push 或 subtree 操作。
