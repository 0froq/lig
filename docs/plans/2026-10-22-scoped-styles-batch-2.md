# 共用布局原语迁移记录

本批沿用总计划。后续确认允许整族迁移 `palette.css` 中的覆盖规则，并允许必须保持原特异性的基础规则放在拥有组件的不带 `scoped` 的 `<style>` 中。

## 组件与使用者

新组件均在 `app/components/`，没有改动 `vendor/ui`。

| 组件 | Props | Slots | 使用者 |
| --- | --- | --- | --- |
| `Section` | `id?`、`entry?` | `label`、可选 `title`、默认 body | `content/Block.vue`、`palette/PaletteShowcase.vue` |
| `HeroFrame` | `length`、`wordClass?`、`wordLabel?` | `word`、`tagline`、默认 foot 内容 | `content/Hero.vue`、`palette/PaletteShowcase.vue` |
| `AccentMark` | `anchor?: 'mark' \| 'final-mark'`，默认 `mark` | 默认标点内容 | 两处 Hero、`Stop.ts` |
| `EntryLink` | `to` | `kicker`、默认标题内容 | notes 和 docs 的下一篇链接 |
| `EntryTitle` | `as?: 'h2' \| 'span'`，默认 `h2` | 默认标题内容 | `Step`、notes 列表、changelog、`EntryLink` |
| `Kicker` | `as?: 'p' \| 'span'`，默认 `p` | 默认内容 | `PageHead`、notes 列表、changelog、`EntryLink` |
| `CtaLink` | `as?`，默认 `NuxtLink`，也接受组件、`a`、`button` | 默认链接内容 | `Hero`、`Final` 传入 `InstallLink`，`error.vue` 直接使用 |
| `Prose` | `as?: 'div' \| 'p' \| 'dd'`，默认 `div` | 默认内容 | `Step`、`Price`、`Figures`、notes 列表 |

现有 `class`、链接属性和事件继续透传。组件不增加包装元素，不改变各处原有的元素类型。

Entry 没有硬合并成 `EntryHead`。下一篇链接是 `a > span + span`，notes 列表是链接里的 `p + h2 + p + span`，changelog 是 section 里的 `p + h2 + DocBody`，`Step` 只有标题，`PageHead` 也有独立结构。只合并真正相同的下一篇结构，其余共用标题和 kicker。

Excerpt 没有抽组件。实际结构只有 notes 详情的一个 `p.l-excerpt`，`DocBody` 提供的是上下文样式，不是第二份结构。保留 `DocBody.vue` 的 `.l-doc :deep(.l-excerpt)` 和 `kit.css` 的 `.l-prose .l-excerpt`。

## 规则迁移

- Section：`l-section`、`l-label`、`l-body`、`l-title`，entry/prose/pager 修饰规则，body 中无类名段落，相关窄屏规则。`lig-section-quiet` 和 `#downloads.lig-section-quiet` 从 `palette.css` 一起迁入。
- Hero：`l-hero`、`l-word`、`l-hero-foot`、`l-tagline`，foot 中 lede/CTA 布局，窄屏规则。一起迁入 `lig-hero-title`、`lig-hero .l-tagline`、窄屏 `lig-hero .l-hero-foot`、计数器 reset。
- Mark：`l-mark` 放入 `AccentMark`，保证直接访问内页时也能加载标点样式。`Stop.ts` 仍使用渲染函数，只将原来的 span 换成生成相同 span 的组件。
- Entry：`l-entry`、`l-entry-title`、`l-kicker`，entry 中 copy/更多箭头/标题 hover，下一篇的布局和窄屏规则。`PageHead` 拥有自己的 `.l-page-foot .l-kicker`。
- Cta：`l-cta`、全部伪元素/hover、`button.l-cta`、`@keyframes l-underline`。
- Copy：`l-copy`、`l-copy p`。`Figures` 拥有 `.l-spec .l-copy`。
- 无规则删除。没有修改 CSS baseline、removed 清单或检查脚本。

