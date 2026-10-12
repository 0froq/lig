import { readFileSync } from 'node:fs'

/** Both editor repositories import verified payloads instead of maintaining palettes. */
export function distributionTools(): Record<string, string> {
  return {
    'scripts/verify.py': readFileSync(new URL('./distribution/verify.py', import.meta.url), 'utf8'),
    'scripts/sync.py': readFileSync(new URL('./distribution/sync.py', import.meta.url), 'utf8'),
    '.github/workflows/verify.yml': `name: Generated distribution
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7.0.1
      - run: python3 scripts/verify.py
`,
  }
}

export function vscodePackageWorkflow(): string {
  return `name: Package VSIX
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: actions/setup-node@v7.0.0
        with:
          node-version: 22
      - run: python3 scripts/verify.py
      - run: npx --yes @vscode/vsce@3.6.2 package --no-dependencies
      - uses: actions/upload-artifact@v7.0.2
        with:
          name: lig-vsix
          path: '*.vsix'
          if-no-files-found: error
`
}
