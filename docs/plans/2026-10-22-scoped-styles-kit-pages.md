# 页面、Docs 与 Changelog 样式迁移记录

本批沿用总计划、batch 2 和 color-table 的做法。只修改页面组拥有的样式、`kit.css` 中对应的删除行、死规则清单和本报告。没有改模板、脚本、类名、DOM、`vendor/ui` 或 CSS baseline。

## 实施步骤

1. 阅读全部页面、DocBody、DocsSidebar、SectionLayout、ChangelogTimeline、ChangelogRelease、PageHead、RichText 和 error，以及 Section、HeroFrame、EntryLink、Sheet 和 Changes。
2. 检索 `app/`、`content/` 和仓库中的类族，检查全部全局 CSS、现有 SFC style、中文组、窄屏组与 html 状态覆盖。
3. 整族迁移独占规则。现有 scoped 规则保留在前，新规则按原 `kit.css` 相对顺序追加。需要保持特异性的基础规则放在 PageHead 的非 scoped 块，并注明原因。
4. 构建后对比 DOM 和规则集，审查生成 CSS 与 HTML 的 scope、规则顺序和特异性，检查格式、lint、类型后提交。

## 组件与规则

没有新增组件、props、slot、事件或包装元素。

| 位置 | 本批迁移 |
| --- | --- |
| `PageHead.vue` scoped | `l-page-head`、`l-page-head.is-section`、`.is-section .l-page-title.is-long` |
| `PageHead.vue` 非 scoped | `l-page-title`、`l-page-title.is-long`、`l-page-foot`、section foot 的列数及直接子元素重置、foot 内 lede 与 meta |
| `notes/index.vue` scoped | `l-more`、箭头伪元素、`small`，追加在原有 notes 样式之后 |
| `DocBody.vue` scoped | `l-notes ul`、`li`、`li:first-child`，正文元素使用 `:deep()` |
| `pages/[...slug].vue` scoped | `.l-page > :deep(:not(section))`，保留原 Markdown 注释 |

`kit.css` 只删除 129 行，没有重排或格式化其他规则。迁移 17 条规则，另删除 3 条死规则。DocBody 原有 notes 规则保留在前，迁入的版本保留原声明及顺序，包括 ul 的 `color: var(--muted)`。

Docs 的正文、导航、标题、pager，Changelog 的版本标题与时间线，以及 SectionLayout 的 `l-section-*`、`l-banner*` 在开始时已是 scoped。本批没有重复迁移或修改这些组件。`RichText.ts` 只生成内联 code，没有独占的 `kit.css` 规则。error 通过 PageHead 与 CtaLink 获得样式，不需要新增 style。

## 共用/留下的规则

- `.l-lede` 还用于 Hero、Final，基础规则原样留在 `kit.css`。本批只迁 PageHead 拥有的上下文规则。
- 中文的两个原混合 selector group 留在 `kit.css`。它们还包含 `l-title`、`l-statement`、`l-final-title`、`l-entry-title`，不拆组。
- 三个 `max-width: 860px` 混合 selector group 原样留在 `kit.css`。它们还包含 Hero、Section、Price、release 等其他所有者。
- PageHead 的非 scoped 块末尾保留这三个窄屏混合组的相同副本。否则迁入的 foot 基础会晚于全局窄屏规则，平特异性的列数和 meta 对齐会反转。没有拆分原组，也没有从 `kit.css` 删除这些组。
- `html.has-*`、`html.is-installed`、`[data-anchor='rule']` 状态规则原样留下。基础变量、重置、滚动条、html/body、forced-colors、Shiki、reduced-motion 均未改动。
- “Each page is a new sheet” 是 Nuxt 的 `page-*` 过渡类，按本批要求保持全局，包括原注释。
- `.l-final.is-end` 属于 Final，安装页、Installed、CopyCommand、Fill、外框、Paper、Sheet、头尾规则不动。
- `.lig-more` 和 `.ui-collapsible` 混合组留在 `palette.css`。Changes 使用它们，本批不迁移库内部控件样式。
- `l-copy`、`l-entry*` 已由前批 Prose、EntryTitle、EntryLink 等拥有。现有页面覆盖保持原样，不重新引入基础规则。

非 scoped 窄屏副本仍是全局规则，声明与全局原组完全相同。其他拥有者已有的 scoped 覆盖和 palette 更具体的覆盖继续胜出。最终清理全局混合组时应同时整理这些副本。

## 删除的死规则

全仓库检索 `l-prose`，包括 `content/`、`vendor/`、脚本与文档。使用处只有待删 CSS，此外是 baseline 和旧迁移报告中的说明，没有模板、Markdown、渲染函数或动态生成类名的引用。

已在 `scripts/css-rules.removed.txt` 登记：

```text
.l-prose
.l-prose p
.l-prose .l-excerpt
```

`l-excerpt` 本身仍由 notes 详情使用，DocBody 现有 `.l-doc :deep(.l-excerpt)` 不变。没有删除 Transition 或 router 的运行时类。

## 级联风险

以下结论来自源码、Vue 编译后的 CSS 和生成 HTML，没有浏览器视觉验证。

