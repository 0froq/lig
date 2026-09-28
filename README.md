# paper-landing

安静的产品站模板：纸面纹理、一笔画到底的墨线、一句手写的话，和一个强调色时刻。
Nuxt 4 + Nuxt Content v3 + `@nuxtjs/i18n`，TypeScript。仓库里的文案是空的。空字符串会渲染成带字段名的方块，用来标出还没替换的位置。

```bash
gh repo create my-product --template 0froq/paper-landing --private --clone
cd my-product && pnpm i && pnpm dev
```

## 换成你的产品

1. `app/app.config.ts`：名字、强调色、签名效果开关、安装方式、导航。
2. `i18n/locales/*.json`：界面文案（站点标题、导航、按钮、各列表页标题）。
3. `content/<locale>/`：页面、笔记、更新日志、文档，全部是 Markdown。

## 页面由内容决定

`content/<locale>/` 下的每个 `.md`（除了 `notes/`、`changelog/`、`docs/`）都是一个页面，路径即路由：
`content/en/index.md` 是首页，`content/en/install.md` 是 `/install`，`content/zh/pricing.md` 是 `/zh/pricing`。

页面由 MDC 区块拼成，**有几个、什么顺序、用哪种都随意**，也可以直接写 Markdown：

```md
::hero
---
tagline: i shipped nothing.
lede: One sentence about the product.
---
::

::block{id="specs" label="Specs" title="Four measurements. All zero."}
  :::figures
  ---
  items:
    - { value: '0', unit: ms, label: Latency, copy: Nothing waits. }
  ---
  :::
::

::block{label="Why"}
Plain markdown works inside any block.
::

::final{title="ship it."}
::
```

| 区块        | 作用                                                         | 主要参数                                            |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------- |
| `hero`      | 名字大字、手写句、首个 CTA；墨线从它的横线开始               | `tagline` `lede` `release` `cta`                    |
| `block`     | 一个章节：左栏标签（墨线经过的地方）+ 正文，正文里放任何东西 | `id` `label` `title` `entry`                        |
| `figures`   | 数字格（1–4 列自适应）                                       | `items: [{ value, unit, label, copy }]`             |
| `statement` | 一句大字声明                                                 | `lines: []` 或直接写正文                            |
| `quotes`    | 引语（1–3 列）                                               | `items: [{ quote, by }]`                            |
| `price`     | 价格，墨线会圈住金额                                         | `price` `period` `lede` `facts: [{ label, value }]` |
| `faq`       | 问答，`` `code` `` 可用                                      | `items: [{ q, a }]`                                 |
| `step`      | 带复制按钮的命令步骤                                         | `label` `title` `code`，正文是说明                  |
| `final`     | 收尾大字，墨线停在它的句号上                                 | `title` `lede` `cta` `end`                          |

需要新区块时，在 `app/components/content/` 加一个 Vue 组件即可在 Markdown 里用。

页面 frontmatter：`title`、`description`、`kicker`（页头小字）、`head: false`（不要页头，首页用 `::hero` 代替）、`line: false`（这页不画线）。

带 `id` 的 `block` 出现在页头中间。滚过页头后，同一份章节固定在顶部，并标出当前这一段。`label` 有文字时用标签，空着就显示 `id`。

## 占位

字符串留空（`''`）时渲染成方块，方块上写着字段名，例如 `product.name`、`hero.tagline`、`figures.0.value`、`notes.title`。填上文字后方块消失。
省略整个字段则不占位：区块不写 `title` 就没有标题，写成 `title: ''` 才出现方块。
首页、安装页、笔记、更新日志和文档目前都是空的，打开就能看到还没替换的位置。
方块上的字段名不会被手写，也不会被晕染。

## 笔记、更新日志、文档

- `content/<locale>/notes/*.md`：`title`、`description`（摘要）、`date`。
- `content/<locale>/changelog/*.md`：`title`、`version`、`date`，正文写列表。首页 `hero` 会链接最新一条。
- `content/<locale>/docs/**/*.md`：`title`、`description`。文件名前的数字（`1.installation.md`）决定目录顺序，不会出现在路径里；`0.index.md` 是 `/docs`。

Markdown 里的站内链接要写上语言前缀，比如中文文档里写 `/zh/docs/installation`。

## 签名效果

`app.config.ts` 里的 `signature`：

| 开关    | 效果                                                   |
| ------- | ------------------------------------------------------ |
| `paper` | WebGL 纸纤维与纸面颗粒                                 |
| `line`    | 一笔画：页头横线 → 左栏标签 → 价格 → 最后的句号      |
| `hand`    | 墨线手写 `hero` 的 `tagline`（手写字体只有拉丁字形） |
| `bloom`   | 句号晕染。关掉后句号仍是字                           |
| `pointer` | 背景对指针的响应。`dwell` / `click` 各为 `wash` 或 `false`。`dwellAfter` 是停多久才渗色，默认 `1.2` 秒 |

墨线和晕染只认 DOM 上的锚点，不认内容类型：`data-anchor="rule | label | price | tagline | mark | final-mark"`。
自定义组件带上这些锚点，就会被串进线里。

## 安装

`install.href` 为 `null` 时，「安装」会让整页消失，只留下纸和颜色，显示 `install.done`（空着就是方块）与返回链接。
真实产品把它指向安装页（如 `/install`，已按语言前缀处理）或外部地址。

## 皮肤

样式收成一组角色变量，默认值就是现在这张页面。`app.config.ts` 的 `product.skin` 只写要改的项，缺省沿用 `app/assets/css/kit.css` 的 `:root`。

| 键 | 作用 |
| --- | --- |
| `font.display` / `text` / `meta` | 展示、正文、标注三档字体 |
| `scale.display` / `poster` / `title` / `section` | 字号和章节节奏的倍率，`1` 是当前页面 |
| `gap` `section` | 栏距、章节间距 |
| `margin` `body` | 左栏和正文各占几列，两者相加为 12 |

颜色在 `product.theme.light` 和 `product.theme.dark`：`bg` `fg` `muted` `faint` `line` `accent`。签名效果只读这些颜色和 `data-anchor`。

## 主题与语言

深色是 `product.theme.dark`（纯净底色，纸颗粒在暗色着色器里关掉）。页脚切换并记在 `localStorage`，默认跟随系统。
语言在 `nuxt.config.ts` 的 `i18n.locales` 里增删，同时在 `content/` 和 `i18n/locales/` 下加对应目录和文件。

## 命令

推到 `main` 后，Cloudflare Pages（已连接 GitHub 仓库，不使用 API token secret）会执行 `pnpm generate` 并发布到 <https://paper-landing.pages.dev>。

```bash
pnpm dev        # 开发
pnpm generate   # 静态站点，输出到 .output/public
pnpm build      # 带服务端的构建
pnpm lint
pnpm typecheck
```

## 许可

手写字体来自 EMS Allure（Allura 的单线衍生版，Sheldon B. Michaels），SIL Open Font License 1.1，见 `app/kit/hand-font.ts` 文件头。
