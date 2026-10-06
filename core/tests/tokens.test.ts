import type { LigVariant, Oklch, TokenExpression } from '../types'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { it } from 'node:test'
import { baseSwatches, buildVariant, cssVarName, semanticRoles } from '../../palette/src/nvim-build'
import { apcaContrast, blend, contrast, hexToOklch, mapToSrgb, mixOklab, offsetOklch, oklchToHex, rampOklch } from '../color'
import { createTokenBundle, resolveVariant, spec, syntaxFamily, VARIANTS } from '../index'

// Calibration floors for the selected canvases, not universal readability criteria.
const contrastFloors = {
  'light': { primary: 4.5, secondary: 4.5, highlight: 5.5, base: 4, faded: 3 },
  'light-soft': { primary: 4.5, secondary: 4, highlight: 4.2, base: 3.4, faded: 2.7 },
  'dark': { primary: 4.5, secondary: 4.5, highlight: 4.5, base: 4.5, faded: 4.5 },
  'dark-soft': { primary: 4.5, secondary: 4.5, highlight: 4.5, base: 4.5, faded: 4.5 },
}
const lightLcFloors = {
  'light': { highlight: 72, base: 63, faded: 53 },
  'light-soft': { highlight: 58, base: 52, faded: 45 },
}

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

it('foreground hierarchy preserves calibrated contrast and quieter muted ink', () => {
  for (const variant of VARIANTS) {
    const { tokens, oklch, mode } = resolveVariant(variant)
    const foregrounds = ['text.primary', 'text.secondary', 'text.subtle']
    const floors = contrastFloors[variant]
    for (const role of ['text.strong', 'text.primary', 'text.secondary'])
      assert.ok(contrast(tokens[role]!, tokens['surface.canvas']!) >= (role === 'text.secondary' ? floors.secondary : floors.primary), `${variant}/${role}`)
    const contrasts = ['text.strong', ...foregrounds].map(role => contrast(tokens[role]!, tokens['surface.canvas']!))
    for (let i = 1; i < contrasts.length; i++)
      assert.ok(contrasts[i - 1]! > contrasts[i]!, `${variant}: contrast hierarchy`)
    const lightnesses = foregrounds.map(role => oklch[role]!.l)
    for (let i = 1; i < lightnesses.length; i++)
      assert.ok(mode === 'dark' ? lightnesses[i - 1]! > lightnesses[i]! : lightnesses[i - 1]! < lightnesses[i]!, `${variant}: foreground hierarchy`)
    assert.equal(tokens['syntax.comment'], tokens['text.subtle'])
    assert.equal(tokens['syntax.punctuation'], tokens['text.subtle'])
    for (const role of ['syntax.string', 'syntax.operator'])
      assert.equal(tokens[role], tokens['text.secondary'])
    for (const [role, hex] of Object.entries(tokens)) {
      const family = syntaxFamily(role, variant)
      // Muted mono and light chromatic tiers intentionally prioritize hierarchy.
      const lighterInk = family === 'mono.muted' || (mode === 'light' && family?.endsWith('.muted'))
      if (role.startsWith('syntax.') && !lighterInk) {
        const mono = family?.startsWith('mono.')
        const tier = family?.endsWith('.highlight') ? 'highlight' : 'base'
        const floor = mono ? family === 'mono.secondary' ? floors.secondary : floors.primary : floors[tier]
        assert.ok(contrast(hex, tokens['surface.canvas']!) >= floor, `${variant}/${role}: calibrated syntax contrast`)
        if (!mono && mode === 'light')
          assert.ok(apcaContrast(hex, tokens['surface.canvas']!) >= lightLcFloors[variant as 'light' | 'light-soft'][tier], `${variant}/${role}: calibrated Lc`)
      }
    }
    assert.notEqual(tokens['border.default'], tokens['text.subtle'])
    assert.equal(tokens['border.divider'], tokens['border.default'])
    assert.equal(oklch['border.default']!.c, 0)
    assert.notEqual(tokens['text.secondary'], tokens['surface.status'])
  }
})

