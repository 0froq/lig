import type { Language } from './neovim'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import manifest from '../manifest.json'
import { parseSources } from './neovim'

const sources = Object.entries(manifest.languages).map(([language, info]) => ({
  language: language as Language,
  filename: info.sample.replace(/\.txt$/, ''),
  source: readFileSync(new URL(`../samples/${info.sample}`, import.meta.url), 'utf8'),
}))
const result = parseSources(sources)
for (const document of result.documents) {
  if (document.hasError)
    throw new Error(`Parse error in ${document.filename}`)
}
// Lua object key order is unspecified; canonicalize every object for reproducible output.
function canonical(value: unknown): unknown {
  if (Array.isArray(value))
    return value.map(canonical)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([key, item]) => [key, canonical(item)]))
  return value
}
const content = `${JSON.stringify(canonical(result))}\n`
const destination = new URL('../generated/examples.json', import.meta.url)
if (process.argv.includes('--check')) {
  if (readFileSync(destination, 'utf8') !== content)
    throw new Error('Stale syntax artifacts. Run pnpm syntax:generate.')
  console.log('Syntax artifacts match Neovim parsing and source fixtures.')
}
else {
  writeFileSync(destination, content)
  console.log(`Parsed ${result.documents.map(doc => `${doc.filename}: ${doc.nodes.length} nodes, ${doc.captures.length} captures`).join('; ')}.`)
}
