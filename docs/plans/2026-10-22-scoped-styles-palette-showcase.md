# Palette 展示与预览组迁移记录

本批沿用总计划和 batch 2 的规则。起点为 `47bc146`。只迁移 `palette.css` 中由本批组件拥有的规则，不改 script、template、类名、DOM 或业务行为。

## 组件与规则归属

| 组件 | 搬入的类族及规则 | 作用域 |
| --- | --- | --- |
| `PaletteShowcase` | `lig-hero-icon`、`lig-hero-name`、`lig-quiet-title`、`lig-palette-lead`、`lig-copy-bar`、`lig-copy-label`、`lig-copy-formats` 及 button hover/active/focus、`lig-source-palette`、`lig-palette-column`、`lig-oklch-note-link` 及 hover | scoped |
| `PaletteStage` | `lig-parsed-stage` 及 600px width | scoped |
| `PalettePreviews` | editor/terminal/paper-card 的原混合 padding 组、paper-card 边框、`lig-file` 及连续文件间距、`lig-code` 及 token 子类、`lig-terminal` 及段落/状态色、`lig-paper-title`、dot、`lig-paper-lede` | scoped |
| `PalettePreviews` | `lig-stage` 基础布局、`lig-editor` 边框及 860px 边框、原 860px stage 混合组副本 | unscoped，保留全局覆盖的特异性和顺序 |
| `PaletteSwatch` | `lig-chip`、fill/text/name/detail/value、复制态、hover/focus、600px 尺寸和排版 | scoped |
| `PaletteOklch` | `lig-oklch`、layout/plot/grid/ticks/point/hit/readout/current/coordinates/announcement、选中和 focus、600px 布局、reduced-motion | scoped |
| `PaletteParsedCode` | `lig-code`、`lig-parsed`、hint/body/code、inspected/pinned token、inspector panel/heading/content、node meta/color/i、600px padding、token transition | scoped |
| `PaletteParsedCode` | 原 header/heading 混合组、hint/node muted 混合组、focus 混合组、`lig-node-inspector` 及 button、`lig-inspector-floating` 及 pinned/transition、Reka wrapper transition | unscoped，支持 body portal 与库内部元素 |
| `PaletteTerminal` | `lig-parsed` 基础和 600px padding、原 header/heading 混合组 | scoped，基础放在原 ANSI 专属覆盖之前 |
| `PaletteSemanticTable` | `lig-roles` 及 600px 单列 | scoped |
| `PaletteThemeSwitch` | 无 | 规则只存在于 `kit.css`，不属于本批迁移来源，文件未修改 |

没有新增组件。没有修改 `vendor/ui`、CSS baseline、removed 清单或检查脚本。`lig-code` 基础由 Previews 和 ParsedCode 各持有一份，`lig-parsed` 基础由 ParsedCode 和 Terminal 各持有一份。保留原 selector group，不拆分混合组。

原注释随对应规则迁移。涉及迁移的规则没有 keyframes 或 supports。Oklch 和 ParsedCode 的 motion media 跟随规则迁入组件。浮层和 token 的 no-preference 规则因作用域不同分别放置，声明和 media 条件不变。

## 共用/留下的规则

迁移前检索了 `app/`、`content/` 中的引用，以及所有全局 CSS 和 SFC 中相关类族的基础、状态、上下文和 media 规则。

