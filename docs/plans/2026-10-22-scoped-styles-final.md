# Scoped styles 收尾记录

## 结果与范围

起点 `80638b8`，工作区干净。在 Mini（`Mac-mini.local`）执行，Node 通过 `mise exec --` 使用 `24.21.0`。

- `kit.css` 改为 `base.css`，460 行缩为 206 行。`palette.css` 的 67 行全部迁移或确认无引用后删除，文件和 Nuxt 引用一起移除。
- 项目全局 CSS 文件只剩 `base.css` 与原样保留的 15 行 `ui.css`。字体及 `@froq/ui/style.css` 导入不变。
- 23 个 SFC 的 script/template 源码不变。没有新增组件、包装元素、props、状态、类名或 JS 行为。
- 没有修改 `vendor/ui`、`scripts/css-rules.baseline.json`、颜色事实源或部署配置。
- 全部验证通过。DOM `28 pages compared, 0 differ`。按单选择器展开后的规则集为 `660 rules, baseline 731, lost 0, new 0, removed on purpose 71`。
- 静态生成 CSS 级联辅助比较为 `3584` 组配置、`0` 个声明赢家值差异。它不是浏览器视觉验收，边界见验证部分。
- 只在当前 worktree 本地提交。不 push，不执行 subtree。

## 实施步骤

1. 完整读取总计划、全部七份同日期批次报告和根目录 `AGENTS.md`。检查 app、docs、scripts 的嵌套指令，没有额外文件。
2. 全仓库检索剩余类族、渲染函数、内容、composable、共享 Markdown hook 和 SFC 样式。检查库 Collapsible、CodeBlock 与 pen canvas 的实际结构，仅阅读库源码。
3. 在修改前的干净状态执行 `pnpm generate`。保留额外的 `/tmp/lig-final-before-dist` 用于本批级联比较，不覆盖已有 `/tmp/lig-dist-base`。
4. 按拥有者迁移 html 状态、中文组、窄屏组、measure、Installed、Transition 和折叠标题。合并不再需要低特异性的基础块，删除跨所有者的窄屏副本。
5. 把全局文件改名并瘦身。登记死选择器，按单选择器比较两侧规则集，保留原 baseline。
6. 对照实际生成 CSS 的特异性和顺序，修正中文长标题和原始 MDC 标点两处容易漏掉的级联。执行格式、lint、类型、构建、DOM、规则集、源码及 scope 检查。

## 最终全局 CSS 文件

`app/assets/css/base.css` 仅保留：

| 规则 | 必须全局的原因 |
| --- | --- |
| `:root`、dark `data-theme`、`prefers-color-scheme` fallback | 文档级 token 与主题，供所有组件继承 |
| `*`、`*::before`、`*::after` 的 box sizing | 文档及伪元素的基础重置 |
| 跨引擎滚动条、相关 `@supports` 与 `forced-colors` | 原生文档及任意滚动容器，包括库与动态内容 |
| `html`、`body` | 根排版、背景、横向 clip、滚动与默认 margin |
| `a`、`::selection`、`:focus-visible`、`code` | 通用链接、选择色、键盘焦点与内联代码基础 |
| reduced-motion 中 `html` 和 `*, *::before, *::after` | 原有全局可访问性重置。原 `0.001ms !important`、匹配范围和 media 原封不动 |
| `.shiki`、`.shiki span`、各 `data-lig-variant` 与暗色 fallback | 构建期生成的 MDC 高亮跨多个渲染边界，四种配色及装饰必须一致 |

`app/assets/css/ui.css` 原样保留库 token 桥接。`nuxt.config.ts` 中原 `kit.css` 位置替换成 `base.css`，删除 `palette.css` 导入，没有调整字体、库或桥接之间的顺序。

没有无法迁移而被迫留在 `base.css` 的业务规则。reduced-motion 的通配组是基础重置，不把它拆成有限的组件列表，否则会缩小已有 `!important` 的范围。

## 规则归属与作用域

