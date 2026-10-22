# 内容块与安装页样式迁移记录

本批沿用总计划、batch 2 和 color-table 的范围与验证约定。只修改内容块和安装组件拥有的样式，没有改动模板、脚本、类名、DOM 或 `vendor/ui`。

## 实施步骤

1. 读取根目录规则、前三份计划、全部指定组件及其原语和渲染函数，检索 `app/`、`content/` 和全仓库的类族引用。
2. 检查 `kit.css`、`palette.css` 和 SFC 覆盖关系。按拥有组件迁移规则，保留已有 scoped 规则在前，新规则在各块内按原顺序追加。
3. 保留全局混合组，处理中文排版、html 状态和窄屏特异性，检查 Vue 编译后的实际选择器。
4. 执行 DOM、规则集、格式、lint、类型和静态构建检查，审查 diff 后提交。

## 规则迁移

| 组件 | 迁入规则 |
| --- | --- |
| `content/Hero.vue` | `l-release` 基础、span 字体、hover，完整窄屏 grid-column 混合组副本 |
| `content/Final.vue` | `l-final`、`l-final-title`、内部 `l-lede` margin、`is-end` 两条覆盖 |
| `content/Statement.vue` | `l-statement` 基础 |
| `content/Quotes.vue` | `l-quotes`、`l-quote`、blockquote、figcaption、窄屏单列 |
| `content/Figures.vue` | `l-specs`、`l-spec`、dt/dd、`l-figure`、small、窄屏双列 |
| `content/Price.vue` | `l-price`、`l-amount`、small、直接子 div、`l-facts` 整族，三组完整窄屏混合组副本 |
| `content/Faq.vue` | `l-qa` 内 details、summary、marker、加号、open、code、p |
| `CopyCommand.vue` | “Install page” 注释及 `l-command` 整族 |
| `Installed.vue` | `l-installed`、组件自身的 installed 状态覆盖、`l-installed-title`、`l-back` 整族 |

从 `kit.css` 仅删除 298 行，没有插入、重排或格式化其余规则。`Figures` 原有 `.l-spec .l-copy` 保持在 scoped 块最前。原 `.l-figure` 的 `!important` 原样搬迁，没有新增 `!important`。本批没有 keyframes 或 supports 需要迁移。

`l-release`、`l-final-title`、`l-statement`、`l-price`、`l-amount` 和 `.l-price > div` 的基础规则放在拥有组件的非 scoped 块中，并注明特异性原因。其余迁入规则 scoped。完整窄屏混合组副本沿用 batch 2，不拆 selector group，规范化后不增加规则集。

## 共用/留下的规则

- `l-lede` 基础还被 `PageHead`、Hero 和 Final 共用，留在 `kit.css`。本批只迁移 Final 内部的 margin 覆盖。
- `l-fill` 的 “Empty copy” 段落留在原位。它由 `Fill.ts` 和 `Stop.ts` 的 `placeholder()` 生成，还被 `Copy.ts` 间接使用，跨页面、布局和范围外组件生效。渲染函数没有 scope，不能只搬进本批任一 SFC。没有改这些渲染函数。
- “Plain markdown inside a block” 已在 batch 2 迁入 `Section.vue`，使用 `.l-body > :deep(p:not([class]))`。本批不改 `Section`，不在 `Block` 重复。
- `l-changes` 的 ul 上下文覆盖已经在 `pages/changelog.vue`，`lig-more` 的公共外观归其他批次。`Changes.vue` 没有独占的 kit 规则可搬。
- `Step`、`Block`、`ProsePre`、`InstallLink` 的现有行为和样式未改。其外观分别由原语、已 scoped 的代码框或调用处提供。
- 中文 `:lang(zh)` 两个混合组原样留在 `kit.css`，涉及范围外标题。
- 三个窄屏混合组原样留在 `kit.css`，涉及 HeroFrame、页面和 Section。Hero、Price 只增加完整 scoped 副本，未拆组或删除原组。
- `html:not(.has-hand) .l-release`、全部 `has-*` 规则及跨组件 palette 兄弟规则原样保留。
- `.is-installed` 的滚动锁、`main/.l-top/.l-foot` 过渡混合组、隐藏页面与 `.ui-pen-layer` 的混合组保留全局。这里只迁移 Installed 自身显示状态。
- 全局基础、主题变量、滚动条、forced-colors、Shiki、reduced-motion、`page-*` 以及其他 worker 拥有的规则均未改动。

没有删除死规则。`scripts/css-rules.removed.txt` 和 baseline 均未修改。

## 级联风险

以下结论来自源码、Vue 编译输出和生成产物，没有浏览器视觉验证。