it('canvases and raised surfaces use independently calibrated neutral lightness', () => {
  const canvases = { 'dark': ['#090909', 0.14], 'light': ['#f2f2f2', 0.96], 'dark-soft': ['#181818', 0.21], 'light-soft': ['#dedede', 0.90] } as const
  const raised = { 'dark': ['#181818', 0.21], 'light': ['#ffffff', 1], 'dark-soft': ['#2e2e2e', 0.30], 'light-soft': ['#f2f2f2', 0.96] } as const
  for (const variant of VARIANTS) {
    const { tokens, oklch } = resolveVariant(variant)
    assert.equal(tokens['surface.canvas'], canvases[variant][0])
    assert.equal(oklch['surface.canvas']!.l, canvases[variant][1])
    assert.equal(tokens['surface.raised'], raised[variant][0])
    assert.ok(Math.abs(oklch['surface.raised']!.l - raised[variant][1]) < 1e-12)
    assert.ok(oklch['surface.raised']!.l > oklch['surface.canvas']!.l)
    assert.ok(Math.abs(oklch['surface.raised']!.l - oklch['surface.canvas']!.l) >= 0.04 - 1e-12)
    assert.ok(Math.abs(oklch['surface.selection']!.l - oklch['surface.canvas']!.l) >= 0.03, `${variant}: selection/canvas separation`)
    assert.ok(contrast(tokens['text.primary']!, tokens['surface.selection']!) >= 4.5, `${variant}: selected text contrast`)
  }
  assert.equal(blend('#000000', 0.5, '#ffffff'), '#636363')
  assert.equal(blend('#123456', 1, '#ffffff'), '#123456')
  assert.equal(blend('#123456', 0, '#ffffff'), '#ffffff')
  assert.throws(() => blend('#fff', 0.5, '#ffffff'), /color/i)
  assert.throws(() => blend('#000000', Number.NaN, '#ffffff'), /weight/i)
})

it('APCA reports signed Lc values with text-first polarity', () => {
  assert.equal(apcaContrast('#ffffff', '#ffffff'), 0)
  assert.ok(apcaContrast('#111111', '#ffffff') > 100)
  assert.ok(apcaContrast('#ffffff', '#111111') < -100)
  assert.ok(apcaContrast('#6f6f6f', '#ffffff') > 70)
})

it('bad references, cycles, variants, schema versions and weights fail explicitly', () => {
  const withToken = (value: TokenExpression): typeof spec => ({
    ...spec,
    tokens: { ...spec.tokens, broken: value },
  })
  assert.throws(() => resolveVariant('dark', withToken('unknown')), /unknown/i)
  assert.throws(() => resolveVariant('dark', withToken('broken')), /cycle/i)
  assert.throws(() => resolveVariant('dark', withToken({ mix: ['text.primary', 'surface.canvas'], weight: 2 })), /weight/i)
  assert.throws(() => resolveVariant('dark', withToken({ mix: ['text.primary'], weight: 0.5 })), /two/i)
  assert.throws(() => resolveVariant('missing' as 'dark'), /variant/i)
  assert.throws(() => resolveVariant('dark', { ...spec, schemaVersion: 1 }), /schema/i)
  assert.throws(() => resolveVariant('dark', { ...spec, colorSpace: 'srgb' as 'oklch' }), /space/i)
  assert.throws(() => resolveVariant('dark', withToken({ ramp: 'accent.green.base', toward: 'text.primary', lightness: Number.NaN, chroma: 0.8 })), /lightness/i)
  assert.throws(() => resolveVariant('dark', withToken({ ramp: 'broken', toward: 'text.primary', lightness: 0.2, chroma: 0.8 })), /cycle/i)
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
      ...Object.entries(resolveVariant(variant).tokens).filter(([name]) => name.startsWith('family.')).map(([name, hex]) => ({ name, hex })),
    ]
    for (const { name, hex } of entries)
      assert.ok(css.includes(`${cssVarName(variant, name)}: ${hex};`), `${variant}: ${name}`)
  }
})