| 拥有者 | 迁入及整理内容 | 最终作用域 |
| --- | --- | --- |
| `palette/PaletteThemeSwitch.vue` | `.lig-theme-switch`、button、hover/active、focus | scoped。按钮为本组件创建的 slot 节点 |
| `AccentMark.vue` | `.l-mark`、bloom、final-mark 的 stroke fallback | 同一 scoped 块，基础在状态前 |
| `DocBody.vue` | `shared/final-mark.ts` 生成的原始 MDC 标点 | 基础 `:deep(.l-mark)`，两条完整状态选择器用 `:global(...)`，在同一 scoped 块内 |
| `HeroFrame.vue` | foot、tagline 基础与 html 状态、窄屏边线恢复、Hero 内部 measure、`--edge`、handwritten right | 合并为一个 scoped 块。slot 内 lede/CTA 继续 deep |
| `content/Hero.vue` | release 基础、窄屏 span、`html:not(.has-hand)`、lede 基础 | scoped，原 release unscoped 权宜块移除 |
| `SiteFooter.vue` | stop 基础、带 `:has()` 的 html 状态、861px 状态、Installed 过渡和隐藏 | 同一 scoped 块 |
| `SiteHeader.vue` | Installed 过渡和隐藏，theme-bar 基础与 Transition | 同一 scoped 块，基础在 enter/leave 前 |
| `layouts/default.vue` | main 的 Installed 过渡和隐藏、html 滚动锁 | main scoped，`.is-installed` 滚动锁非 scoped |
| `Sheet.vue` | 动态 `.ui-pen-layer` 的 Installed 过渡和隐藏 | 非 scoped，canvas 由库直接插入，没有 scope 属性 |
| `Section.vue` | section/title 基础、中文 title、只保留自身的三组窄屏覆盖 | 一个 scoped 块，原 unscoped 权宜块移除 |
| `PageHead.vue` | title/long/foot 基础、中文排版、stroke、窄屏 foot/children/meta、lede | 一个 scoped 块，保留 section foot、kicker、lede 的原胜负 |
| `content/Statement.vue` | statement 基础、中文 tracking 和 line-height | scoped |
| `content/Final.vue` | final-title 基础、中文 tracking、lede 基础 | 合并回 scoped，原 margin 与 is-end 覆盖保留 |
| `EntryTitle.vue` | 中文 tracking | scoped。基础仍非 scoped，外部 changelog 等调用处仍有 scoped margin 覆盖 |
| `content/Price.vue` | price、amount、直接子 div 基础及各自窄屏布局 | 一个 scoped 块 |
| `palette/PaletteShowcase.vue` | Hero 后方 Section 的完整 measure、label/body、编号、窄屏 measure | scoped 选择兄弟 Section 根，deep 选择其 label/body |
| `AnimatedDetails.vue`、`content/Changes.vue`、`palette/PaletteTerminalReference.vue`、`palette/PaletteShowcase.vue` | `.lig-more`、闭合相邻折叠间距、trigger padding、展开标题 top | 每个实际使用者持有相同 scoped 规则，库 trigger 用 deep |
| `palette/PaletteAgentSetup.vue` | 折叠 CodeBlock 固定标题 top | `.lig-ui :deep(...)`，当前唯一传入 `collapsible` 的 CodeBlock 拥有者 |
| `palette/PaletteSyntax.vue` | swatch-groups 基础移至 semantic 覆盖前，families 与 Stage 相邻间距 | 同一 scoped 块，删除原 unscoped 基础块 |
| `palette/PalettePreviews.vue` | stage/editor 基础及860px 覆盖 | 一个 scoped 块，移除旧 mixed group 副本与 unscoped 权宜块 |
| `app.vue` | `.l-fill`、`page-enter-*`、`page-leave-*` | 非 scoped。App 拥有 NuxtPage，渲染函数和路由根不要求 App scope |

`.l-lede` 基础在三个真实拥有者 Hero、Final、PageHead 内各保留一份相同声明。四个折叠拥有者的规则同样有意重复，避免引入新组件、改 DOM 或把样式挂在偶然加载的消费者上。

### measure 所有权决定

`pages/index.vue` 仅渲染 `Sheet > PaletteShowcase`。实际 HeroFrame 与三个 Section 兄弟由 Showcase 创建，所以跨兄弟组归 Showcase，不放在路由页，也不新增布局组件。

编译示例：

```css
.lig-hero ~ .l-section[data-v-showcase] .l-label
```

