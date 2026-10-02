import type { CoreSpec, LigVariant, ResolvedVariant, TokenBundle, TokenExpression } from './types'
import { blend, rgb } from './color'
import definition from './spec.json'

export const spec = definition as CoreSpec
export const VARIANTS = Object.keys(spec.variants) as LigVariant[]

export function resolveVariant(variant: LigVariant, source: CoreSpec = spec): ResolvedVariant {
  if (source.schemaVersion !== 1)
    throw new Error(`Unsupported schema version: ${source.schemaVersion}`)
  const selected = source.variants[variant]
  if (!selected)
    throw new Error(`Unknown variant: ${variant}`)
  if (selected.mode !== 'light' && selected.mode !== 'dark')
    throw new Error(`Unknown mode: ${selected.mode}`)
  const mode = source.modes[selected.mode]
  if (!mode)
    throw new Error(`Unknown mode: ${selected.mode}`)

  const primitives = new Map<string, string>()
  for (const [group, colors] of Object.entries(source.palette)) {
    for (const [name, hex] of Object.entries(colors)) {
      rgb(hex)
      primitives.set(`palette.${group}.${name}`, hex.toLowerCase())
    }
  }
  const expressions: Record<string, TokenExpression> = { ...source.tokens, ...mode }
  for (const [name, expression] of Object.entries(selected.overrides)) {
    if (!Object.hasOwn(expressions, name))
      throw new Error(`Unknown override token: ${name}`)
    expressions[name] = expression
  }
  const resolved = new Map<string, string>()
  const visiting = new Set<string>()

  function resolve(name: string): string {
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
    let hex: string
    if (typeof expression === 'string') {
      hex = resolve(expression)
    }
    else {
      if (expression.mix.length !== 2)
        throw new Error(`Mix needs two references: ${name}`)
      hex = blend(resolve(expression.mix[0]!), expression.weight, resolve(expression.mix[1]!))
    }
    visiting.delete(name)
    resolved.set(name, hex)
    return hex
  }

  return {
    mode: selected.mode,
    tokens: Object.fromEntries(Object.keys(expressions).map(name => [name, resolve(name)])),
  }
}

export function createTokenBundle(): TokenBundle {
  return {
    schemaVersion: spec.schemaVersion,
    version: spec.version,
    palette: spec.palette,
    variants: Object.fromEntries(VARIANTS.map(variant => [variant, resolveVariant(variant)])) as TokenBundle['variants'],
  }
}
