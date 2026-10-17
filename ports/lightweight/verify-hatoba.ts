// @env node
// Optional read-only check against a Hatoba checkout. No app, vault, or UI is started.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { VARIANTS } from '../../core/resolve'

const checkout = process.argv[2]
if (!checkout)
  throw new Error('Usage: pnpm exec jiti ports/lightweight/verify-hatoba.ts /path/to/Hatoba')

const filename = join(checkout, 'apps/desktop/src/features/terminal/schemes.ts')
const source = readFileSync(filename, 'utf8')
const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true)
const scheme = ast.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'TermScheme')
assert.ok(scheme && ts.isInterfaceDeclaration(scheme), 'Hatoba must declare TermScheme')
const fields = scheme.members.map((member) => {
  assert.ok(ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name))
  return { name: member.name.text, required: !member.questionToken }
})
const colors = ast.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'SchemeColors')
assert.ok(colors && ts.isTypeAliasDeclaration(colors), 'Hatoba must declare SchemeColors')
const requiredColors: string[] = []
function collectKeys(node: ts.Node): void {
  if (ts.isStringLiteral(node))
    requiredColors.push(node.text)
  ts.forEachChild(node, collectKeys)
}
collectKeys(colors)
assert.equal(requiredColors.length, 20, 'Review upstream SchemeColors changes before shipping')

interface Scheme {
  id: string
  mode: 'light' | 'dark'
  colors: Record<string, string>
}
interface HatobaRuntime {
  SCHEMES: Scheme[]
  schemeFor: (mode: string, id: string) => Scheme
  schemesFor: (mode: string) => Scheme[]
  searchColors: (scheme: Scheme) => Record<string, string>
  contrast: (foreground: string, background: string) => number
  MATCH_CONTRAST: number
}

// schemes.ts has only a type import. Execute its actual registry and pure helpers in isolation.
const runtime = {} as HatobaRuntime
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
runInNewContext(compiled, { exports: runtime }, { filename, timeout: 1000 })
const root = fileURLToPath(new URL('../../dist/ports/lightweight/hatoba/', import.meta.url))
function readScheme(path: string): Scheme {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Scheme
  }
  catch (cause) {
    throw new Error(`Cannot read generated Hatoba scheme: ${path}`, { cause })
  }
}
for (const variant of VARIANTS) {
  const output = readScheme(join(root, `lig-${variant}.json`))
  for (const field of fields.filter(field => field.required))
    assert.ok(field.name in output, `${variant}: missing ${field.name}`)
  for (const key of Object.keys(output))
    assert.ok(fields.some(field => field.name === key), `${variant}: unknown TermScheme key ${key}`)
  assert.deepEqual(Object.keys(output.colors).sort(), [...requiredColors, 'cursorAccent'].sort())
  for (const value of Object.values(output.colors))
    assert.match(value, /^#[a-f0-9]{6}$/)
  assert.ok(!runtime.SCHEMES.some(scheme => scheme.id === output.id), `${output.id} is already built in`)
  runtime.SCHEMES.push(output)
  assert.equal(runtime.schemeFor(output.mode, output.id), output)
  assert.ok(runtime.schemesFor(output.mode).includes(output))
  assert.ok(!runtime.schemesFor(output.mode === 'dark' ? 'light' : 'dark').includes(output))
  const search = runtime.searchColors(output)
  for (const value of Object.values(search))
    assert.match(value, /^#[a-f0-9]{6}$/)
  for (const key of ['matchBackground', 'activeMatchBackground'])
    assert.ok(runtime.contrast(output.colors.foreground!, search[key]!) >= runtime.MATCH_CONTRAST)
  process.stdout.write(`${variant}: upstream TermScheme keys, SchemeColors keys, registry lookup, and search highlights passed\n`)
}