Scope 落在拥有关系的 Section 根。其根上确有 Showcase 与 Section 的两个 scope，内部 label/body 只有 Section scope，必须用 deep。Hero 自己的 foot 和 tagline 则归 HeroFrame，不交给 Showcase 穿透修改。

### `:global()` 的编译陷阱

使用当前 Vue 3.5 的 `vue/compiler-sfc` 实测：

```text
:global(.has-bloom) .l-mark
  => .has-bloom
.has-bloom .l-mark
  => .has-bloom .l-mark[data-v-audit]
```

因此没有使用任务示例的“部分 global 祖先 + 普通目标”写法。普通祖先选择器本来就不会被 Vue 增加 scope，末端拥有元素才会被增加。html 的 JS 类和查 DOM 的代码均未改。

DocBody 的 MDC mark 是例外。它由 `shared/final-mark.ts` 直接产生，不带 AccentMark scope。基础使用 deep。状态使用完整 `:global(.has-bloom .l-mark)` 及完整 `:global(.has-stroke:not(.has-bloom) [data-anchor='final-mark'])`，不会丢掉目标，也不会错误地在 DocBody 里面寻找 html。它们的声明与 AccentMark 完全相同，保留原选择范围和特异性。

## 级联审计

以下特异性统一为 `(ID, class/attribute/pseudo-class, type)`。`S` 表示普通 scoped 目标统一增加 `(0,1,0)`。deep 的 scope 在祖先锚点，不加在库内部元素上。所有结论均核对过源码和编译输出，不依赖“规则集相同”推出。

### html 状态

| 覆盖关系 | 迁移前 | 迁移后与顺序 | 结论 |
| --- | --- | --- | --- |
| bloom 隐藏 `.l-mark` | 基础 `(0,1,0)`，状态 `(0,2,0)` | `(0,2,0)` 对 `(0,3,0)`，基础在前 | transparent 继续胜出 |
| stroke 且无 bloom 的 final mark | 状态 `(0,3,0)` 高于 mark 基础 | 状态 `(0,4,0)`，基础 `(0,2,0)` | 继续隐藏，bloom 排除条件不变 |
| 原始 MDC mark | 原全局基础 `(0,1,0)`，状态分别 `(0,2,0)`、`(0,3,0)` | deep 基础仍 `(0,1,0)`，完整 global 状态权重不变 | docs/notes 正文末尾标点保持样式 |
| handwritten tagline | 基础 `(0,1,0)`，状态 `(0,2,0)` | 基础 `(0,2,0)`，状态 `(0,3,0)` | absolute、字号、透明色和 user-select 保持 |
| palette handwritten right | 普通 hand `(0,2,0)`，palette `(0,3,0)` | `(0,3,0)` 对 `(0,4,0)`，palette 仍在后 | palette 专属右边缘继续胜出 |
| Hero/PageHead stroke 边线 | foot 基础 `(0,1,0)`，stroke `(0,2,0)` | 基础 `(0,2,0)`，stroke `(0,3,0)` | 原边线透明色保持 |
| 860px handwritten 边线恢复 | stroke `(0,2,0)`，窄屏 `(0,3,0)` | `(0,3,0)` 对 `(0,4,0)`，窄屏仍在后 | `var(--line)` 继续胜出 |
| footer 无 closing mark，无 hand | stop `(0,1,0)`，html 状态 `(0,4,1)` | stop `(0,2,0)`，状态 `(0,5,1)` | `:not()` 取内部分支最大权重，匹配条件不变 |
| footer 无 closing mark，有 hand且至少861px | html 状态 `(0,5,1)` | `(0,6,1)`，861px media 保留 | 窄屏手写仍保留文字 stop，宽屏隐藏 |
| release 无 hand | `html:not(.has-hand) .l-release` 为 `(0,2,1)` | `(0,3,1)`，只声明 grid-row | 仍为第二行，不干扰窄屏 grid-column |

### 中文排版与外部标题覆盖

