import type { BuildMetadata } from './types'
import { PACKAGE_VERSION } from './constants'
import { neovimReadme } from './neovim/readme'

export function portReadme(port: 'neovim' | 'vscode', metadata: BuildMetadata): string {
  if (port === 'neovim')
    return neovimReadme(metadata)
  return `# LiG for VS Code

Less is Great.
Four variants from [LiG](https://github.com/0froq/lig): **LiG Light**, **LiG Dark**, **LiG Light Paper**, **LiG Dark Paper**.

## Install

Download \`theme-lig-${PACKAGE_VERSION}.vsix\` from [the v${PACKAGE_VERSION} release](https://github.com/0froq/vscode-theme-LiG/releases/tag/v${PACKAGE_VERSION}), then:

\`\`\`sh
code --install-extension theme-lig-${PACKAGE_VERSION}.vsix
\`\`\`

Or use **Extensions: Install from VSIX...**, then **Preferences: Color Theme**.
The extension id stays \`froQ.theme-lig\`.
VS Code 1.107.0 or newer.

A stable GitHub release starts the Marketplace workflow after the one-time [OIDC setup](https://github.com/0froq/vscode-theme-LiG/blob/main/PUBLISHING.md).
Check that workflow before assuming the store has the new version.

### Cursor

Cursor uses Open VSX, not the VS Code Marketplace.
Until Cursor has indexed the extension, install the same VSIX.
There is no second extension id.
Setup is in [PUBLISHING.md](https://github.com/0froq/vscode-theme-LiG/blob/main/PUBLISHING.md#cursor--open-vsx首次发布与-oidc).

### Migrate

Version 0.2.0 replaced the old palettes.
Choose **LiG Light Paper** or **LiG Dark Paper** where you had Soft.
Update \`workbench.colorTheme\` if it still names Soft.
Disable \`froQ.theme-lig-preview\` so the old preview is not selected.

To follow the system appearance, merge this into your settings:

\`\`\`json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "LiG Light Paper",
  "workbench.preferredDarkColorTheme": "LiG Dark Paper"
}
\`\`\`

To roll back, install an older VSIX and restore that theme name.

## Source

This repository is static JSON.
It does not run code, and it does not download tokens.
Change colors in [the LiG snapshot](https://github.com/0froq/lig/tree/${metadata.sourceRef}), then \`pnpm ports:generate\`.
Import with \`python3 scripts/sync.py /path/to/lig/dist/ports/vscode\`, then \`python3 scripts/verify.py\`.

A local package is \`npx @vscode/vsce package --no-dependencies\`.
\`lig-build.json\` checksums every generated file.

Design ${metadata.designVersion}.
Compiler ${metadata.compilerVersion}.
Input SHA-256 \`${metadata.inputHash}\`.

## Scope

191 Workbench keys, TextMate scopes, semantic tokens, and the same 16 terminal slots as the other ports.
A grammar or a language server can still classify a file differently.
Semantic colors depend on the language extension and your settings.

Your own \`workbench.colorCustomizations\` override the theme.
Look at all four themes: panels, syntax with semantic highlighting on and off, strings, comments, diagnostics, selections, and the terminal.

## License

MIT.
See LICENSE.md.
Workbench bindings come from [Vitesse](https://github.com/antfu/vscode-theme-vitesse) by Anthony Fu.
The Primer and Anthony Fu copyright lines stay in that file.
`
}
