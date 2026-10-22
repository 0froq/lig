# 站点头部、页脚与外框迁移记录

本批沿用总计划、batch 2 和 color-table 的做法。范围只有拥有的站点骨架组件及 `kit.css` 中属于它们的规则，不改模板、脚本、类名或 DOM。

## 实施步骤

1. 读取根目录指令、三个计划及全部拥有的组件，检索 `app/`、`content/` 和全仓库中的类族、覆盖与使用者。
2. 核对库的 Menu、Select、portal target 和基础样式。按类族迁移，保留原注释、声明和组件内规则的相对顺序。
3. 检查生成 HTML 的 scope 锚点、生成 CSS 的 deep selector 与 Transition 顺序，执行 DOM、规则集、格式、lint、类型和静态构建检查。
4. 只提交本批文件。不推送，不执行 subtree，不改 baseline、removed 清单、库或其他批次文件。

## 组件与使用者

| 组件 | 本批改动 |
| --- | --- |
| `SiteHeader` | 品牌、导航、菜单与语言选择、控制区、头部网格、浮动主题条和断点 |
| `SectionNav` | 分区导航基础、链接过渡和当前项/hover |
| `Paper` | 本项目纸张容器、grain、body 三个结构规则 |
| `Sheet` | 页面 stacking context |
| `layouts/default` | `l-site`、`l-frame`、skip link |
| `SiteFooter` | 原有 `l-foot-stop` 基础规则改放非 scoped 块，其余原有样式保持不变 |

`SlidingUnderline`、`MotionOutline`、`AnimatedDetails` 和 `app.vue` 已核对，没有属于它们的待迁移 `kit.css` 规则，未修改。没有新增组件、props、slot、状态或事件。

## 规则迁移

- `SiteHeader` scoped：`l-top`、`l-brand`、`l-dot`、`l-nav`、`l-header-actions`、`l-menu`、`l-menu-list`、`l-language-select`、`l-controls` 及其整族状态、svg、focus、当前项圆点。
- 同一 scoped 块：`max-width: 1100px` 和 `max-width: 860px` 的头部规则。基础、宽屏折叠、窄屏布局依原顺序排列。
- `l-top > l-sections` 和 `l-top > lig-theme-switch` 的头部布局由 `SiteHeader` 用 `:deep()` 选择子组件根元素。后者的控件自身规则仍留全局。
- `SectionNav` scoped：`l-sections`、`l-sections a`。当前项/hover 的原混合组同时保留在 `SiteHeader` 和 `SectionNav`，规范化后仍是原组。两处组件只命中各自拥有的元素，不拆原组、不增加包装。
- `SiteHeader` 非 scoped：`l-theme-bar` 基础与 `theme-bar-enter-active`、`theme-bar-leave-active`、`theme-bar-enter-from`、`theme-bar-leave-to`。对应的 Transition 就在本组件，代码注释说明框架类和基础 `translate` 的特异性约束。
- `layouts/default` scoped：`l-site`、`l-frame`、`l-skip`、`l-skip:focus`。层叠上下文、flex 外框、横向 clip 和键盘跳转行为不变。
- `Paper` scoped：`ui-paper`、`ui-paper-grain`、`ui-paper-body`。这些由本项目 SFC 自己生成，不是库组件内部元素，不需要 deep。
- `Sheet` scoped：`l-sheet` 的 position 和 z-index。不改 `useSignature`、`useMeasureMotion` 或各页面的使用方式。
- 从 `kit.css` 只删除本批规则和跟随注释，共 288 行。未重排或重新格式化其他规则。未新增 `!important`。

没有删除死规则。`scripts/css-rules.removed.txt` 和 baseline 均未修改。`SectionNav` 当前没有调用者，但本批保留其完整规则，不借迁移删除组件或规则。

## 共用/留下的规则