| 覆盖关系 | 迁移前 | 迁移后与顺序 | 结论 |
| --- | --- | --- | --- |
| 普通 page-title、Section title、statement、final-title 的 tracking | 基础 `(0,1,0)`，中文 `(0,2,0)` | 基础 `(0,2,0)`，中文 `(0,3,0)` | 中文 tracking 继续为0 |
| 中文 long page-title 的 tracking | `.l-page-title.is-long` 与中文清零均 `(0,2,0)`，实际生成 CSS 中 long 基础在最后 | 两者均 `(0,3,0)`，中文清零刻意置于 long 基础前 | 保留实际赢家 `-0.03em`，不按旧报告误改成0 |
| 中文 long title 的行高 | long `(0,2,0)`，中文 long `(0,3,0)` | `(0,3,0)` 对 `(0,4,0)`，中文行高在后 | 继续为1.15 |
| 中文 statement 行高 | 基础 `(0,1,0)`，中文 `(0,2,0)` | `(0,2,0)` 对 `(0,3,0)` | 继续为1.15，英文行高不变 |
| section long 标题字号 | scoped section-long `(0,4,0)`，全局 long `(0,2,0)` | section-long仍 `(0,4,0)`，long变 `(0,3,0)` | section 专属字号仍胜出 |
| Final is-end 字号 | scoped end `(0,4,0)`，标题基础 `(0,1,0)` | end仍 `(0,4,0)`，基础变 `(0,2,0)` | end 仍胜出 |
| EntryTitle margin 与中文 | 基础 `(0,1,0)`，changelog标题 `(0,2,0)`，调用处中文 `(0,3,0)` | 基础不变，EntryTitle中文新为 `(0,3,0)`，调用处中文同值 | 保留 changelog 的14px top margin，其余调用者 margin不变 |

中文 long title 的差异由 `/tmp` 辅助比较实际发现。修正后覆盖28页的静态比较不再有声明值差异。这也纠正了前面报告中“中文组总会清零”的不准确推断。

### 窄屏混合组与原来覆盖失败的规则

| 覆盖关系 | 迁移前 | 迁移后与顺序 | 结论 |
| --- | --- | --- | --- |
| Hero foot / Section / Price 基础列数 | 基础全局 `(0,1,0)`，窄屏全局 `(0,1,0)`，组件内另有 scoped 副本 `(0,2,0)` | 基础与所属窄屏均 `(0,2,0)`，窄屏在后 | 仍为单列，删全局与其他组件的混合副本 |
| tagline、release、label、body、amount 的跨列 | 基础与窄屏类选择器，前批含 scoped 窄屏副本 | 所有者的基础 `(0,2,0)`，窄屏同权重且在后 | 继续全宽 |
| Hero foot slot lede/CTA | HeroFrame deep 基础与窄屏均 `(0,3,0)` | 权重不变，窄屏在后 | lede/CTA 全宽，CTA左对齐。删除 Hero 中重复的足部混合副本 |
| Price直接子div | 基础 `(0,1,1)`，scoped窄屏 `(0,2,1)` | 两者 `(0,2,1)`，窄屏在后 | 继续全宽 |
| PageHead普通 foot 列数与meta对齐 | foot `(0,1,0)`，meta `(0,2,0)`，同权重窄屏在后 | 各自加S，仍以窄屏后写取胜 | 普通 foot 单列，meta start |
| PageHead section foot列数 | section `(0,2,0)` 高于窄屏普通foot `(0,1,0)` | `(0,3,0)` 高于 `(0,2,0)` | 原先 section双列赢、窄屏单列输，结果保留 |
| PageHead section直接子元素 reset 对kicker | reset `(0,2,0)` 输给 scoped kicker `(0,3,0)` | reset与kicker都 `(0,3,0)`，把kicker放在reset之后 | kicker继续 span，不被重置为auto |
| PageHead reset 对lede | reset与lede原均 `(0,2,0)`，lede在后 | 两者均 `(0,3,0)`，lede仍在后 | lede的显式起列与span保持 |
| PageHead窄屏直接子元素 reset | `(0,1,0)` 低于kicker/lede | `(0,2,0)` 低于 `(0,3,0)` | 原来没有覆盖成功的reset仍不成功 |
| Section quiet 与普通padding | quiet scoped `(0,2,0)` 高于全局基础 `(0,1,0)` | 两者 `(0,2,0)`，quiet在后 | quiet top padding保留，downloads ID覆盖仍更强 |
| Section entry label padding | entry scoped `(0,4,0)`，窄屏同选择器后写 | 权重与顺序不变 | 普通entry窄屏padding-top仍为0 |

### Hero measure、palette 与折叠标题