it('neutral ramp separates near-white exports and retains the middle/dark calibration', () => {
  const neutrals = {
    white: 1,
    soft_50: 0.96,
    soft_100: 0.90,
    soft_200: 0.84,
    soft_300: 0.78,
    soft_400: 0.68,
    soft_500: 0.58,
    soft_600: 0.48,
    soft_700: 0.38,
    soft_800: 0.30,
    soft_900: 0.21,
    soft_950: 0.14,
    black: 0,
  }
  const bundle = createTokenBundle()
  assert.equal(bundle.schemaVersion, 2)
  assert.equal(bundle.colorSpace, 'oklch')
  for (const [name, l] of Object.entries(neutrals)) {
    assert.deepEqual(spec.palette.neutrals[name], { l, c: 0, h: null })
    const hex = bundle.palette.neutrals[name]!
    assert.equal(hex.slice(1, 3), hex.slice(3, 5))
    assert.equal(hex.slice(3, 5), hex.slice(5, 7))
    // Near black, one 8-bit sRGB step spans more perceptual lightness.
    assert.ok(Math.abs(hexToOklch(hex).l - l) < (l < 0.10 ? 0.006 : l < 0.25 ? 0.003 : 0.002), `${name}: exported L`)
  }
  const levels = Object.values(neutrals)
  for (let i = 1; i < levels.length; i++)
    assert.ok(levels[i - 1]! > levels[i]!)
  for (const [first, second] of [[300, 400], [400, 500], [500, 600], [600, 700]])
    assert.ok(Math.abs(spec.palette.neutrals[`soft_${first}`]!.l - spec.palette.neutrals[`soft_${second}`]!.l - 0.10) < 1e-12)
  const nearWhite = ['white', 'soft_50', 'soft_100', 'soft_200', 'soft_300']
  for (let i = 1; i < nearWhite.length; i++) {
    const first = nearWhite[i - 1]!
    const second = nearWhite[i]!
    const targetGap = i === 1 ? 0.04 : 0.06
    assert.ok(Math.abs(neutrals[first as keyof typeof neutrals] - neutrals[second as keyof typeof neutrals] - targetGap) < 1e-12)
    const firstHex = bundle.palette.neutrals[first]!
    const secondHex = bundle.palette.neutrals[second]!
    assert.ok(hexToOklch(firstHex).l - hexToOklch(secondHex).l >= targetGap - 0.004)
    // Guard exported separation too; this is a design threshold, not a JND claim.
    const byteGap = Number.parseInt(firstHex.slice(1, 3), 16) - Number.parseInt(secondHex.slice(1, 3), 16)
    assert.ok(byteGap >= (i === 1 ? 12 : 18), `${first}/${second}: near-white channel separation`)
  }
  assert.equal(new Set(Object.values(bundle.palette.neutrals)).size, levels.length)
})

it('eight authored accents share intentional lightness/chroma and distinct hue anchors', () => {
  const hues = { red: 22, green: 148, yellow: 100, blue: 275, magenta: 325, cyan: 194, orange: 60, azure: 234 }
  assert.deepEqual(Object.keys(spec.palette.accents).sort(), Object.keys(hues).sort())
  for (const [name, hue] of Object.entries(hues)) {
    const color = spec.palette.accents[name]!
    assert.equal(color.l, 0.74, name)
    assert.equal(color.c, 0.12, name)
    assert.equal(color.h, hue, name)
  }
  const angles = Object.values(hues).sort((a, b) => a - b)
  for (let i = 0; i < angles.length; i++) {
    const gap = (angles[(i + 1) % angles.length]! - angles[i]! + 360) % 360
    assert.ok(gap >= 38 && gap <= 57, `Hue separation: ${gap}`)
  }
})