- `lig-more` 及相邻折叠项规则仍留 `palette.css`。除 Showcase 外，`AnimatedDetails`、`Changes`、`PaletteTerminalReference` 都使用它。
- 原 pinned title 混合组含 `.ui-collapsible.lig-more.is-open > .ui-collapsible-trigger` 和 `.lig-ui .ui-code-block.is-collapsible.is-open > .ui-code-block-header`，整组保留，不拆、不复制进 Showcase。
- `lig-palette-heading` 被本批之外的 `PaletteSyntax` 使用。保留基础、source-palette 上下文规则和 swatch-group 覆盖，不迁移 heading 类族。
- `lig-swatch-groups`、`lig-swatch-group`、`lig-family-description` 及 900px 规则属于 Syntax 组，未修改。
- `.lig-semantic-families + .lig-parsed-stage` 涉及 Syntax 的前一个兄弟根元素，留在原位，不把外部兄弟错误地加上 Stage 的 scope。
- `.lig-stage.lig-stage-syntax`、`.lig-stage-syntax .lig-editor` 及相邻 editor 规则留在原位。`lig-stage-syntax` 不属于本批模板。
- 原 860px `.lig-stage, .lig-stage-syntax` 混合组留在原位。Previews 的非 scoped 块保留同组副本，保证迁入组件的 stage 基础之后仍有窄屏覆盖。
- `lig-oklch-title` 当前没有模板引用，原样留下。本批不顺带清理遗留规则。
- Downloads、Lightweight、AgentSetup、Syntax、TierRamp、NeutralRibbon、TerminalReference、AccentTiers 的文件和专属类未修改。
- `kit.css` 中 theme switch、html 状态、中文排版及 Hero/Section 跨兄弟规则未修改。上一批的共用原语继续使用。

删除的死规则清单：无。`scripts/css-rules.removed.txt` 未修改。

## 级联风险与处理

以下结论来自源码、Vue CSS 编译和生成 HTML/CSS。没有浏览器视觉验证。

1. Showcase 的 Hero 图标和名字在 HeroFrame 的 slot 中，由 Showcase 创建，携带其 scope。复制格式按钮同样由 Showcase 创建，位于 SlidingUnderline 的 slot 中，仍可用普通 scoped 选择器。没有把库内部元素误当成本组件元素。
2. heading 类族保留全局。Source palette 和 palette-column 仅迁自己的布局，不提高 heading 基础或覆盖的特异性。未改变原 heading 的 margin、颜色、字号和上下文布局关系。
3. `.lig-chip` 的基础、hover、复制态、focus 和 600px 覆盖整族迁入 Swatch，均增加同一个 scope attribute，原顺序不变。detail/value 混合组不拆分。
4. `.lig-stage-wrap .lig-stage` 原本以两个 class 覆盖 stage 的 `margin-top: 40px`。stage 基础保持 unscoped，仍以一个 class 参与级联，不让它与外部覆盖变成依赖加载顺序的平手。
5. 860px stage 混合组原本与 `.lig-stage` 基础同特异性，靠写在后面切成单栏。仅搬基础会使它在组件 chunk 后加载时反胜。Previews 的 unscoped 块内按基础、窄屏组顺序保留副本，全局原组不动。沿用 batch 2 的混合组副本做法，规则集合不增加。
6. `.lig-stage-syntax .lig-editor` 的边框覆盖仍为两个 class，editor 基础和窄屏边框保持 unscoped，仍为一个 class。padding 混合组 scoped 后仅提供原 min-width/padding，不抢边框。没有扩大本批对 Syntax 的所有权。
7. Previews 与 ParsedCode 的 `lig-code` 基础分别放在各自 token/parsed 修饰规则之前。ParsedCode 的 6px/16px padding、pinned token 实线及高亮仍按原有顺序覆盖。未改变 segment 的内联颜色、粗体、斜体或 text-decoration。
8. `.lig-parsed` 在 ParsedCode 和 Terminal 中各有一份 scoped 基础和窄屏规则，避免 Terminal 样式依赖兄弟组件是否加载。Terminal 原 `.lig-ansi .lig-parsed-header` 比 scoped header 基础仍多一个 class，继续以 `font: inherit`、baseline 对齐和底边框胜出。
9. Popover 设置 `inheritAttrs: false`，将卡片 class 转发给内部 `PopoverContent`，并通过 `portalTo: 'body'` 渲染。卡片不是 ParsedCode 的 scoped 根元素。卡片、库 close button 和 Reka wrapper 的规则放入注明原因的 unscoped 块，避免祖先锚定的 `:deep()` 在传送后失配。
10. 浮层相关 mixed group 原样放入 unscoped 块。slot 中 panel/heading/content/meta/color 是 ParsedCode 自己创建的节点，使用 scoped。浮层 11px/1.65 基础、heading 12px/1.5、close button 原项目覆盖和 focus outline 均保留。生成 CSS 中库的 `.ui-popover-content` 在 entry CSS，项目卡片覆盖在页面 CSS，未把项目覆盖提前到库基础之前。
11. Oklch 的 circle 基础、透明 hit area、current text、current/focus line 及 reduced-motion 整族迁入，保留原顺序。MotionOutline 内部 path 不由这些选择器负责，没有新增跨子组件选择器。
12. Stage 基础没有 margin。外部 `.lig-semantic-families + .lig-parsed-stage` 仍提供 `margin-top: 32px`。SemanticTable 的 roles 基础和 600px 覆盖同处 scoped 块，色块内部继续由 Swatch 自己负责。
13. 本批没有发现需要修正的“原来基础赢、覆盖输”的冲突，也没有借迁移调整原来失效的规则。Theme switch、全局中文组和 html 状态未改，不扩大作用域迁移范围。