| 覆盖关系 | 迁移前 | 迁移后与顺序 | 结论 |
| --- | --- | --- | --- |
| palette Hero foot measure 对foot基础gap | measure `(0,2,0)` 高于基础 `(0,1,0)` | `(0,3,0)` 高于 `(0,2,0)` | gap保持48px，1080px measure不变 |
| palette foot窄屏width/margin 对measure | 已scoped窄屏 `(0,3,0)` 高于全局measure `(0,2,0)` | 两者 `(0,3,0)`，窄屏刻意放在measure后 | 原width:auto与inset继续胜出 |
| Hero 与Section的--edge | 原混合组均为各自类权重，窄屏在后 | 各归所有者同时加S，窄屏仍在后 | 80/11vw/220与16/4vw/28的两档不变 |
| 兄弟Section measure 对Section基础 | 兄弟 `(0,2,0)` 高于基础 `(0,1,0)` | `(0,3,0)` 高于基础 `(0,2,0)` | measure、gap、padding-inline与counter规则继续生效 |
| 兄弟Section body/label 对自身基础 | 兄弟后代 `(0,3,0)` 高于scoped基础 `(0,2,0)` | deep后为 `(0,4,0)`，基础仍 `(0,2,0)` | body宽度、label颜色/字号/对齐与编号保持 |
| Section窄屏measure与label对齐 | 与宽屏兄弟组同权重，后写 | 仍同权重，后写 | width:auto、margin:0、padding:edge、text-align:start不变 |
| Syntax semantic 对swatch-groups | semantic scoped `(0,2,0)` 压过全局base `(0,1,0)` | 两者 `(0,2,0)`，base置于semantic及540px规则前 | gap为24px 16px，540px为两列，base仍提供28px top margin |
| Syntax 到Stage相邻间距 | 相邻 `(0,2,0)`，Stage没有margin基础 | 相邻 `(0,3,0)`，两根都带Syntax scope | 仍为32px |
| Previews stage与editor窄屏 | unscoped基础和窄屏同权重、后写 | 整族加S，窄屏后写 | 单列及边线保持。旧syntax-stage无使用者，登记删除 |
| lig-more相邻闭合间距 | base `(0,1,0)`，相邻 `(0,3,0)` | base `(0,2,0)`，相邻 `(0,4,0)` | 闭合相邻仍为0，前一项可由其他组件创建，不给它加scope |
| 相邻trigger padding 对AnimatedDetails基础 | 相邻 `(0,4,0)` 高于animated deep基础 `(0,3,0)` | 相邻 `(0,5,0)`，animated基础仍 `(0,3,0)` | 8px继续覆盖22px，不被新顺序反转 |
| Collapsible固定标题top 对库基础 | 项目 `(0,4,0)` 高于库 `(0,3,0)` | 项目deep `(0,5,0)` | banner offset继续覆盖top:0 |
| CodeBlock固定标题top 对库基础 | 项目 `(0,5,0)` 高于库 `(0,4,0)` | 项目deep `(0,6,0)` | AgentSetup展开标题仍位于notice下方 |

### Installed、Transition、reduced-motion

| 覆盖关系 | 迁移前 | 迁移后与顺序 | 结论 |
| --- | --- | --- | --- |
| main、header、footer的淡出 | transition各自为全局type/class，状态多一个class | main `(0,1,1)`、header/footer `(0,2,0)`，状态分别 `(0,2,1)`、`(0,3,0)` | opacity:0、pointer-events:none与1.2s过渡保持 |
| pen canvas淡出 | base `(0,1,0)`，状态 `(0,2,0)` | 非scoped原权重保留 | 无scope的动态canvas仍命中，html状态不会落到错误祖先 |
| html滚动锁 | `.is-installed` `(0,1,0)` | 布局非scoped，权重与选择器不变 | overflow:hidden保持，JS类不改 |
| Installed自身 | 既有scoped base与state | 文件未改 | 显示/延迟/返回按钮行为不动 |
| page Transition | active/from/to均 `(0,1,0)` | App非scoped，权重和原先后关系不变 | 不要求路由根有App scope，0.35s及opacity保持 |
| theme-bar translate | base与enter-from/leave-to均 `(0,1,0)`，Transition在后 | 均 `(0,2,0)`，同文件同scope，Transition仍在后 | 入退场位移不会被基础translate覆盖 |
| reduced-motion重置 | 全局 `*, *::before, *::after` 的duration为 `!important` | 原selector、media、声明、important数量和范围不变 | 继续压过本次提高特异性的普通transition/animation |
| Shiki配色和背景 | 原有important变体覆盖 | 原封不动移入base文件 | 四变体与系统暗色fallback不变 |