原有混合 selector group 同时涉及本批和后续组件，保留全局原组，并在拥有相关元素的组件中保留同样的 scoped 组。这样既保持窄屏覆盖，也保持规则集中的原始组，不拆成不同的 selector。非本组件元素没有该组件的 scope，不扩大命中范围。

## 级联风险

以下结论来自源码、Vue 编译输出和生成 HTML，不是浏览器视觉验证。

1. `.l-word` 和 `.lig-hero-title` 同在 `HeroFrame` 的 scoped 块。原基础规则在前，palette 覆盖在后，两者同时增加一个 scope attribute。仍由 palette 的 flex、gap、`margin-left: 0` 胜出。
2. `.l-section` 保持 unscoped，放在 `Section` 中。全局 `.lig-hero ~ .l-section` 的两个 class 仍高于基础规则的一个 class，measure、gap、左右 padding 不依赖 CSS 加载顺序。
3. `.lig-section-quiet`、`#downloads.lig-section-quiet` 和基础 section 归同一组件。quiet 为 scoped，继续压过 unscoped 基础 padding。downloads 的 ID 继续胜出。
4. Section 的 `.l-label`、`.l-body` 为 scoped。palette 兄弟规则有三个 class，仍高于基础规则的 class 加 scope attribute。label 字号、颜色、对齐及 body 宽度不变。现有 palette section 没有 `is-entry`，不与 entry label padding 叠加。
5. `.l-title` 保持 unscoped，放在 `Section` 中。全局中文 selector group 的 `:lang(zh) .l-title` 继续以更高特异性清除字距。
6. `.l-mark` 保持 unscoped，放在 `AccentMark` 中。`.has-bloom .l-mark` 继续胜出。生成结果中，全部 18 个包含标点的 HTML 都加载了基础规则，包括不加载 HeroFrame 的 notes、docs、changelog。
7. `.l-tagline` 保持 unscoped，放在 `HeroFrame` 中。`.has-hand .l-tagline` 的字号、定位和透明色继续胜出，`.has-hand .lig-hero .l-tagline` 继续覆盖 right。palette 的整行 grid-column 仍由拥有组件中的更具体规则提供。
8. `.l-hero-foot` 保持 unscoped，放在 `HeroFrame` 中。`.has-stroke [data-anchor='rule']` 继续覆盖边框色，窄屏 `.has-hand.has-stroke [data-anchor='rule']` 继续恢复边框。全局 palette measure 组继续覆盖 gap、width 和 margin-inline，组件内窄屏 palette 规则继续覆盖 width 和 margin-inline。
9. `.l-entry-title` 基础规则保持 unscoped，放在 `EntryTitle` 中。全局中文组、changelog 的 scoped `margin: 14px 0 0`、notes 列表的 scoped transition 都继续胜出。下一篇的标题、hover 和中文规则在 `EntryLink` 中，子组件根元素接收其 scope。
10. `.l-entry` 的原基础 `gap: 14px` 保留在下一篇覆盖 `gap: 10px` 前，均在 `EntryLink` 中。下一篇的 grid-column 和窄屏规则跟着链接走，不依赖页面去选择它的内部元素。
11. `.l-page-foot .l-kicker` 迁入 `PageHead`，仍命中 `Kicker` 根元素。原先 `.is-section .l-page-foot > *` 的 `grid-column: auto` 与这条规则同特异性，但写在前面，未能覆盖 kicker。窄屏 `.l-page-foot > *` 特异性更低，也未能覆盖 kicker。本批保留原来实际生效的 span，不趁机修布局。
12. `.l-spec .l-copy` 在 `Figures` 中命中 `Prose` 根元素。notes 列表原有 `.l-copy` 与新基础规则声明相同。`Prose` 内的 slot 段落、`Kicker` 内的链接、Hero foot 的 slot 内容使用 `:deep()`。
13. CTA 动画跟着 scoped 规则一起编译，keyframes 与 animation 引用同步重命名。原 reduced-motion 全局 `!important` 规则未改动，继续胜出。未新增 `!important`。

以上 unscoped 例外都在组件内注明原因。全局状态、跨兄弟选择器留待收尾批次处理后，可继续收紧这些基础规则。

