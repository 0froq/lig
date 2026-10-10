import type { SyntaxDocument } from '../types'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFileSync } from 'node:fs'
import { it } from 'node:test'
import { resolveVariant, VARIANTS } from '../../core'
import { captureRole } from '../../core/syntax'
import bundle from '../generated/examples.json'
import { ancestry, byteIndices, segmentSource, sourceRange } from '../model'
import { parseSources } from '../scripts/neovim'

const documents = bundle.documents as SyntaxDocument[]

it('native syntax trees cover both source fixtures, including anonymous punctuation', () => {
  for (const document of documents) {
    assert.equal(document.source, readFileSync(new URL(`../samples/${document.filename}.txt`, import.meta.url), 'utf8'))
    assert.equal(document.hasError, false)
    assert.ok(document.nodes.length > 200)
    assert.ok(document.captures.length > 100)
    assert.ok(document.nodes.some(node => !node.named && node.type === '('))
    assert.equal(document.nodes[0]!.parent, null)
    for (const [id, node] of document.nodes.entries()) {
      assert.equal(node.id, id)
      assert.ok(Array.isArray(node.children))
      assert.equal(ancestry(document, id)[0]!.id, 0)
      assert.equal(Buffer.byteLength(sourceRange(document, node)), node.endByte - node.startByte)
      for (const child of node.children) {
        assert.equal(document.nodes[child]!.parent, id)
        assert.ok(document.nodes[child]!.startByte >= node.startByte)
        assert.ok(document.nodes[child]!.endByte <= node.endByte)
      }
    }
  }
})

it('segmentation is lossless and every capture maps to a core role or explicit metadata', () => {
  for (const document of documents) {
    const segments = segmentSource(document)
    assert.equal(segments.map(item => item.text).join(''), document.source)
    assert.equal(segments[0]!.startByte, 0)
    assert.equal(segments.at(-1)!.endByte, Buffer.byteLength(document.source))
    for (let i = 1; i < segments.length; i++)
      assert.equal(segments[i - 1]!.endByte, segments[i]!.startByte)
    for (const capture of document.captures) {
      const role = captureRole(capture.name)
      if (role) {
        assert.ok(role.matched, `Unmapped @${capture.name}`)
        for (const variant of VARIANTS)
          assert.ok(resolveVariant(variant).tokens[role.token], role.token)
      }
    }
  }
})

it('neovim queries distinguish types, parameters, action keywords and escaped strings', () => {
  const document = documents.find(item => item.language === 'typescript')!
  const segments = segmentSource(document)
  for (const [text, token] of [['TokenBundle', 'syntax.type'], ['variant', 'syntax.parameter'], ['await', 'syntax.keyword.action'], ['throw', 'syntax.keyword.action'], ['loadTheme', 'syntax.function'], ['fetch', 'syntax.function.call'], ['Error', 'syntax.constructor'], ['3', 'syntax.number'], ['\\n', 'syntax.special']])
    assert.ok(segments.some(item => item.text === text && item.token === token), `${text} → ${token}`)
  const types = segments.filter(item => item.text === 'TokenBundle')
  assert.ok(types.some(item => item.captures.length > 1), 'Overlapping captures retained')
  assert.equal(captureRole('function.method.call')?.matched, 'function.method.call')
  assert.equal(captureRole('_predicate'), null)
  assert.equal(captureRole('spell'), null)
})

it('overlapping captures obey priority and order, while metadata never paints', () => {
  const document = structuredClone(documents[0]!)
  const source = segmentSource(document).find(item => item.text === 'TokenBundle')!
  const capture = { name: 'string', node: source.node, startByte: source.startByte, endByte: source.endByte, priority: 200, order: 10000 }
  document.captures.push(capture, { ...capture, name: 'spell', priority: 1000, order: 10001 })
  assert.equal(segmentSource(document).find(item => item.startByte === source.startByte)!.token, 'syntax.string')
  document.captures.push({ ...capture, name: 'type', order: 10002 })
  assert.equal(segmentSource(document).find(item => item.startByte === source.startByte)!.token, 'syntax.type')
})

it('native parsing preserves multibyte text and exposes real recovery nodes', () => {
  const valid = 'const 色彩 = "🌿 café";\n// 日本語\n'
  const result = parseSources([
    { language: 'typescript', filename: 'unicode.ts', source: valid },
    { language: 'typescript', filename: 'broken.ts', source: 'const value = ;' },
    { language: 'python', filename: 'predicates.py', source: 'thing = VALUE\nprint("🌿")\n' },
  ]).documents
  const [unicode, broken, python] = result
  assert.equal(unicode!.hasError, false)
  assert.equal(segmentSource(unicode!).map(item => item.text).join(''), valid)
  assert.ok(unicode!.nodes.some(node => sourceRange(unicode!, node) === '色彩'))
  assert.equal(byteIndices('🌿').get(4), 2)
  assert.equal(broken!.hasError, true)
  assert.ok(broken!.nodes.some(node => node.error || node.missing))
  const segments = segmentSource(python!)
  assert.equal(segments.find(item => item.text === 'thing')!.token, 'syntax.variable')
  assert.equal(segments.find(item => item.text === 'VALUE')!.token, 'syntax.constant')
})