本批没有移动跨文件引用的 keyframes。原 CTA、表格等 scoped keyframes 和其引用不改。没有新增或扩大 `!important`。

## 混合组拆分对照

同一行中每个拆分项保留原 media 和完整声明。因此原混合规则等于这些项的并集，不增加新的声明组合。

| 原混合组 | 拆分后的所有者与选择器 |
| --- | --- |
| `:lang(zh) .l-page-title, .l-title, .l-statement, .l-final-title, .l-entry-title`（每项均带`:lang(zh)`） | PageHead、Section、Statement、Final、EntryTitle各取自己的一项 |
| `:lang(zh) .l-page-title.is-long, :lang(zh) .l-statement` | PageHead与Statement各取一项 |
| `main, .l-top, .l-foot` 的transition | default布局main、SiteHeader的top、SiteFooter的foot |
| `.is-installed main, .is-installed .l-top, .is-installed .l-foot, .is-installed .ui-pen-layer` | 布局、Header、Footer、Sheet各取一项 |
| 860px的`.l-hero-foot, .l-page-foot, .l-section, .l-price` | HeroFrame、PageHead、Section、Price各取一项 |
| 860px的`.l-tagline, .l-release, .l-hero-foot .l-lede, .l-hero-foot .l-cta, .l-page-foot > *, .l-label, .l-body, .l-amount, .l-price > div` | HeroFrame取tagline与foot两个deep后代，Hero取release，PageHead取直接子元素，Section取label/body，Price取amount/div |
| 860px的`.l-tagline, .l-hero-foot .l-cta, .l-page-foot .l-meta, .l-label, .l-amount` | HeroFrame取前两项，PageHead取meta，Section取label，Price取amount |
| `.lig-hero, .lig-hero ~ .l-section`，含860px的--edge组 | HeroFrame取Hero，Showcase取兄弟Section |
| `.lig-hero .l-hero-foot, .lig-hero ~ .l-section` 的measure | HeroFrame取foot，Showcase取Section |
| `.ui-collapsible.lig-more.is-open > .ui-collapsible-trigger, .lig-ui .ui-code-block.is-collapsible.is-open > .ui-code-block-header` | 四个Collapsible拥有者取trigger，AgentSetup取code header。库内部节点deep |
| 860px的`.lig-stage, .lig-stage-syntax` | Previews取stage，syntax项确认死规则后登记删除 |

page Transition的两组、theme-bar两组、reduced-motion通配组和其他未涉及所有权拆分的组保持原组。

### 规则检查脚本的必要调整

原脚本把整个逗号选择器组当成一个set key。合法拆分也会被报成lost/new。因此 `scripts/css-rules.mjs` 现在同时对源码和原baseline按顶层逗号展开，再比较 `(media等上下文, 单个selector, 原完整声明)`。

- 没有重写baseline，没有加入针对某个业务选择器的白名单。
- 不拆`:not()`、`:has()`、属性字符串内的逗号，保留转义。keyframes、property等at-rule整体不拆。
- 不改变declarations或media的归一化，不把声明逐项拆散，不掩盖声明值、important或media变化。
- 原baseline的617个组展开后为731个单选择器规则。已有choice/pages删除清单展开后63项，本批另删8项，共71项。剩余660项，无lost/new。
- 在内存执行断言验证嵌套函数、属性字符串逗号、转义逗号、at-rule和不同media的区分，没有新增测试文件。

## 有意保留的非 scoped / global 例外

