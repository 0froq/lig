---
title: 'LiG 的颜色如何定义'
description: '以 OKLab 为基础，用同一套 token 连接代码、终端与编辑器；黄色单独校准。'
date: '2026-10-10'
---

LiG 的颜色先服务于阅读：识别结构、引用和动作，同时让普通文字安静地留在背景之上。色盘展示所有可用颜色，代码高亮只取其中一部分。

## 用 OKLCH 调色，用 OKLab 混色

[OKLab](https://bottosson.github.io/posts/oklab/) 将颜色表达为明度 L 和两个色度轴 a、b。OKLCH 是它的极坐标形式：C 表示彩度，H 表示色相角度。LiG 用 L/C/H 定义原色和变体，在 OKLab 中计算混色。

这样可以分别讨论“更亮一点”和“更鲜明一点”。但 L 不是屏幕的物理亮度，C 也不是一个统一的饱和度百分比。感知均匀性是近似，背景、面积和显示条件仍会影响观感。灰度因此采用手动选择的阶梯，浅色和深色的文字也不必使用对称的级别。

简图展示八个基色的设计坐标：圆图的角度是 H，半径是 C；旁边单独展示 L。圆图没有固定明度，也不代表 sRGB 的色域边界。

## 每个色相分别校准

相同的 L/C 数字并不意味着所有颜色都能显示出来。[sRGB 的可用色域随色相和明度变化](https://bottosson.github.io/posts/colorpicker/)。LiG 分别调整每个色相的 L/C，保留稳定的色相关系，再检查它们在实际背景上的效果。

导出时，解析器保持 L/H，通过降低 C 将越界颜色收回 sRGB，最后量化为 HEX。这是项目自己的严格边界映射，不等同于浏览器的 CSS 色域映射。因此，图中的设计 C 与 HEX 实际能表现的 C 可能有差别。

## 黄色为什么单独处理

早期黄色与其他浅色基色使用接近的明度，结果更像橄榄色。当前版本把黄色单独提高到 `L 0.79 / C 0.18 / H 95°`，映射后约为 `C 0.162`，输出 `#dbb800`。这是本主题的视觉选择，并非 OKLab 要求黄色必须使用这个数值。

四个主题共享这个黄色基色。色盘、ANSI 3 和 warning 角色都引用它；ANSI 11 引用它的 highlight。在浅色下，highlight 比 base 更深，在深色下则更亮。“Bright”在这里表示强调层级，不保证 RGB 数字更大。

提高黄色明度也会降低它在浅底上的文字对比度。例如在 Light 的 `#f2f2f2` 背景上，基色约为 `1.73:1`，APCA 约 `+29 Lc`。这不满足 WCAG AA 的普通文字要求。黄色底标签使用深色文字；终端前景仍保留同一黄色基色，方便观察这一取舍。

## 同一份色源，不同的映射

`core/spec.json` 是维护颜色、模式和别名的事实源。解析器生成语义 token，再由各 port 转换为目标格式。Neovim 和 VS Code 的适配层维护各自的高亮组与 scope，不另造色盘。

代码高亮分为 mono、struct（绿）、ref（蓝）、action（橙）。红色等其他原色供诊断、界面和终端使用。ANSI 1-6 引用对应彩色 base，9-14 引用 highlight；0、7、8、15 来自文字灰度，所以 ANSI 16 色并不是再维护一套独立颜色。

## ANSI 槽位名与默认颜色

ANSI 0 叫 black，ANSI 7 叫 white。这是槽位身份，不要求必须使用 `#000000` 和 `#ffffff`。[XTerm 将指定颜色与默认颜色分开](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)：SGR 30/37 选择 black/white 前景，39 恢复默认前景；40/47 选择 black/white 背景，49 恢复默认背景。主题变化不应改变这些控制码和槽位名称。

浅色主题可以采用不同的灰度映射。[Catppuccin Latte](https://github.com/catppuccin/alacritty/blob/main/catppuccin-latte.toml) 的 black 是浅灰 `#bcc0cc`，white 是深灰 `#5c5f77`，背景则独立设为 `#eff1f5`。[Rosé Pine Dawn](https://github.com/rose-pine/alacritty/blob/main/dist/rose-pine-dawn.toml) 同样将 black 设为 `#f2e9e1`、white 设为 `#575279`，背景为 `#faf4ed`。因此，浅色终端并不需要强制使用纯黑。

LiG 保留标准槽位名，在浅色下反转灰度角色。ANSI 0 改为引用 `text.dim`，不再与画布同色；7 引用 `text.primary`，8 引用 `text.subtle`，15 引用 `text.strong`。默认前景和背景仍是独立 token。这样沿用同一套灰度，同时避免 ANSI 0 色样完全消失。dim 槽位仍是低对比度颜色，不保证适合普通正文；将 black/white 写死为特定视觉效果的程序，在不同终端主题中仍可能表现不同。

WCAG 2.2 和 APCA 都基于最终 HEX 与背景计算，作为检查读数。APCA 是实验性模型；[WCAG 3 仍是草案](https://www.w3.org/TR/wcag-3.0/)，其对比度算法尚未确定。可读性最终仍要结合字号、字重和使用场景判断。
