// Lossless-move check for the scoped-style refactor.
// Reads every global stylesheet and every `<style>` block under app/, strips Vue scoping syntax,
// and compares the set of (at-rule context, selector, declarations) with a stored baseline.
//   node scripts/css-rules.mjs --write-baseline   record the current rules
//   node scripts/css-rules.mjs                    compare; exit 1 on lost or new rules
// Rules deleted on purpose are listed in scripts/css-rules.removed.txt, one `selector` per line.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const root = new URL('..', import.meta.url).pathname
const baselineFile = join(root, 'scripts/css-rules.baseline.json')
const removedFile = join(root, 'scripts/css-rules.removed.txt')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '')
}

function normalizeSelector(selector) {
  return selector
    .replace(/:deep\(\s*([^()]*(?:\([^()]*\)[^()]*)*)\)/g, ' $1')
    .replace(/:global\(\s*([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '$1')
    .replace(/\s*([>+~,])\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeDeclarations(body) {
  return body
    .split(';')
    .map(part => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('; ')
}

// A small block parser: at-rules with child rules, rules with declarations.
function parse(text, context, rules) {
  let i = 0
  while (i < text.length) {
    const open = text.indexOf('{', i)
    const semi = text.indexOf(';', i)
    if (open === -1) break
    if (semi !== -1 && semi < open && text.slice(i, semi).trim().startsWith('@')) {
      i = semi + 1
      continue
    }
    const prelude = text.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (j < text.length && depth) {
      if (text[j] === '{') depth++
      else if (text[j] === '}') depth--
      j++
    }
    const body = text.slice(open + 1, j - 1)
    if (prelude.startsWith('@')) {
      const name = prelude.replace(/\s+/g, ' ').replace(/-[0-9a-f]{8}\b/g, '')
      if (/^@(keyframes|font-face|property)/.test(prelude) || !/[{]/.test(body)) {
        rules.add(
          `${context.join(' > ')} | ${name} | ${normalizeDeclarations(body.replace(/\s+/g, ' '))}`,
        )
      } else {
        parse(body, [...context, name], rules)
      }
    } else {
      const selector = normalizeSelector(prelude)
      rules.add(`${context.join(' > ')} | ${selector} | ${normalizeDeclarations(body)}`)
    }
    i = j
  }
}

function collect() {
  const rules = new Set()
  const files = [
    ...walk(join(root, 'app/assets/css')).filter(file => file.endsWith('.css')),
    ...walk(join(root, 'app')).filter(file => file.endsWith('.vue')),
  ]
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    const blocks = file.endsWith('.css')
      ? [source]
      : [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1])
    for (const block of blocks) parse(stripComments(block), [], rules)
  }
  return rules
}

const rules = collect()
if (process.argv.includes('--write-baseline')) {
  writeFileSync(baselineFile, `${JSON.stringify([...rules].sort(), null, 1)}\n`)
  process.stdout.write(`baseline: ${rules.size} rules\n`)
  process.exit(0)
}

const baseline = new Set(JSON.parse(readFileSync(baselineFile, 'utf8')))
const removed = existsSync(removedFile)
  ? readFileSync(removedFile, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
  : []
const lost = [...baseline].filter(
  rule => !rules.has(rule) && !removed.some(selector => rule.split(' | ')[1] === selector),
)
const added = [...rules].filter(rule => !baseline.has(rule))
for (const rule of lost) process.stdout.write(`LOST  ${rule}\n`)
for (const rule of added) process.stdout.write(`NEW   ${rule}\n`)
process.stdout.write(
  `${rules.size} rules, baseline ${baseline.size}, lost ${lost.length}, new ${added.length}, removed on purpose ${removed.length}\n`,
)
process.exitCode = lost.length || added.length ? 1 : 0