1. `EntryTitle.vue` 的基础块。changelog及其他调用处仍在外部拥有margin等覆盖。直接提高基础权重会让margin依赖chunk顺序，不把这个问题转移给调用者。
2. `app.vue` 的Fill和page Transition。Fill/Stop/Copy渲染函数没有统一scope，App本身是fragment。NuxtPage的Transition类在路由根，不能要求它们带App scope。
3. `layouts/default.vue` 的html滚动锁。html在布局根之外，保留原选择器。
4. `Sheet.vue` 的动态pen层。库直接prepend canvas，未带scope。保留原两条选择器，避免deep锚点放在html状态之前而失配，也不额外加祖先改变原规则范围。
5. `DocBody.vue` 两条完整`:global(...)`状态规则。原始MDC标点没有AccentMark scope，deep只负责基础，完整global负责外部html状态。原状态本就全局覆盖相同类族，没有扩展目标。
6. `AnimatedDetails.vue` 原有 `@property --rule-end` 注册保持非scoped，不改注册语义。
7. `PaletteParsedCode.vue` 原有非scoped块不动。Reka Popover把class转发到body portal内部，library close button和定位wrapper不在本组件scope祖先下。这是实际portal边界，不是等待全局覆盖的权宜块。原混合组还覆盖独立Terminal的header，继续保留原低特异性与声明。

HeroFrame、AccentMark、Section、PageHead、Footer、Hero、Final、Statement、Price、Previews、Syntax的临时低特异性块已合并回scoped。没有为了消除最后这些明确边界而改渲染函数、portal或DOM。

## 删除的死选择器

已全仓库检索，包括`content/`、shared hook、动态渲染代码和库。旧报告与baseline中的文字不算引用。

```text
.lig-syntax-lede
.lig-stage.lig-stage-syntax
.lig-stage-syntax .lig-editor
.lig-stage-syntax .lig-editor + .lig-editor
.lig-source-palette > .lig-palette-column > .lig-palette-heading
.lig-source-palette .lig-palette-heading > span:last-child
.lig-stage-syntax
.lig-oklch-title
```

逐行登记在 `scripts/css-rules.removed-final.txt`。

syntax-lede、syntax-stage、oklch-title没有模板、内容或动态生成者。Source里的palette-column实际只包含NeutralRibbon，另一侧为Oklch，不再包含palette-heading。palette-heading仍存在于Syntax里，但不处在Source选择器的祖先关系下，所以只删除失去结构的两个上下文规则，没有删除heading本身。

没有把未使用路由组件中的样式全部视为死规则。Previews、SemanticTable等仍保留自己的完整样式。没有删除Transition类或router运行时类。

## 验证命令与结果

以下命令实际执行，均在Mini当前worktree。`mise exec --`仅用于选择项目Node，后面的pnpm命令与任务要求相同。

### 构建、DOM、规则集

```sh
mise exec -- pnpm generate
python3 scripts/dom-compare.py /tmp/lig-dist-base dist
mise exec -- node scripts/css-rules.mjs
```

- generate退出码0，`Prerendered 80 routes`，`Generated public dist`。
- DOM：`28 pages compared, 0 differ`。没有修改比较脚本或放宽忽略项。
- 规则集：`660 rules, baseline 731, lost 0, new 0, removed on purpose 71`。71包括既有删除63项和本批8项，不是本批删了71条。

### 格式、lint、类型

所有修改且仍存在的文件显式传入格式检查。命令列在下面，删除的两个文件无内容可检查。

```sh
mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check \
  app/assets/css/base.css app/app.vue \
  app/components/AccentMark.vue app/components/AnimatedDetails.vue \
  app/components/DocBody.vue app/components/EntryTitle.vue \
  app/components/HeroFrame.vue app/components/PageHead.vue app/components/Section.vue \
  app/components/Sheet.vue app/components/SiteFooter.vue app/components/SiteHeader.vue \
  app/components/content/Changes.vue app/components/content/Final.vue \
  app/components/content/Hero.vue app/components/content/Price.vue \
  app/components/content/Statement.vue \
  app/components/palette/PaletteAgentSetup.vue \
  app/components/palette/PalettePreviews.vue app/components/palette/PaletteShowcase.vue \
  app/components/palette/PaletteSyntax.vue \
  app/components/palette/PaletteTerminalReference.vue \
  app/components/palette/PaletteThemeSwitch.vue \
  app/layouts/default.vue nuxt.config.ts scripts/css-rules.mjs \
  scripts/css-rules.removed-final.txt docs/plans/2026-10-22-scoped-styles-final.md
mise exec -- pnpm lint
mise exec -- pnpm typecheck
git diff --check
```