- `lig-theme-switch` 及其 button、hover、active、focus 规则留在 `kit.css`。实际使用者是本批不拥有的 `palette/PaletteThemeSwitch.vue`，不能把控件自身样式绑在某个外层消费者或通用 `SlidingUnderline` 上。
- `main, .l-top, .l-foot` 的 Installed transition 混合组保持原位。`.is-installed main, .is-installed .l-top, .is-installed .l-foot, .is-installed .ui-pen-layer` 混合组也保持原位。不拆组，不修改其他 worker 拥有的 Installed 规则。
- 两条全局 `html.has-stroke... .l-foot-stop` 规则及其 `min-width: 861px` 留在 `kit.css`。它们检查整页是否有 closing mark，并受 html 的手写/描边状态控制。`l-sheet` 出现在 `:has()` 中的类名不变。
- `:root` 与主题、reset、滚动条、forced-colors、html/body、通用元素、reduced-motion、shiki 变体及 `page-*` 原样保留。页面 Transition 由 Nuxt 管理，本批不迁。
- 中文标题混合组、palette 跨组件兄弟规则、内容块和页面规则均未修改。
- `AnimatedDetails` 所用的 `lig-more`、相邻折叠区块和固定标题混合组仍在 `palette.css`，还有其他使用者。原有 `@property --rule-end` 和 scoped 样式未改。
- 库也有同名 `ui-paper*` 样式，本批只移动本项目的声明，不修改 `vendor/ui`。

## 级联风险

以下来自源码、生成 HTML 和生成 CSS，没有浏览器视觉验证。

1. Menu 不是 portal 到 body。库的 `usePortalTarget(scope)` 找最近的 `.ui`，本处是 `l-controls lig-ui ui`。生成 HTML 确认该容器有 Header scope。菜单 content 和 MenuItems 是库内部节点，使用整段 `:deep(.l-menu-list ...)`，编译为 `[data-v-*] .l-menu-list ...`。scope 锚点在 portal 的实际祖先上，不要求库节点自己带 Header scope。
2. Select 的 portal target 是组件内部 `div.ui-select-portal`。`l-language-select` 根元素在生成 HTML 中有 Header scope。使用 `.l-language-select :deep(.ui-select-*)`，编译后 scope 留在本地 wrapper。这里也不需要 body portal 的非 scoped 例外。
3. 触发器、列表、行状态整族共同增加一个 scope attribute。原本覆盖库的 padding、font、border、shadow、hover/open 颜色、highlight 下划线和 checked 背景继续胜出。Menu focus offset 原先与库规则同特异性、靠后胜出，现在由更高特异性保持 `2px`。库的 outline 仍提供边框，未新增 outline 声明。
4. 原本语言触发器的基础 `transition` 来自库，库的 reduced-motion 规则也只选择该触发器。本批没有新增覆盖它的 transition。Menu 的 transition 仍来自本项目规则。全局 reduced-motion 的既有 `!important` 对两者继续生效。
5. 全部头部断点保持同一 scoped 块内的原相对顺序。1100px 开始隐藏 nav、显示 menu。860px 以下继续应用后写的两列头部、第二行 variant switch 和 actions 定位。大于 1100px 仍隐藏 menu。
6. `.l-top > .lig-theme-switch` 用 deep 只给头部直接子元素布局。浮动主题条内的另一份 switch 不是头部直接子元素，不会获得 grid-column。通用 switch 和 SlidingUnderline 的规则仍按原用途生效。
7. `l-theme-bar` 基础 `translate` 与 Transition from/to 原先均为一个 class，靠后写的 Transition 胜出。若仅把基础 scoped，基础会胜出，位移动画失效。两者一起放本组件非 scoped 块，仍保持基础在前、Transition 在后。active 的 transition 和 from/to 的 opacity 不变。
8. 导航 active/hover 与分区导航当前项/hover 原组没有拆。Header 中分区链接用 deep 支持子组件内部链接，SectionNav 中链接由自己生成，直接 scoped。直接链接颜色继续覆盖容器继承的 muted，router-link-active 继续生效。
9. `l-top` 的 scoped 基础没有声明 opacity、pointer-events 或 transition，不与留下的 Installed 混合组争夺这些属性。Footer 原有 scoped 基础同样没有这些属性。全局 Installed 隐藏与恢复规则仍命中原类名。
10. Footer stop 的原基础转为非 scoped，并注明全局 html 状态覆盖的原因。两条全局透明色规则仍高于一个 class 的基础。没有 closing mark 的页面仍由纸张/笔落点控制，窄屏 handwriting 例外保持原样。Footer 其他 scoped 样式、中文 thanks 和窄屏布局未动。
11. `l-site` 与 Paper 同根，两者都获得各自 scope。前者提供 z-index，后者只提供相同的 position。grain/body 不需要选择 slot 内容，Sheet 只选择自身根。没有给 `Fill.ts` 输出的内部节点增加 scoped 限制，品牌字体继续通过继承生效。
12. 库的 `ui-paper*` 原有结构声明与本项目迁移声明相同。库额外提供的 `background: var(--ui-bg)` 没有被本批改写。没有发生同名类在站点外部元素上扩散。