it('each variant keeps layers balanced through sRGB export and calibrated canvas contrast', () => {
  const mappedTiers: Record<LigVariant, string[]> = {
    'dark': ['blue.highlight'],
    'dark-soft': [],
    'light': ['yellow.highlight', 'cyan.highlight', 'cyan.base', 'cyan.faded', 'azure.highlight'],
    'light-soft': ['yellow.highlight', 'cyan.highlight', 'cyan.base', 'cyan.faded', 'azure.highlight'],
  }

  for (const variant of VARIANTS) {
    const { tokens, oklch, mode } = resolveVariant(variant)
    for (const layer of ['base', 'highlight', 'faded'] as const) {
      const coordinates = Object.keys(spec.palette.accents).map(name => oklch[`accent.${name}.${layer}`]!)
      assert.ok(Math.max(...coordinates.map(c => c.l)) - Math.min(...coordinates.map(c => c.l)) < 1e-12, `${variant}/${layer} L`)
      assert.ok(Math.max(...coordinates.map(c => c.c)) - Math.min(...coordinates.map(c => c.c)) < 1e-12, `${variant}/${layer} C`)
      const exported = Object.keys(spec.palette.accents).map((name) => {
        const key = `accent.${name}.${layer}`
        const color = oklch[key]!
        const mapped = mapToSrgb(color)
        if (mappedTiers[variant].includes(`${name}.${layer}`)) {
          assert.equal(mapped.l, color.l)
          assert.equal(mapped.h, color.h)
          assert.ok(mapped.c < color.c, `${variant}/${key}: sRGB boundary`)
        }
        else {
          assert.deepEqual(mapped, color, `${variant}/${key}: no chroma reduction`)
        }
        assert.ok(contrast(tokens[key]!, tokens['surface.canvas']!) >= contrastFloors[variant][layer], `${variant}/${key}: calibrated layer`)
        if (mode === 'light')
          assert.ok(apcaContrast(tokens[key]!, tokens['surface.canvas']!) >= lightLcFloors[variant as 'light' | 'light-soft'][layer], `${variant}/${key}: calibrated Lc`)
        const result = hexToOklch(tokens[key]!)
        assert.ok(Math.abs(result.l - mapped.l) < 0.002, `${variant}/${key}: exported L`)
        assert.ok(Math.abs(result.c - mapped.c) < 0.002, `${variant}/${key}: exported C`)
        // Low-chroma colors amplify angular rounding error; check perceptual distance.
        const angle = Math.PI / 180
        const delta = Math.hypot(
          result.l - mapped.l,
          result.c * Math.cos(result.h! * angle) - mapped.c * Math.cos(mapped.h! * angle),
          result.c * Math.sin(result.h! * angle) - mapped.c * Math.sin(mapped.h! * angle),
        )
        assert.ok(delta < 0.002, `${variant}/${key}: 8-bit export deltaE OK`)
        return result
      })
      // Two colors can each round by <0.002 in opposite lightness directions.
      assert.ok(Math.max(...exported.map(c => c.l)) - Math.min(...exported.map(c => c.l)) < 0.004, `${variant}/${layer} exported L spread`)
      const gamutAllowance = Math.max(...coordinates.map(color => color.c - mapToSrgb(color).c))
      assert.ok(Math.max(...exported.map(c => c.c)) - Math.min(...exported.map(c => c.c)) < 0.003 + gamutAllowance, `${variant}/${layer} exported C spread`)
    }
    for (const name of Object.keys(spec.palette.accents)) {
      const key = `accent.${name}.base`
      const base = oklch[key]!
      assert.ok(Math.abs(base.l - (mode === 'dark' ? 0.74 : 0.55)) < 1e-12, `${variant}/${name}: mode lightness`)
      assert.ok(Math.abs(base.c - (mode === 'dark' ? 0.12 : 0.11)) < 1e-12)
      assert.ok(contrast(tokens[key]!, tokens['surface.canvas']!) >= contrastFloors[variant].base, `${variant}/${name}: canvas contrast`)
    }
  }
})