## 验证

已有用户指定的 `/tmp/lig-dist-base`，未重建或覆盖它。Node 命令统一通过 `mise exec --` 使用项目要求的 Node 24.21.0。

实际命令与结果：

```sh
mise exec -- pnpm generate
# 退出码 0，Prerendered 80 routes，Generated public dist

python3 scripts/dom-compare.py /tmp/lig-dist-base dist
# 28 pages compared, 0 differ

mise exec -- node scripts/css-rules.mjs
# 617 rules, baseline 617, lost 0, new 0, removed on purpose 0

mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/palette.css app/components/palette/Palette{Showcase,Stage,Previews,Swatch,Oklch,ParsedCode,Terminal,SemanticTable}.vue docs/plans/2026-10-22-scoped-styles-palette-showcase.md
# All matched files use the correct format，9 files。项目配置排除了 docs/plans/**

mise exec -- pnpm lint
# Found 0 warnings and 0 errors

mise exec -- pnpm typecheck
# Type check passed

git diff --check
# 通过，无输出
```

另外用项目安装的 `@vue/compiler-sfc` 对八个改动 SFC 的所有 style block 调用 `compileStyle`，全部无编译错误，包括当前路由未引用的 Previews 和 SemanticTable。用 Python 对比这八个文件迁移前后的 `<style>` 之前内容，script/template 源码全部未变。以上检查没有新增测试文件。

typecheck 和 generate 中仍有已有的 og-image static preset 兼容性警告。未修改对应配置。

格式命令显式传入全部十个改动文件，报告按项目现有配置被忽略，未改格式基线。DOM 检查忽略生成 scope 属性、资源节点等内容，不验证 CSS 的浏览器最终视觉。规则集检查按源码集合比较，不验证特异性和 chunk 顺序，相关风险已单独说明。

## 手动验收

- 中英文首页，Hero 图标/字标及 Source/Ports 标题、说明链接、复制格式按钮的默认/hover/active/focus。
- Source 色块的复制反馈、detail/value 换行，600px 两侧的色块尺寸和 roles 单/双列布局。
- 四种 palette variant 下 Oklch 图、hover/focus/current 标记、复制 readout、reduced-motion 和窄屏布局。
- ParsedCode 的代码字号/滚动条、hover 检查、高亮、点击固定、键盘导航、Escape、浮层 close button、focus outline、重定位和 reduced-motion。
- Terminal 标题和链接、ANSI 两组前景/背景色、滚动/聚焦、600px padding，以及 Syntax 到 Stage 的间距。
- 当前未找到路由调用 Previews 和 SemanticTable。若后续启用，人工核对预览 860px 单/双栏、editor 分隔线、terminal/paper 排版及 SemanticTable 600px 布局。它们已通过源码不变、规则集合、类型和 CSS 编译检查，当前 28 页 DOM 对比不覆盖其实际渲染。
- 折叠区域、全局 theme switch、下载区块和滚动 measure motion 应保持现状。

没有写 UI 测试，没有使用浏览器或 computer use。无待用户裁决的决定。保留的全局/混合规则留给对应拥有者或收尾批次处理。