格式通过。项目配置排除`docs/plans/**`，txt不是格式化器支持的类型，二者已显式传入并人工审查。首次格式检查指出Sheet空行和检查脚本链式换行，修正后重跑通过。

lint为 `Found 0 warnings and 0 errors.`。typecheck退出码0。已有og-image `Unknown Nitro preset "static"` 警告仍存在，没有改配置消警告。构建已有的h3未使用导入警告不属本次CSS范围。`git diff --check`无输出。

### 编译、源码和静态级联补充检查

```sh
mise exec -- node /tmp/lig-final-cascade.mjs
```

临时脚本仅在`/tmp`，没有提交或安装依赖。使用已安装的parse5、postcss、selector parser与css-select读取迁移前后生成HTML，按实际style/link顺序比较受影响类族的声明赢家。覆盖28页、16种html的bloom/stroke/hand/installed组合、540/860/861/1200px、reduce开关，共3584组，`differences: 0`。

这个检查只算静态选择器、特异性、顺序与声明值，不是浏览器layout或computed style。它不替代继承/字体/像素布局、hover/focus、动态portal、未渲染的canvas、路由Transition或当前未调用组件的手动验收。它按light和非forced-colors比较，主题与forced-colors则通过源声明不变和规则集核对。

另通过内存命令完成：

- `vue/compiler-sfc` 编译修改SFC全部style，无编译错误。专门断言状态目标仍有scope、html没有被错误加scope、Showcase深层选择器锚定Section根、theme-bar基础在Transition前、DocBody deep/global输出正确。
- Python比对23个修改SFC去除style后的源码，与HEAD的script/template完全一致。
- `git diff HEAD -- vendor/ui scripts/css-rules.baseline.json` 为空。
- 生成HTML确认Showcase的Section根有双方scope，label/body只有Section scope，theme switch的slot按钮由自己创建。
- 选择器拆分函数的嵌套/字符串/转义/at-rule断言通过。

### 旧引用检查

```sh
grep -rn "kit.css\|palette.css" app nuxt.config.ts docs/viteplus.md AGENTS.md
```

无输出，grep退出码1表示没有匹配。`AGENTS.md`和`docs/viteplus.md`原本就没有旧文件名，无需修改。历史批次报告保留当时文件名，不重写历史。

## 用户手动验收清单

- 中英文首页，540、860、861、1200px附近的Hero、tagline、Source/Syntax/Ports、label罗马编号、body宽度、左右measure与滚动定位。
- 开关handwriting、stroke、bloom。Hero与PageHead边线隐藏、860px窄屏恢复，tagline右缘和字号，release第二行与跨列。
- 有closing mark和无closing mark的页面，正文末尾原始MDC标点、标题标点与footer stop。核对窄屏handwriting的footer文字保留。
- 普通/long/section页头的中文tracking和行高。中文long仍保留`-0.03em`，行高1.15。kicker span、lede起列、meta对齐及section原双列行为不变。
- EntryTitle在changelog、notes列表、下一篇中的margin，尤其changelog顶部14px。Final普通/end标题、Statement中文行高、Price窄屏跨列。
- variant switch的默认、active、hover、键盘focus，头部与浮动主题条两份布局。滚动触发theme-bar入场/退场，切换路由page淡入淡出。
- Installed触发、淡出main/header/footer/pen、滚动锁、确认态延迟、Escape与返回恢复。
- 折叠内容的相邻闭合间距、8px紧凑trigger、展开后空间、notice下固定标题，AgentSetup展开CodeBlock的top。
- Syntax四列/540px两列、gap、到Stage的32px间距，复制/下载操作应保持。
- 空字段的Fill占位大小、颜色、内联对齐与名称。包括直接打开内页和错误页。
- reduced-motion、forced-colors、系统light/dark与四个palette variant，尤其Shiki颜色/粗斜体/装饰。
- 若启用当前无路由引用的Previews，人工核对860px两侧的列数、editor边线和40px top margin。静态28页不覆盖其实际渲染。
- 直接加载内页、从首页进入再返回、切换语言后重复上述关键行为，确认异步CSS加载不改变赢家。

没有写UI测试，没有使用浏览器或computer use。无待用户裁决的产品/结构决定。确定性偏离只有经当前编译器验证的`:global`写法，以及按实际CSS证据保留的中文long tracking，均已明确记录。