## 留在 kit.css 的相关全局规则

- `.has-bloom .l-mark`、`.has-hand .l-tagline`、`.has-stroke [data-anchor='rule']` 及窄屏恢复规则。它们由 html 状态驱动，跨组件生效。
- 中文排版的原混合 selector group，含 `.l-title`、`.l-entry-title`，也包含后续批次的标题。
- 原 `max-width: 860px` 混合 selector group，包含 `.l-hero-foot`、`.l-section`、`.l-tagline`、`.l-label`、`.l-body` 及尚未迁移的布局类。
- 从 `palette.css` 原样转入的 `.lig-hero, .lig-hero ~ .l-section`，含窄屏 `--edge`。
- 从 `palette.css` 原样转入的 `.lig-hero .l-hero-foot, .lig-hero ~ .l-section` measure 组。
- `.has-hand .lig-hero .l-tagline`。
- `.lig-hero ~ .l-section` 的 body span、padding、窄屏 width/margin/padding、counter increment。
- `.lig-hero ~ .l-section .l-body`、`.lig-hero ~ .l-section .l-label`，含窄屏 label 对齐，以及 `.lig-hero ~ .l-section .l-label::before`。
- `.l-prose .l-excerpt`。Excerpt 没有抽取，保持原来的上下文规则。

已有的 release、footer、final-mark 等全局状态规则没有改动。

## 验证

全部命令通过 `mise exec --` 使用 Node 24.21.0。

- 干净工作树执行 `pnpm generate`，退出码 0。项目配置的产物是 `dist/`，不是 `.output/public/`。保留相对路径复制全部 28 个 HTML 到 `/tmp/html-before/`，迁移后再构建并复制到 `/tmp/html-after/`。
- 按要求执行 `sed -E 's/ data-v-[0-9a-f]{8}=""//g'`。原始 HTML 有 26/28 不同，不能宣称逐字节一致。Nuxt 产物把 scope 属性序列化为不带 `=""` 的空属性，该命令不会删掉它们。
- 使用 Python 标准库 `html.parser` 补充对比。去除 scope 属性、生成的 CSS/JS 资源节点和 SSR slot 注释后，28/28 页面元素、属性（含顺序）、文本（含空格）和节点顺序完全一致。修正过 Hero class 顺序、Section id 顺序和三个 label 的空格，没有放宽这些业务 DOM 对比。
- 单独比较所有 script。仅规范化 hashed JS URL、`_b`、`buildId` 和 payload 的 `prerenderedAt`，28/28 一致。主题脚本、运行时配置和业务 payload 没有其他变化。
- HTML 中预期的剩余差异是 scope 属性、组件插槽产生的 Vue SSR 注释、CSS 内联内容/资源引用、构建资源 preload/prefetch，以及构建 ID 和 prerender 时间。没有业务 DOM 差异。
- `node scripts/css-rules.mjs`：617 rules，baseline 617，`lost 0, new 0, removed on purpose 0`。
- `pnpm exec vp fmt --config .oxfmtrc.json --check <全部改动文件>`：通过。
- `pnpm lint`：0 warnings，0 errors。
- `pnpm typecheck`：通过。已有 og-image static preset 兼容性警告仍存在。
- 最终 `pnpm generate`：退出码 0。
- `git diff --check`：通过。

没有添加 UI 测试，没有用浏览器或 computer use。HTML 一致和规则集一致不等于浏览器视觉验证。

## 手动验收

- 首页中英文、宽窄屏 Hero、wordmark 与标点、手写 tagline、分区间距、罗马数字、下载区块。
- 滚动分区导航、尺寸切换时的 measure motion、签名线和 bloom。
- notes 列表 hover、详情和 docs 的上一篇/下一篇、中文标题字距。
- changelog 标题上间距和日期行。
- install 的 Step、内容页 Hero/Final 的 CTA、Price/Figures 的 copy、404 返回链接。
- light/dark/paper variants、reduced motion、直接打开内页与客户端切换路由。
