import { readFileSync } from 'node:fs'

/** Both editor repositories import verified payloads instead of maintaining palettes. */
export function distributionTools(): Record<string, string> {
  return {
    'scripts/verify.py': readFileSync(new URL('./distribution/verify.py', import.meta.url), 'utf8'),
    'scripts/sync.py': readFileSync(new URL('./distribution/sync.py', import.meta.url), 'utf8'),
    'scripts/release.py': readFileSync(new URL('./distribution/release.py', import.meta.url), 'utf8'),
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

export function storeFiles(port: 'vscode' | 'zed'): Record<string, string> {
  return {
    '.github/workflows/release.yml': readFileSync(new URL(`./distribution/${port}-release.yml`, import.meta.url), 'utf8'),
    'PUBLISHING.md': readFileSync(new URL(`./distribution/${port}-publishing.md`, import.meta.url), 'utf8'),
  }
}
