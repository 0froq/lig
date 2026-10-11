import type { BuildMetadata } from './types'
import { PACKAGE_VERSION } from './constants'
import { neovimReadme } from './neovim/readme'

export function portReadme(port: 'neovim' | 'vscode', metadata: BuildMetadata): string {
  if (port === 'neovim')
    return neovimReadme(metadata)
  const installation = `
## 打包并安装本快照（VS Code）

\`\`\`sh
cd dist/ports/vscode
npx @vscode/vsce package --no-dependencies
code --install-extension theme-lig-preview-${PACKAGE_VERSION}.vsix
\`\`\`

从上面的 source snapshot 在 LiG 源码仓库运行 \`pnpm install\` 和 \`pnpm ports:generate\` 后再打包。这份生成目录不代表旧 Preview release 已被更新；旧 tag 中的 VSIX 不等于当前快照。

若终端没有 \`code\`，在 VS Code 命令面板使用 \`Extensions: Install from VSIX...\` 选择下载文件。
随后 \`Preferences: Color Theme\` 选择 LiG Preview Dark / Light / Dark Paper / Light Paper。

Extension ID 是 \`froQ.theme-lig-preview\`，与现有 \`froQ.theme-lig\` 独立。最低 VS Code 版本沿用 1.107.0。
`
  return `# LiG VS Code Preview

这是一套供人工试用的生成产物，未替换正式 LiG 主题。四套 variant（light / dark / light-paper / dark-paper）来自同一个 OKLCH core 与 shared styles。

${installation}
## 覆盖与测试重点

- 基础编辑界面、诊断、选区、terminal 16 色。
- 191 个 Workbench keys、TextMate 与 semantic tokens；是否收到 semantic tokens 取决于语言扩展。
- 对比 TS/Python 中的 variable / keyword、类型定义 / 引用、函数定义 / 调用、字符串 / 注释。
- 试用四套主题、选区/搜索/诊断。比较 semantic highlighting 开启与关闭时的分类。
- Paper 变体使用微染色的面板与灰阶；彩色 token 沿用对应 light/dark。
- 字体与最终视觉效果由用户在实际编辑器手动确认；构建检查不等于视觉验收。

## 单一事实源

请在 [LiG source snapshot](https://github.com/0froq/lig/tree/${metadata.sourceRef}) 修改 design/core/compiler；不要手改这里的 generated 文件。

Design version: ${metadata.designVersion}
Compiler version: ${metadata.compilerVersion}
Input SHA-256: \`${metadata.inputHash}\`

\`lig-build.json\` 包含该 repo 的每个文件 checksum。Preview 是静态 native 产物，安装时无需 Node，也不会从网络加载 tokens。
`
}
