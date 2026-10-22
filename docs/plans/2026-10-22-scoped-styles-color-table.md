# 终端表与强调色表迁移记录

本批沿用总计划和 batch 2 的报告格式。范围只有 `PaletteTerminalReference`、`PaletteAccentTiers`、新增的 `PaletteColorTable` 和 `palette.css` 中属于它们的规则。

## 实施步骤

1. 读取两个组件、`usePaletteClipboard` 和上层布局，检索 `app/`、`content/` 及全仓库中的类族引用和覆盖。
2. 抽取共同的滚动容器、table、thead 和表头 tr。迁移整族 CSS，保留调用处的数据、事件和结构差异。
3. 构建后对比 DOM、检查规则集、格式、lint、类型，审查编译后的 scope 和动画名称，再提交。

## 组件与使用者

新组件在 `app/components/palette/PaletteColorTable.vue`，没有改动 `vendor/ui`。

| 接口 | 内容 |
| --- | --- |
| `label: string` | 原滚动容器的 `aria-label` |
| `tableStyle?: CSSProperties` | table 的内联样式。强调色表传入 `{ '--pin-1': '7ch' }`，终端表不传 |
| `columns` slot | 表头的 th，插入共用的 `thead > tr` |
| 默认 slot | 一个或多个 tbody，保留调用处的循环和 key |
| `after` slot | table 后、滚动容器内的内容。只有强调色表传入公告 |

没有新增 `v-model`、事件或复制状态。两个调用者继续各自调用原来的 `usePaletteClipboard`，该 composable 未改动。

强调色表的实际调用形状如下，省略处仍是调用者原有的单元格和事件：

```vue
<PaletteColorTable
  :label="t('palette.more')"
  :table-style="{ '--pin-1': '7ch' }"
>
  <template #columns>
    <!-- 原表头 th -->
  </template>
  <template #default>
    <!-- 原 families / levels 循环及 tbody -->
  </template>
  <template #after>
    <!-- 原 role="status" 公告 -->
  </template>
</PaletteColorTable>
```

共用组件只生成原来的 `div.lig-color-table-scroll > table.lig-color-table`，以及原来的 `thead > tr`，不增加元素。标题段落留在两个调用者。终端表的背景色复制按钮和公告仍在滚动容器外，强调色表的公告仍在容器内。ANSI 分组、强调色 `rowspan="3"`、单元格属性顺序、颜色内联样式、翻译与数字格式都保留。

`tableStyle` 用条件 `v-bind`。不传时完全不生成 style 属性。传对象时与原静态 style 使用相同的 SSR 序列化，强调色表仍输出 `style="--pin-1:7ch;"`。首次 DOM 检查发现过终端表空 style 和强调色 style 空格差异，已修正，没有放宽对比脚本。

## 规则迁移

- `PaletteColorTable` scoped：`lig-color-table-scroll` 和 focus、`lig-color-table` 及 th/td、rowspan、thead、tbody 分组线。
- 同一 scoped 块：`lig-pin-1`、`lig-pin-2`、`lig-pin-end::after`，两个 `@supports (animation-timeline: scroll())` 和 `@keyframes lig-pin-fill`、`lig-pin-fade`。原注释与规则顺序保留。
- 同一 scoped 块：`lig-color-key`、`lig-color-copy` 的基础、hover/focus、`is-copied`，以及 `lig-color-announcement`。slot 内部元素全部用 `:deep()`。
- 两个调用者各自 scoped：`lig-color-table-title`。段落位置、文本及空格不变。
- `PaletteTerminalReference` scoped：只被该组件引用的 `lig-aside`，以及表壳外复制按钮和公告需要的 `lig-color-copy` 整族与 `lig-color-announcement`。这些声明与共用组件中的声明相同。
- 原有 `lig-terminal-reference` 的 `scroll-margin-top` 留在原组件。
- 从 `palette.css` 移走 150 行。没有删除规则，没有新增 `!important`，没有修改 baseline、removed 清单或检查脚本。

## 共用/留下的规则

- `lig-more`、相邻折叠区块间距、`ui-collapsible` 固定标题混合 selector group 原样留在 `palette.css`，它们还被其他组件使用。本批不拆组。
- `kit.css` 的全局 `:focus-visible`、滚动条、主题变量、reduced-motion 规则未改动。
- 本批类族没有窄屏专属规则。现有窄屏规则不命中这两张表，不迁移其他组件的 `@media`。
- 标题、终端背景色按钮与终端公告不属于共用滚动容器内部，不能靠容器的 `:deep()` 命中。为保持原 DOM，在调用者 scoped 块保留相同声明。没有为消除这几条重复规则引入额外组件或包装元素。
- 全仓库检索未发现本批类族被其他组件或 `content/` 使用，没有需要登记的无引用死规则。

## 级联风险

以下结论来自源码、生成 CSS 和 HTML，没有浏览器视觉验证。

