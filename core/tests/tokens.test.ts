import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { it } from 'node:test'
import { baseSwatches, buildVariant, cssVarName, semanticRoles } from '../../palette/src/nvim-build'
import { blend, contrast } from '../color'
import { createTokenBundle, resolveVariant, spec, VARIANTS } from '../index'

it('every variant resolves the same token contract regardless of call order', () => {
  const baseline = createTokenBundle()
  for (const variant of [...VARIANTS].reverse()) {
    buildVariant(variant)
    baseSwatches(variant)
    assert.deepEqual(resolveVariant(variant), baseline.variants[variant])
  }
  assert.deepEqual(createTokenBundle(), baseline)
  const names = Object.keys(baseline.variants.dark.tokens)
  for (const variant of VARIANTS) {
    assert.deepEqual(Object.keys(baseline.variants[variant].tokens), names)
    for (const hex of Object.values(baseline.variants[variant].tokens))
      assert.match(hex, /^#[0-9a-f]{6}$/)
  }
})

it('secondary text remains readable on canvas and is separate from status surfaces', () => {
  for (const variant of VARIANTS) {
    const { tokens } = resolveVariant(variant)
    assert.ok(contrast(tokens['text.secondary']!, tokens['surface.canvas']!) >= 4.5, variant)
    assert.notEqual(tokens['text.secondary'], tokens['surface.status'])
  }
})

it('soft canvases and mix weights have explicit, stable endpoints', () => {
  assert.equal(resolveVariant('dark').tokens['surface.canvas'], '#0a0a0a')
  assert.equal(resolveVariant('light').tokens['surface.canvas'], '#fafafa')
  assert.equal(resolveVariant('dark-soft').tokens['surface.canvas'], '#161616')
  assert.equal(resolveVariant('light-soft').tokens['surface.canvas'], '#eeeeee')
  assert.equal(blend('#000000', 0.5, '#ffffff'), '#808080')
  assert.equal(blend('#123456', 1, '#ffffff'), '#123456')
  assert.equal(blend('#123456', 0, '#ffffff'), '#ffffff')
  assert.throws(() => blend('#fff', 0.5, '#ffffff'), /color/i)
  assert.throws(() => blend('#000000', Number.NaN, '#ffffff'), /weight/i)
})

it('bad references, cycles, variants, schema versions and weights fail explicitly', () => {
  const withToken = (value: string | { mix: string[], weight: number }): typeof spec => ({
    ...spec,
    tokens: { ...spec.tokens, broken: value },
  })
  assert.throws(() => resolveVariant('dark', withToken('unknown')), /unknown/i)
  assert.throws(() => resolveVariant('dark', withToken('broken')), /cycle/i)
  assert.throws(() => resolveVariant('dark', withToken({ mix: ['text.primary', 'surface.canvas'], weight: 2 })), /weight/i)
  assert.throws(() => resolveVariant('dark', withToken({ mix: ['text.primary'], weight: 0.5 })), /two/i)
  assert.throws(() => resolveVariant('missing' as 'dark'), /variant/i)
  assert.throws(() => resolveVariant('dark', { ...spec, schemaVersion: 2 }), /schema/i)
})

it('website adapter reads core values and never depends on previous previews', () => {
  const baseline = buildVariant('dark')
  for (const variant of VARIANTS) {
    buildVariant(variant)
    baseSwatches(variant)
  }
  assert.deepEqual(buildVariant('dark'), baseline)
  const { tokens } = resolveVariant('dark')
  assert.equal(baseline.bg, tokens['surface.canvas'])
  assert.equal(baseline.fg_secondary, tokens['text.secondary'])
  assert.equal(baseline.func, tokens['syntax.function'])
  assert.deepEqual(baseline.green, ['highlight', 'base', 'faded'].map(step => tokens[`accent.green.${step}`]))
  assert.equal(baseSwatches('dark').find(swatch => swatch.name === 'green_hl')?.hex, tokens['accent.green.highlight'])
})

it('website CSS exports contain every exposed swatch and semantic token', () => {
  const css = readFileSync(new URL('../../palette/generated/tokens.css', import.meta.url), 'utf8')
  for (const variant of VARIANTS) {
    const entries = [
      ...baseSwatches(variant).map(({ name, hex }) => ({ name, hex })),
      ...semanticRoles(variant).map(({ role, hex }) => ({ name: role, hex })),
    ]
    for (const { name, hex } of entries)
      assert.ok(css.includes(`${cssVarName(variant, name)}: ${hex};`), `${variant}: ${name}`)
  }
})
