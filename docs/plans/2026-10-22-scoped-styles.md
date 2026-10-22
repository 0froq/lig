# 把全局 CSS 迁成组件内 scoped style

目标：`kit.css`、`palette.css`、`choice.css` 里的样式搬进各自组件的 `<style scoped>`，视觉零变化。几乎不留全局 CSS。

## 起点

- 三个全局文件共 2916 行，`ui.css` 15 行。231 个类名，156 个只有一个使用者，48 个多处共用，27 个无引用。
- `l-*` 里真正跨文件共用的只有六簇，其余都只有一个使用者。
- 共用的六簇：
  - Section：`Block.vue` 和 `PaletteShowcase.vue` 各写了一遍 `l-section / l-label / l-body / l-title`。
  - Hero：`Hero.vue` 和 `PaletteShowcase.vue` 重复 `l-hero / l-word / l-mark / l-tagline / l-hero-foot`。
  - Entry：`l-entry / l-entry-title / l-kicker` 出现在 notes、docs、changelog 和 `PageHead`。
  - Cta：`l-cta` 在 `Hero`、`Final`、`error.vue`。
  - Copy：`l-copy` 在 `Step`、`Price`、`Figures`、`notes/index.vue`。
  - Excerpt：`l-excerpt` 在 `DocBody` 和 `notes/[slug].vue`。
- 终端表和强调表共用 `lig-color-table*` 和 `lig-pin-*`。

## 层级设计

原则：同一块结构只在一处写一遍，样式跟着那个组件走。scoped 对子组件的根元素也生效，所以类的透传一般不需要全局样式。只有子组件内部元素才用 `:deep()`。

| 层 | 内容 |
| --- | --- |
| 全局（`base.css`，只留这些） | `:root` 变量与主题、`*` 重置、滚动条、`html`/`body`、`forced-colors`、`shiki` 变体色、`page-*` 和 `theme-bar-*` 过渡类、`router-link-active`、`@property`、`ui.css` 桥接 |
| 布局原语（新组件） | `Section`（label + body + 可选 title，被 `Block` 和 `PaletteShowcase` 共用）、`HeroFrame`（word、mark、foot、tagline 的结构，被 `Hero` 和 `PaletteShowcase` 共用）、`EntryHead`、`CtaLink`、`Prose`（原 `l-copy`） |
| 页面骨架 | `layouts/default.vue` 拥有 `l-site / l-frame / l-skip` |
| 业务组件 | 各自拥有自己的类 |
| 共用块 | `PaletteColorTable`（终端表和强调表共用，后续可换成库的 `Table`） |

名称以 worker 读完源码后的实际结构为准。新增组件在 `app/components/`，不进 `vendor/ui`。

## 规则

1. 不改类名、不改模板结构、不改视觉。因此 `useMeasureMotion`、`usePageSections`、`useSignature` 按类名查 DOM 不受影响。
2. 保持规则顺序和注释。`@media`、`@supports`、`@keyframes` 跟着用到它的规则走。
3. 不新增 `!important`，不碰 `vendor/ui`。
4. 渲染函数组件（`Copy.ts`、`Fill.ts`、`RichText.ts`、`Stop.ts`）没有 scope 属性，它们输出的元素要靠 `:deep()` 或改成 SFC。
5. `:root[data-*]`、`html.has-*` 这类选择器用 `:global()`。
6. 跨组件的兄弟选择器（例如 `.lig-hero ~ .l-section`）scoped 之后会失效，必须改写或明确标注。
7. 库的 `.ui-*` 内部元素、Markdown/MDC 渲染内容用 `:deep()`。
8. 需要透传给任意子孙元素的少数样式，用不带 `scoped` 的 `<style>`，并在注释里写明原因。
9. 无引用的类：不在 `content/` 里被用到才删，要先核对。Vue `Transition` 的 `*-enter-*`、`*-leave-*` 类、`router-link-active` 是框架类，不算无引用。

## 验证

- 第 0 步写 `scripts/css-rules.mjs`：对 `pnpm generate` 产出的 CSS 去掉 `[data-v-*]`，规范化 `:deep`，把"at 规则上下文、选择器、声明"做成集合，前后对比。要求：无丢失、无新增，批准删除的除外。
- 每个批次过 `pnpm exec vp fmt --config .oxfmtrc.json --check <改动文件>`（不格式化 `vendor/ui`）、`pnpm lint`、`pnpm typecheck`、`pnpm generate`。
- 不写 UI 测试，不用浏览器。每个批次在报告里列出可能受影响的用户可见行为。

## 批次

1. 基线和对比脚本（我）。
2. 共用原语（一个 worker）：`Section`、`HeroFrame`、`EntryHead`、`CtaLink`、`Prose`，并让原来的使用者改用它们。先合并，后面批次依赖它。
3. 试点：`choice.css` 拆进 `palette/choice/`。
4. `palette.css`：展示和预览、下载和说明、终端表和强调表三组。
5. `kit.css`：站点头部和菜单、内容块、各页面三组。
6. 收尾（我）：剩余全局整理成 `base.css`，更新 `nuxt.config.ts` 的 `css`，删空文件，审查每个 diff，过总门。

worker 各用隔离 worktree，在里面提交，我用 `merge_worktrees` 合并。
