import type { CoreSpec, LigVariant, Oklch, ResolvedVariant, TokenBundle, TokenExpression } from './types'
import { mixOklab, offsetOklch, oklchToHex, rampOklch, validateOklch } from './color'
import definition from './spec.json'

export const spec = definition as CoreSpec
export const VARIANTS = Object.keys(spec.variants) as LigVariant[]

export function resolveVariant(variant: LigVariant, source: CoreSpec = spec): ResolvedVariant {
  if (source.schemaVersion !== 2)
    throw new Error(`Unsupported schema version: ${source.schemaVersion}`)
  if (source.colorSpace !== 'oklch')
    throw new Error(`Unsupported color space: ${source.colorSpace}`)
  const selected = source.variants[variant]
  if (!selected)
    throw new Error(`Unknown variant: ${variant}`)
  if (selected.mode !== 'light' && selected.mode !== 'dark')
    throw new Error(`Unknown mode: ${selected.mode}`)
  const mode = source.modes[selected.mode]
  if (!mode)
    throw new Error(`Unknown mode: ${selected.mode}`)

  const primitives = new Map<string, Oklch>()
  for (const [group, colors] of Object.entries(source.palette)) {
    for (const [name, color] of Object.entries(colors)) {
      validateOklch(color)
      primitives.set(`palette.${group}.${name}`, color)
    }
  }
  const expressions: Record<string, TokenExpression> = { ...source.tokens, ...mode }
  for (const [name, expression] of Object.entries(selected.overrides)) {
    if (!Object.hasOwn(expressions, name))
      throw new Error(`Unknown override token: ${name}`)
    expressions[name] = expression
  }
  const resolved = new Map<string, Oklch>()
  const visiting = new Set<string>()

  function resolve(name: string): Oklch {
    const primitive = primitives.get(name)
    if (primitive !== undefined)
      return primitive
    const cached = resolved.get(name)
    if (cached !== undefined)
      return cached
    const expression = Object.hasOwn(expressions, name) ? expressions[name] : undefined
    if (expression === undefined)
      throw new Error(`Unknown token reference: ${name}`)
    if (visiting.has(name))
      throw new Error(`Token reference cycle: ${[...visiting, name].join(' → ')}`)
    visiting.add(name)
    let color: Oklch
    if (typeof expression === 'string') {
      color = resolve(expression)
    }
    else if ('mix' in expression) {
      if (expression.mix.length !== 2)
        throw new Error(`Mix needs two references: ${name}`)
      color = mixOklab(resolve(expression.mix[0]!), expression.weight, resolve(expression.mix[1]!))
    }
    else if ('offset' in expression) {
      color = offsetOklch(resolve(expression.offset), expression.lightness, expression.chroma)
    }
    else {
      color = rampOklch(resolve(expression.ramp), resolve(expression.toward), expression.lightness, expression.chroma)
    }
    visiting.delete(name)
    resolved.set(name, color)
    return color
  }

  return {
    mode: selected.mode,
    tokens: Object.fromEntries(Object.keys(expressions).map(name => [name, oklchToHex(resolve(name))])),
    oklch: Object.fromEntries(Object.keys(expressions).map(name => [name, resolve(name)])),
  }
}

export function resolvePalette(source: CoreSpec = spec): TokenBundle['palette'] {
  return {
    accents: Object.fromEntries(Object.entries(source.palette.accents).map(([name, color]) => [name, oklchToHex(color)])),
    neutrals: Object.fromEntries(Object.entries(source.palette.neutrals).map(([name, color]) => [name, oklchToHex(color)])),
  }
}

export function createTokenBundle(): TokenBundle {
  return {
    schemaVersion: spec.schemaVersion,
    version: spec.version,
    colorSpace: spec.colorSpace,
    palette: resolvePalette(),
    variants: Object.fromEntries(VARIANTS.map(variant => [variant, resolveVariant(variant)])) as TokenBundle['variants'],
  }
}