1. PageHead 的普通与 section head 基础一起 scoped，section 的 min-height 和 padding 继续更具体。section long 标题的字号规则继续高于普通 long 标题。
2. 标题基础与 long 基础保持非 scoped。中文混合组的 `letter-spacing: 0` 继续胜出，中文 long 标题的 `line-height: 1.15` 继续高于基础 `0.95`。没有因新增 scope 而变为平特异性、依赖加载顺序。
3. foot 保持非 scoped，`.has-stroke [data-anchor='rule']` 继续高于基础 border。窄屏 `.has-hand.has-stroke [data-anchor='rule']` 继续恢复边线。状态选择器和 JS 切换类均未改动。
4. foot 的宽屏 grid 与 meta 对齐，和窄屏混合组原本存在平特异性。混合组副本放在 PageHead 非 scoped 基础之后，保证窄屏的单列与 `justify-self: start` 仍由后写规则胜出。编译 CSS 中确认顺序仍是基础在前、窄屏副本在后。
5. `.is-section .l-page-foot` 保持非 scoped，两个 class 仍高于窄屏 `.l-page-foot` 的一个 class。原来 section 双列基础赢、窄屏单列覆盖输，本批保留这个结果。
6. `.is-section .l-page-foot > *` 保持非 scoped，不能因新增 scope 而追平并覆盖已有 scoped `.l-page-foot .l-kicker`。kicker 继续使用 `span var(--span-margin)`。窄屏直接子元素组也更弱，不能覆盖 kicker 或 lede 的显式 grid-column。原来这些基础赢、通用覆盖输的结果不变。
7. notes 的 `l-more` 与已有的字号、muted 颜色归同一 scoped 块。字号声明相同，新增基础不清除颜色。small 由本页面模板生成，正常 scoped 能命中。EntryLink 的 deep hover 箭头规则保留，但当前 notes 列表使用 `l-note-entry`，不新增原来不存在的箭头位移动效。
8. DocBody 的 ul/li 来自 ContentRenderer 和 Changes 的 slot，使用 `:deep()`。迁入的 notes 声明与原 scoped notes 声明一致，只补上原全局 ul 的 muted 颜色。与 `.l-doc` 的正文间距规则同样增加 scope，notes 在后继续胜出。Changelog 的 `.l-version :deep(.l-changes ul)` 三个 class 等价权重仍更高，`margin-top: 0` 继续胜出。
9. Markdown 页的 `.l-page` 是 ContentRenderer 输出根，生成的 install 中英文 HTML 都确认有路由页的 scope 属性。其直接子元素由 MDC 生成，不要求它们带 scope。编译结果为 `.l-page[data-v-*]>:not(section)`，没有增加包装元素。Sheet slot 不阻止 ContentRenderer 根接收该 scope。
10. `RichText`、Fill、Stop 输出的内部元素不作为本批普通 scoped 选择器的目标。PageHead 选择自己的 h1/p，notes 的 small 由页面生成，DocBody 正文与 Markdown 后代使用 deep。error 的 NuxtLayout/Sheet 插槽内容继续由 PageHead 自己提供 scope。
11. 本批没有独占 keyframes、supports 或新的 animation 引用。全局 reduced-motion 的原有 `!important` 继续生效，没有新增 `!important`。

## 验证

命令通过 `mise exec --` 使用 Node `v24.21.0`。开始时工作树干净，已有 `/tmp/lig-dist-base`，没有重建或覆盖基线。

- `mise exec -- pnpm generate`：退出码 0，80 个 prerender routes。曾有一次重复并发调用被 Nuxt build lock 拒绝，未绕过锁，最终使用串行构建验证。
- `python3 scripts/dom-compare.py /tmp/lig-dist-base dist`：`28 pages compared, 0 differ`。脚本原有忽略项未改动。
- `mise exec -- node scripts/css-rules.mjs`：`614 rules, baseline 617, lost 0, new 0, removed on purpose 3`。脚本读取源码规则集合，不验证命中和级联，所以另查生成 CSS 与 HTML。
- `mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/kit.css app/components/PageHead.vue app/components/DocBody.vue 'app/pages/[...slug].vue' app/pages/notes/index.vue scripts/css-rules.removed.txt docs/plans/2026-10-22-scoped-styles-kit-pages.md`：通过。实际格式检查 5 个源码文件，报告被项目配置排除，txt 不属于格式化器处理类型，二者人工审查。
- `mise exec -- pnpm lint`：0 warnings、0 errors。
- `mise exec -- pnpm typecheck`：通过。原有 og-image `Unknown Nitro preset "static"` 警告仍存在。
- 用 Python 标准库读取生成 HTML 与 CSS，确认 install 的 l-page scope、DocBody 的 deep ul/li、notes 的普通 scoped small，以及 PageHead 标题和 foot 的非 scoped 输出、窄屏组顺序。
- `git diff --check`：通过。

没有添加 UI 测试，没有用浏览器或 computer use。DOM 和规则集检查通过不等于浏览器视觉验证。

## 手动验收

- 中英文 docs、notes、changelog 与 404 的大标题、中文长标题行高与字距、section 页头的留白。
- 宽窄屏页头 kicker、lede、meta 的列位置，日期与计数的对齐，特别是原有 section 双列及 kicker span。
- 开关手写、pen 与 bloom 时，页头分割线的隐藏和窄屏恢复。
- notes 列表的阅读链接、箭头、阅读分钟数顺序、字号、颜色与 hover。
- Changelog 展开和折叠，列表首项边线、项目间距、muted 颜色及分组顶部间距。
- docs 的正文、侧栏与 pager，notes 详情摘要与下一篇。它们不应因移走全局 notes/prose 规则而变化。
- install 中英文直接页面 Markdown 的宽度、左右边距，内容 section 不受该规则影响。
- 直接打开内页与客户端切换路由，切换主题与 variant，窄屏 resize 和 reduced-motion。

没有待用户决定的事项。PageHead 的非 scoped 基础和完整窄屏混合组副本是保持原级联的明确取舍，留待全局收尾时一起收紧。本批只本地提交，不推送、不执行 subtree。