1. 中文组的 `:lang(zh) .l-statement` 原本高于基础类，清除字距并把行高设为 1.15。Statement 基础保持 unscoped，避免提高特异性后打平。Final 标题同理，继续由中文组清除字距。
2. Final 的基础 padding 与 `is-end` padding 一起迁入 scoped 块，`is-end` 更具体。小标题字号覆盖仍高于 unscoped 标题基础。共享 `l-lede` 的颜色和最大宽度保留全局，Final margin 覆盖继续胜出。
3. release 的基础 grid-column 与全局窄屏混合组原本同特异性，窄屏组靠后胜出。仅使用 unscoped 基础仍有异步加载顺序风险，因此组件内复制完整 scoped 窄屏组。release 的 span 和 hover scoped，span 使用 `:deep()`，包括 Fill 输出的占位 span。原 html 状态只设置 grid-row，与 scoped span/hover 不冲突。
4. Price 的九列基础、amount 跨五列和右侧 div 从第六列起步，原本分别被窄屏同特异性组覆盖。基础保持 unscoped，组件中完整复制三组 scoped 窄屏规则，确保单列、全宽和左对齐不依赖 CSS 加载顺序。没有只抽出混合组里的 Price selector。其余组件的元素没有 Price scope，不扩大命中。
5. Figures 的 grid 与窄屏双列同在 scoped 块，窄屏规则在后。`.l-spec dd` 原本靠特异性设置 margin 0，但输给 `.l-figure` 原有的 `!important`。迁移后仍如此，没有修掉这条历史规则。原有 `.l-spec .l-copy` 继续命中 Prose 子组件根，字号和宽度优先于 Prose 基础。
6. Quotes 的 grid 与窄屏单列一起 scoped，原覆盖顺序不变。blockquote、figcaption 都是自身模板元素，普通 scoped 能命中。
7. FAQ 的 summary code 由 `RichText.ts` 生成，不带 scope，改成 `.l-qa summary :deep(code)`。编译结果为 `.l-qa summary[data-v-*] code`。summary/details/p 和伪元素由本组件生成，直接 scoped。code 的 0.72em 继续高于全局 code 的 0.86em，open 的旋转继续高于基础状态。
8. Installed 基础 opacity 0 和 installed 的 opacity 1、pointer-events、delay 在同一 scoped 块。Vue 只给选择器末端的 `.l-installed` 加 scope，`.is-installed` 祖先保持无 scope，继续匹配 JS 切换的 html 状态。编译确认是 `.is-installed .l-installed[data-v-*]`。没有使用会丢弃后续 selector 的 `:global(.is-installed) .l-installed` 写法。
9. CopyCommand 的 code、button 都是自身模板元素，普通 scoped 命中。button hover 与基础在同一块，颜色覆盖不变。全局 code 字体及 focus-visible 继续提供原有样式。
10. 全局 reduced-motion 的原有 `!important` 继续覆盖本批过渡时长。没有改写这些规则或添加新动画。
11. 本批未发现其他“原基础赢、覆盖输”的独立冲突。Figures 的普通 margin 输给既有 important 已在第 5 项记录，未顺手调整。

## 验证

Node 命令均使用 `mise exec --`，Node 为 `v24.21.0`。开始时工作树干净，已有 `/tmp/lig-dist-base`，没有重建或覆盖基线。

- `mise exec -- pnpm generate`：退出码 0，生成 80 个 prerender routes。
- `python3 scripts/dom-compare.py /tmp/lig-dist-base dist`：`28 pages compared, 0 differ`。
- `mise exec -- node scripts/css-rules.mjs`：`617 rules, baseline 617, lost 0, new 0, removed on purpose 0`。
- `mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/kit.css app/components/CopyCommand.vue app/components/Installed.vue app/components/content/{Faq,Figures,Final,Hero,Price,Quotes,Statement}.vue docs/plans/2026-10-22-scoped-styles-content-blocks.md`：通过。配置忽略 `docs/plans/**`，实际检查 10 个源码文件，报告人工审查。
- `mise exec -- pnpm lint`：0 warnings、0 errors。
- `mise exec -- pnpm typecheck`：通过。已有 og-image `Unknown Nitro preset "static"` 警告仍存在。
- 使用 `vue/compiler-sfc` 的 `compileStyle` 断言 Installed 状态、FAQ code、Hero span、Figures dd 和 figure 编译选择器，退出码 0。初次从 `@vue/compiler-sfc` 导入因非直接依赖失败，改用已安装 Vue 的 `vue/compiler-sfc` 导出完成检查，未安装依赖。
- Python 源码核对：所有修改 SFC 去掉 style 后与 HEAD 完全相同。`kit.css` diff 只有删除。
- `git diff --check`：通过。

规则集脚本实际读取源码并规范化 scope，不验证命中、加载顺序或视觉。DOM 脚本忽略 scope、注释和构建资源节点。没有写 UI 测试，没有使用浏览器或 computer use。

## 手动验收

- 中英文 Hero release 的版本字体、hover、宽屏和 860px 以下的位置，开启/关闭手写状态时的行位置。
- Final 普通版和 `is-end` 的留白、标题字号、中文标题字距、lede 和 CTA。
- Statement 中文行高和字距，英文行高，多行与空文案占位。
- Figures 宽屏列数、窄屏双列、数字上下 margin、单位及说明宽度。
- Quotes 宽屏多列、窄屏单列、引文和署名间距。
- Price 宽屏九列分布，窄屏单列和全宽，金额、周期、facts 边线和左右对齐。
- FAQ 展开/关闭、加号旋转、原生 marker 隐藏、问题内 code 字号、键盘焦点。
- 安装页命令横向滚动、复制按钮 hover、复制结果文案和恢复。
- 触发 installed 后页面淡出、滚动锁、确认文案延迟显示、返回按钮自动聚焦和恢复页面。
- 明暗/paper variants、reduced-motion、直接打开内页与客户端路由切换，检查以上行为一致。

没有待用户决定的事项。完整混合组副本及 unscoped 基础是保留现有级联的明确取舍。未推送，未执行 subtree。
