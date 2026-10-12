import type { BuildMetadata } from './types'
import { PACKAGE_VERSION } from './constants'
import { neovimReadme } from './neovim/readme'

export function portReadme(port: 'neovim' | 'vscode', metadata: BuildMetadata): string {
  if (port === 'neovim')
    return neovimReadme(metadata)
  return `# LiG Theme for VS Code

Less is Great. Four variants from the canonical [LiG palette](https://github.com/0froq/lig): **LiG Light**, **LiG Dark**, **LiG Light Paper**, **LiG Dark Paper**.

## Install

Download \`theme-lig-${PACKAGE_VERSION}.vsix\` from [GitHub Releases](https://github.com/0froq/vscode-theme-LiG/releases/tag/v${PACKAGE_VERSION}), then:

\`\`\`sh
code --install-extension theme-lig-${PACKAGE_VERSION}.vsix
\`\`\`

Or use **Extensions: Install from VSIX...** in VS Code, then **Preferences: Color Theme**.
The extension keeps its original ID \`froQ.theme-lig\`. Stable GitHub Releases trigger the Marketplace workflow after the one-time [OIDC setup](https://github.com/0froq/vscode-theme-LiG/blob/main/PUBLISHING.md); check the workflow result before assuming the store has updated. Minimum VS Code version: 1.107.0.

### Cursor

Cursor uses Open VSX, a separate registry. Publishing to Marketplace alone does not make the extension searchable in Cursor. The [Open VSX setup](https://github.com/0froq/vscode-theme-LiG/blob/main/PUBLISHING.md#cursor--open-vsx首次发布与-oidc) describes first publication and ongoing OIDC synchronization of the same verified VSIX. Until that setup is complete and Cursor has indexed the extension, use **Extensions: Install from VSIX...** with the GitHub Release package. No separate theme or extension ID is needed.

### Migrate from Soft or Preview

Version 0.2.0 replaces the old independently authored palettes. Select **LiG Light Paper** / **LiG Dark Paper** in place of Soft and update any \`workbench.colorTheme\` or preferred-theme settings. Soft is no longer contributed as a separate theme. The older \`froQ.theme-lig-preview\` extension is independent; disable or uninstall that extension to avoid selecting an old preview.

Optional system appearance switching (merge into your existing settings):

\`\`\`json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "LiG Light Paper",
  "workbench.preferredDarkColorTheme": "LiG Dark Paper"
}
\`\`\`

To roll back, install an older release VSIX and restore its theme name in settings.

## Source and reproducibility

This repository distributes static native JSON, with no executable extension code or installation-time token downloads. Change colors and bindings in [the LiG source snapshot](https://github.com/0froq/lig/tree/${metadata.sourceRef}); run \`pnpm ports:generate\` there. Import the generated payload with \`python3 scripts/sync.py /path/to/lig/dist/ports/vscode\`, then \`python3 scripts/verify.py\` (Python 3.11+).

Package a local VSIX with \`npx @vscode/vsce package --no-dependencies\`. No palette build is performed here. \`lig-build.json\` records every generated file checksum.

Design: ${metadata.designVersion} · Compiler: ${metadata.compilerVersion}
Input SHA-256: \`${metadata.inputHash}\`

## Scope and manual checks

The adapter covers 191 Workbench keys, TextMate scopes, semantic tokens and the same 16 terminal slots as the other LiG ports. Language grammars and language servers may classify source differently. Semantic token availability depends on the language extension and user settings.

Data and package checks do not establish visual acceptance. Check all four themes in VS Code: UI and panels, syntax with semantic highlighting on/off, strings/comments, diagnostics/selections and terminal ANSI colors. Existing user color customizations can override the theme.

## Credits and license

MIT. The original distribution was based on [Vitesse Theme](https://github.com/antfu/vscode-theme-vitesse) by Anthony Fu. Original Primer and Anthony Fu copyright notices are retained in LICENSE.md.
`
}
