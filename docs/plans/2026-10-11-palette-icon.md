# Palette and pixel L

统一语义三阶、灰阶、彩色基色、accent 三阶和 UI roles 的色块。全部复用 PaletteSwatch：同尺寸方形色块、等宽名称、次级色值、统一分隔线和复制反馈。语义三阶不显示技术参数。灰阶左列和彩色右列保留；两列使用相同密度。移除 VAR 复制选项，保留 HEX / RGB / HSL。

终端前景字保持 token 原色，彩底统一黑字，只有深色中性底使用白字。这只影响示例标签，不修改 port 颜色。

九宫格像素 L：1 struct.base、4 ref.base、7 mono.base、8 action.base，其余透明。core/scripts/icons.ts 从同一 resolver 生成 SVG 和无插值 RGBA PNG，纳入 tokens:generate / tokens:check。README 展示仓库标记，网站接入主题 favicon、touch icon 和 manifest 图标；gallery 增加 LiG 条目并以 image 模式保留四种原色。

不修改上游 UI 库，不运行 UI 测试或浏览器检查。检查 lint、类型、生成产物、静态构建和部署状态。用户手动检查主题切换、各色块复制、窄屏排版、终端黑白文字、favicon 与 gallery 图标显示。