it('conversion matches reference primary colors and round-trips sRGB samples', () => {
  const red = hexToOklch('#ff0000')
  assert.ok(Math.abs(red.l - 0.62795536) < 1e-7)
  assert.ok(Math.abs(red.c - 0.25768331) < 1e-7)
  assert.ok(Math.abs(red.h! - 29.233885) < 1e-5)
  for (const hex of ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#808080', '#010203', '#abcdef'])
    assert.equal(oklchToHex(hexToOklch(hex)), hex)
  assert.deepEqual(hexToOklch('#000000'), { l: 0, c: 0, h: null })
  assert.equal(hexToOklch('#ffffff').h, null)
  assert.throws(() => oklchToHex({ l: -0.1, c: 0, h: null }), /OKLCH/i)
  assert.throws(() => oklchToHex({ l: 0.5, c: 0.1, h: null }), /OKLCH/i)
  assert.throws(() => oklchToHex({ l: 0.5, c: 0.1, h: Number.NaN }), /OKLCH/i)
})

it('OKLab mixes preserve neutral axes and endpoints without intermediate 8-bit quantization', () => {
  const first = { l: 0.2, c: 0, h: null }
  const second = { l: 0.8, c: 0, h: null }
  assert.deepEqual(mixOklab(first, 0.5, second), { l: 0.5, c: 0, h: null })
  assert.deepEqual(mixOklab(first, 1, second), first)
  assert.deepEqual(mixOklab(first, 0, second), second)
  const variant = resolveVariant('dark')
  assert.equal(variant.tokens['surface.status'], oklchToHex(variant.oklch['surface.status']!))
  assert.ok(Math.abs(variant.oklch['surface.status']!.l - hexToOklch(variant.tokens['surface.status']!).l) > 1e-5)
})

it('accent ramps preserve hue and follow the mode emphasis direction', () => {
  for (const variant of VARIANTS) {
    const { tokens, oklch, mode } = resolveVariant(variant)
    for (const name of Object.keys(spec.palette.accents)) {
      const base = oklch[`accent.${name}.base`]!
      for (const step of ['highlight', 'faded'] as const) {
        const color = oklch[`accent.${name}.${step}`]!
        assert.equal(color.h, base.h)
        if (mode === 'light') {
          assert.equal(color.c, base.c)
          const distance = variant === 'light-soft' ? 0.05 : 0.07
          assert.ok(Math.abs(color.l - base.l - (step === 'highlight' ? -distance : distance)) < 1e-12)
        }
        else {
          assert.ok(color.c < base.c)
          const distance = variant === 'dark-soft' ? 0.06 : 0.07
          assert.ok(Math.abs(color.l - base.l - (step === 'highlight' ? distance : -distance)) < 1e-12)
        }
        const brighter = mode === 'dark' ? step === 'highlight' : step === 'faded'
        assert.ok(brighter ? color.l > base.l : color.l < base.l)
        assert.equal(tokens[`accent.${name}.${step}`], oklchToHex(color))
      }
    }
  }
  assert.equal(rampOklch(spec.palette.accents.green!, spec.palette.neutrals.white!, 0.5, 0).h, null)
})

it('out-of-gamut export reduces chroma at constant lightness and hue', () => {
  const vivid = { l: 0.7, c: 0.4, h: 30 }
  const mapped = mapToSrgb(vivid)
  assert.equal(mapped.l, vivid.l)
  assert.equal(mapped.h, vivid.h)
  assert.ok(mapped.c > 0 && mapped.c < vivid.c)
  const roundTrip = hexToOklch(oklchToHex(vivid))
  assert.ok(Math.abs(roundTrip.l - vivid.l) < 0.003)
  assert.ok(Math.abs(roundTrip.h! - vivid.h) < 1)
  assert.deepEqual(mapToSrgb(mapped), mapped)
  assert.equal(oklchToHex({ l: 0, c: 0.4, h: 30 }), '#000000')
  assert.equal(oklchToHex({ l: 1, c: 0.4, h: 30 }), '#ffffff')
})

it('syntax roles preserve the mono/struct/ref/action family contract', () => {
  assert.equal(syntaxFamily('syntax.variable'), 'mono.highlight')
  assert.equal(syntaxFamily('syntax.keyword'), 'mono.base')
  assert.equal(syntaxFamily('syntax.property'), 'mono.base')
  assert.equal(syntaxFamily('syntax.variable.builtin'), 'ref.highlight')
  assert.equal(syntaxFamily('syntax.type'), 'ref.muted')
  assert.equal(syntaxFamily('syntax.number'), 'ref.base')
  assert.equal(syntaxFamily('syntax.special'), 'ref.highlight')
  assert.equal(syntaxFamily('syntax.parameter'), 'struct.base')
  assert.equal(syntaxFamily('syntax.keyword.modifier'), 'struct.base')
  assert.equal(syntaxFamily('syntax.function'), 'action.highlight')
  assert.equal(syntaxFamily('syntax.function.call'), 'action.base')
  assert.equal(syntaxFamily('syntax.keyword.action'), 'action.base')
  assert.equal(syntaxFamily('syntax.comment'), 'mono.muted')
  assert.equal(syntaxFamily('syntax.constructor'), 'action.base')
  for (const variant of VARIANTS) {
    const { tokens } = resolveVariant(variant)
    const built = buildVariant(variant)
    for (const family of ['mono', 'struct', 'ref', 'action'])
      assert.deepEqual(built[family], ['highlight', 'base', 'muted'].map(tier => tokens[`family.${family}.${tier}`]))
    for (const name of Object.keys(tokens).filter(name => name.startsWith('syntax.'))) {
      const family = syntaxFamily(name, variant)
      assert.ok(family, name)
      assert.equal(tokens[name], tokens[`family.${family}`])
    }
    const tier = spec.variants[variant].mode === 'light' ? 'base' : 'highlight'
    for (const role of ['syntax.function', 'syntax.method']) {
      assert.equal(syntaxFamily(role, variant), `action.${tier}`)
      assert.equal(tokens[role], tokens[`family.action.${tier}`])
    }
  }
})

it('mono tiers select existing neutral steps in the mode emphasis direction', () => {
  const selections = {
    'light': ['soft_800', 'soft_600', 'soft_400'],
    'dark': ['soft_50', 'soft_300', 'soft_500'],
    'light-soft': ['soft_700', 'soft_600', 'soft_500'],
    'dark-soft': ['soft_100', 'soft_300', 'soft_500'],
  }
  for (const variant of VARIANTS) {
    const { oklch, tokens, mode } = resolveVariant(variant)
    const tiers = ['highlight', 'base', 'muted']
    for (const [i, tier] of tiers.entries()) {
      const neutral = spec.palette.neutrals[selections[variant][i]!]!
      assert.deepEqual(oklch[`family.mono.${tier}`], neutral)
      assert.equal(tokens[`family.mono.${tier}`], oklchToHex(neutral))
    }
    const lightness = tiers.map(tier => oklch[`family.mono.${tier}`]!.l)
    for (let i = 1; i < lightness.length; i++) {
      const delta = lightness[i]! - lightness[i - 1]!
      assert.ok(mode === 'light' ? delta > 0 : delta < 0)
      assert.ok(Math.abs(delta) >= 0.10 - 1e-12)
    }
  }
})

it('soft variants reduce extreme contrast without desaturating base accents or breaking aliases', () => {
  for (const [softName, standardName] of [['light-soft', 'light'], ['dark-soft', 'dark']] as const) {
    const soft = resolveVariant(softName)
    const standard = resolveVariant(standardName)
    assert.notEqual(soft.tokens['surface.canvas'], standard.tokens['surface.canvas'])
    assert.ok(contrast(soft.tokens['text.strong']!, soft.tokens['surface.canvas']!) < contrast(standard.tokens['text.strong']!, standard.tokens['surface.canvas']!))
    assert.ok(contrast(soft.tokens['text.primary']!, soft.tokens['surface.canvas']!) < contrast(standard.tokens['text.primary']!, standard.tokens['surface.canvas']!))
    for (const name of Object.keys(spec.palette.accents)) {
      const key = `accent.${name}.base`
      assert.deepEqual(soft.oklch[key], standard.oklch[key], `${softName}/${name}: base color identity`)
      assert.equal(soft.tokens[key], standard.tokens[key])
      const softSpan = Math.abs(soft.oklch[`accent.${name}.highlight`]!.l - soft.oklch[`accent.${name}.faded`]!.l)
      const standardSpan = Math.abs(standard.oklch[`accent.${name}.highlight`]!.l - standard.oklch[`accent.${name}.faded`]!.l)
      assert.ok(softSpan < standardSpan, `${softName}/${name}: gentler tier span`)
    }
    for (const [token, source] of Object.entries({
      'terminal.background': 'surface.canvas',
      'terminal.foreground': 'text.primary',
      'terminal.ansi.15': 'text.strong',
      'terminal.ansi.2': 'accent.green.base',
      'terminal.ansi.10': 'accent.green.highlight',
      'syntax.variable': 'family.mono.highlight',
      'syntax.keyword': 'family.mono.base',
      'syntax.comment': 'family.mono.muted',
      'syntax.parameter': 'family.struct.base',
      'syntax.type': 'family.ref.muted',
      'syntax.function': soft.mode === 'light' ? 'family.action.base' : 'family.action.highlight',
    })) {
      assert.equal(soft.tokens[token], soft.tokens[source], `${softName}/${token}: shared alias`)
      assert.deepEqual(soft.oklch[token], soft.oklch[source])
    }
    // Raised light-soft panels are intentionally lighter than the gray canvas.
    assert.ok(contrast(soft.tokens['text.primary']!, soft.tokens['surface.raised']!) >= 4.5)
    assert.notEqual(soft.tokens['text.dim'], soft.tokens['surface.canvas'])
  }
})

it('both sides of chromatic families and accents have balanced perceptual distances', () => {
  for (const variant of VARIANTS) {
    const { tokens, oklch, mode } = resolveVariant(variant)
    const groups = [
      ...Object.keys(spec.palette.accents).map(name => [`accent.${name}`, 'faded']),
      ...['struct', 'ref', 'action'].map(name => [`family.${name}`, 'muted']),
    ]
    for (const [group, end] of groups) {
      const [highlight, base, muted] = ['highlight', 'base', end].map(tier => oklch[`${group}.${tier}`]!)
      const distance = (first: Oklch, second: Oklch) => {
        const a = (first.h ?? 0) * Math.PI / 180
        const b = (second.h ?? 0) * Math.PI / 180
        return Math.hypot(first.l - second.l, first.c * Math.cos(a) - second.c * Math.cos(b), first.c * Math.sin(a) - second.c * Math.sin(b))
      }
      const left = distance(highlight!, base!)
      const right = distance(muted!, base!)
      assert.ok(left > 0.03, `${variant}/${group}: visible step`)
      assert.ok(Math.abs(left - right) < 1e-12, `${variant}/${group}: symmetric design distance`)
      const exported = ['highlight', 'base', end].map(tier => hexToOklch(tokens[`${group}.${tier}`]!))
      assert.ok(Math.abs(distance(exported[0]!, exported[1]!) - distance(exported[2]!, exported[1]!)) < 0.004, `${variant}/${group}: symmetric exported distance`)
      assert.ok(mode === 'dark' ? highlight!.l > base!.l && base!.l > muted!.l : highlight!.l < base!.l && base!.l < muted!.l, `${variant}/${group}: correct emphasis direction`)
    }
  }
})

it('OKLCH offsets preserve hue, use fixed distances and reject invalid coordinates', () => {
  const source = { l: 0.5, c: 0.1, h: 120 }
  assert.deepEqual(offsetOklch(source, 0.125, -0.05), { l: 0.625, c: 0.05, h: 120 })
  assert.equal(offsetOklch(source, 0, -0.1).h, null)
  assert.throws(() => offsetOklch(source, 0.6, 0), /OKLCH/)
  assert.throws(() => offsetOklch(source, 0, -0.2), /OKLCH/)
  assert.throws(() => offsetOklch(source, Number.NaN, 0), /offset/)
  assert.throws(() => offsetOklch(source, 0, Number.POSITIVE_INFINITY), /offset/)
  const broken = { ...spec, tokens: { ...spec.tokens, broken: { offset: 'broken', lightness: 0, chroma: 0 } } }
  assert.throws(() => resolveVariant('dark', broken), /cycle/)
})