未发现本批需要保留“基础赢、覆盖输”的有效属性冲突。没有迁移 keyframes 或 animation 引用，不存在 scoped keyframes 跨文件名称问题。

## 验证

在 Mini（`Mac-mini.local`）执行。Node 命令通过 `mise exec --` 使用 `v24.21.0`。开始时工作树干净，已存在 `/tmp/lig-dist-base`，未修改或覆盖这份基线。

- `mise exec -- pnpm generate`：退出码 0，生成 80 个 prerender routes。
- `python3 scripts/dom-compare.py /tmp/lig-dist-base dist`：`28 pages compared, 0 differ`。按既有脚本忽略 scope、资源和 SSR 注释，未改比较逻辑。
- `mise exec -- node scripts/css-rules.mjs`：`617 rules, baseline 617, lost 0, new 0, removed on purpose 0`。脚本检查源码规则集合，另外检查了生成 CSS 的实际 selector 与顺序。
- `mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/kit.css app/components/SiteHeader.vue app/components/SiteFooter.vue app/components/SectionNav.vue app/components/Paper.vue app/components/Sheet.vue app/layouts/default.vue docs/plans/2026-10-22-scoped-styles-site-shell.md`：通过。配置排除 `docs/plans/**`，实际检查 7 个源码文件，报告人工审查。
- `mise exec -- pnpm lint`：0 warnings、0 errors。
- `mise exec -- pnpm typecheck`：退出码 0。已有 og-image `Unknown Nitro preset "static"` 警告仍存在。
- Python 标准库读取生成 HTML/CSS，检查 Header、controls、Select wrapper 和 Paper 的 scope，以及 menu deep、头部子组件布局、theme-bar 非 scoped 顺序：`Generated CSS/scope assertions passed for 24 header pages`。
- `git diff --check`：通过。

没有写 UI 测试，没有用浏览器或 computer use。DOM 和规则集一致不等于浏览器视觉验证。

## 手动验收

- 中英文首页和内页头部，宽度大于 1100px、861 至 1100px、860px 以下的品牌、导航、菜单、语言和 variant switch 排列。
- 菜单与语言选择的 hover、键盘 focus、打开/关闭、高亮、当前项圆点、选择后的路由与语言切换。
- 滚动超过头部后浮动主题条的入场/离场和水平居中，接近页脚时隐藏。检查 reduced-motion 和小屏安全区。
- 页脚有/无 closing mark 的页面，handwriting/stroke/bloom 组合，尤其 860/861px 边界和页脚标点显隐。
- 页脚中文 thanks、链接 hover/focus、宽窄屏布局和大字落点。
- 键盘 Tab 出现 skip link，跳到 main。纸张 grain、内容层叠、签名描边、横向 clip 和路由切换不变。
- Installed 状态中 main/header/footer 淡出、退出后恢复，主题与各 variant 切换不变。

没有拿不准、需要用户决定的事项。未迁的全局状态、混合组、主题控件及基础规则已明确列出，留待对应批次或收尾。