1. table 自身与 thead/tr 由共用组件生成，普通 scoped 规则可以命中。表头 th、tbody、tr、单元格、色块、复制按钮和强调色公告来自调用者 slot，使用 `:deep()`。编译结果是 `.lig-color-table[data-v-*] th` 或 `[data-v-*] .lig-pin-1` 等，scope 锚点位于共用 table 或滚动容器。
2. 固定列的基础背景与 `@supports` 中透明背景一起迁入同一 scoped 块，特异性同时增加一个属性，supports 规则仍在后面。静止透明、滚动补背景的覆盖顺序不变。不支持 scroll timeline 时仍使用基础背景和常驻渐隐。
3. 两个 keyframes 及其 animation 引用都在 `PaletteColorTable`。检查生成 CSS，定义和引用都同步重命名为带相同 scope 后缀的名称，没有跨文件引用旧名称。
4. table 基础 `--pin-1: 4ch` 仍被强调色 table 的内联 `--pin-1:7ch;` 覆盖，终端表不传 style，仍用 4ch。第二固定列的 `left` 仍是 `calc(var(--pin-1) + 16px)`。
5. 复制基础色仍被更具体的 `is-copied` 覆盖，hover/focus 只改下边框色。终端表 slot 中按钮会同时命中调用者 scoped 和共用 deep，两套声明完全相同，状态规则也整族一致，不依赖加载顺序。
6. 全局 `:focus-visible` 仍提供按钮 outline。滚动容器原有的 class + focus 规则更具体，迁移后继续胜出，保留 `outline-offset: -1px`。全局 reduced-motion 的原有 `!important` 继续覆盖动画时长，没有新增 `!important`。
7. 未发现 `html.has-*`、`:root[data-*]`、中文 `:lang()` 混合组或跨组件兄弟规则覆盖本批类族。Section 的无类名 p 规则不命中带 class 的标题和 aside。两张表也不在 `.lig-stage` 或 `.l-prose` 内，不会改变这些上下文规则的胜负。本批不需要 unscoped 例外。
8. `lig-color-table th[rowspan]` 继续覆盖单元格默认的垂直对齐，`tbody tr:first-child > *` 继续只给各分组首行加边线。没有发现“原基础赢、原覆盖输”而需另外保留的冲突。

## 验证

Node 命令均用 `mise exec --`，确认 Node 为 `v24.21.0`。开始时工作树干净，已存在用户提供的 `/tmp/lig-dist-base`，未重建或覆盖基线。

- `mise exec -- pnpm generate`：退出码 0，生成 80 个 prerender routes。
- `python3 scripts/dom-compare.py /tmp/lig-dist-base dist`：`28 pages compared, 0 differ`。对比元素、属性及顺序、文本与节点顺序，包含两表的全部单元格和内联 style。脚本按原设计忽略 scope 属性、注释、script/style/link。
- `mise exec -- node scripts/css-rules.mjs`：`617 rules, baseline 617, lost 0, new 0, removed on purpose 0`。该脚本实际读取源码 CSS/SFC style 并规范化 scope 语法，不验证浏览器命中或规则顺序，因此另外审查了编译 CSS。
- `mise exec -- pnpm exec vp fmt --config .oxfmtrc.json --check app/assets/css/palette.css app/components/palette/PaletteColorTable.vue app/components/palette/PaletteTerminalReference.vue app/components/palette/PaletteAccentTiers.vue docs/plans/2026-10-22-scoped-styles-color-table.md`：通过。配置排除 `docs/plans/**`，实际检查 4 个源码文件，报告人工审查。
- `mise exec -- pnpm lint`：0 warnings、0 errors。
- `mise exec -- pnpm typecheck`：通过。已有 og-image `Unknown Nitro preset "static"` 警告仍存在。
- 用 Python 标准库读取生成 CSS，确认 `lig-pin-fill`、`lig-pin-fade` 的 scoped 定义集合与 animation 引用集合分别一致，退出码 0，并检查了固定列规则的实际编译 selector。
- `git diff --check`：通过。

没有添加 UI 测试，没有用浏览器或 computer use。DOM 和规则集检查通过不等于视觉验证。

## 手动验收

- 中英文首页展开终端表和强调色表，检查标题、注释、分组边线、rowspan 和数字格式。
- 窄屏横向滚动，两列固定位置不变，静止时透出纸张，前 24px 内背景填充和末列渐隐变化正常。
- 不支持 scroll timeline 的环境保留固定背景与渐隐，reduced-motion 下行为不变。
- 键盘聚焦滚动容器与复制按钮，检查 outline 和 hover/focus 下边框。
- 复制终端背景色、ANSI HEX 和强调色 HEX，检查剪贴板、copied 文案及颜色、1600ms 恢复和读屏公告。
- 切换 variant、明暗及 paper 主题，检查色值更新、固定列背景与渐隐颜色。
- 直接访问 `#terminal-colors` 自动展开，反复折叠后横向滚动与复制仍正常。

没有待用户决定的事项。表外规则的少量重复是保持 DOM 的明确取舍。本批不替换库 Table，不推送、不执行 subtree。
