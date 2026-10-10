# Palette and pixel L

统一语义三阶、灰阶、彩色基色、accent 三阶和 UI roles 的色块。全部复用 PaletteSwatch：同尺寸方形色块、等宽名称、次级色值、统一分隔线和复制反馈。语义三阶不显示技术参数。灰阶左列和彩色右列保留；两列使用相同密度。移除 VAR 复制选项，保留 HEX / RGB / HSL。

终端前景字保持 token 原色。后续反馈明确彩底文字应取当前 terminal.background，形成反色。这只影响示例标签，不修改 port 颜色。演示顺序为 TypeScript、Python、ANSI 终端。

九宫格像素 L：1 struct.base、4 ref.base、7 mono.base、8 action.base，其余透明。core/scripts/icons.ts 从同一 resolver 生成 SVG 和无插值 RGBA PNG，纳入 tokens:generate / tokens:check。README 展示仓库标记，网站接入主题 favicon、touch icon 和 manifest 图标；gallery 增加 LiG 条目并以 image 模式保留四种原色。

每个轻量 port 提供四个独立下载链接和一个四变体 ZIP。当前主题只控制链接高亮。ZIP 使用固定日期、固定排序与 stored entries，逐文件内容与单文件发布一致，纳入 manifest 与 ports:check。agent 区域仅保留顶部和展开控件自己的分隔线，增加控件上方间隔。

gallery 首页目录与作品标题显示小图标；LiG 不再把 icon 放大为 demo 占位图。

不修改上游 UI 库，不运行 UI 测试或浏览器检查。检查 lint、类型、生成产物、ZIP 解包、静态构建和部署状态。用户手动检查主题切换、各色块复制、窄屏排版、终端反色文字、下载高亮、展开间隔、favicon 与 gallery 图标显示。
