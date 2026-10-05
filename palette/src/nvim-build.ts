/** Compatibility adapter for the website's original nvim-shaped palette API. */
import type { LigVariant } from '../../core'
import type { BuiltColors, ColorTriad, SemanticRole, SwatchEntry } from './types'
import { resolveVariant } from '../../core'
import { GROUP_ALIASES, ROLE_ALIASES, SEMANTIC_KEYS } from './constants'
import { accents, neutrals } from './source'

export type { LigVariant } from '../../core'
export { VARIANTS } from '../../core'
export type * from './types'

function requiredToken(tokens: Record<string, string>, name: string): string {
  const hex = tokens[name]
  if (hex === undefined)
    throw new Error(`Website adapter references missing core token: ${name}`)
  return hex
}

function triad(tokens: Record<string, string>, name: string): ColorTriad {
  return [
    requiredToken(tokens, `accent.${name}.highlight`),
    requiredToken(tokens, `accent.${name}.base`),
    requiredToken(tokens, `accent.${name}.faded`),
  ]
}

export function buildVariant(style: LigVariant): BuiltColors {
  const { tokens } = resolveVariant(style)
  const colors: BuiltColors = { ...neutrals, none: 'NONE' }
  for (const name of Object.keys(accents))
    colors[name] = triad(tokens, name)
  for (const [name, token] of Object.entries(ROLE_ALIASES))
    colors[name] = requiredToken(tokens, token)
  for (const [group, aliases] of Object.entries(GROUP_ALIASES))
    colors[group] = Object.fromEntries(Object.entries(aliases).map(([name, token]) => [name, requiredToken(tokens, token)]))
  for (const family of ['struct', 'ref', 'action', 'mono'])
    colors[family] = ['highlight', 'base', 'muted'].map(tier => requiredToken(tokens, `family.${family}.${tier}`))
  colors.member = triad(tokens, 'cyan')
  return colors
}

export function baseSwatches(style: LigVariant): SwatchEntry[] {
  const { tokens } = resolveVariant(style)
  const entries: SwatchEntry[] = Object.entries(neutrals).map(([name, hex]) => ({
    name,
    hex,
    role: 'neutral',
    sourceKey: `palette.neutrals.${name}`,
  }))
  for (const name of Object.keys(accents)) {
    const steps = { hl: 'highlight', base: 'base', fd: 'faded' }
    for (const [suffix, step] of Object.entries(steps)) {
      const sourceKey = `accent.${name}.${step}`
      entries.push({ name: `${name}_${suffix}`, hex: requiredToken(tokens, sourceKey), role: 'accent', sourceKey })
    }
  }
  return entries
}

export function semanticRoles(style: LigVariant): SemanticRole[] {
  const { tokens } = resolveVariant(style)
  const aliases: Record<string, string> = { ...ROLE_ALIASES }
  for (const [group, members] of Object.entries(GROUP_ALIASES)) {
    for (const [name, token] of Object.entries(members))
      aliases[`${group}.${name}`] = token
  }
  return SEMANTIC_KEYS.map((key) => {
    const baseRef = aliases[key]!
    return { role: key.replace('.', '_'), hex: requiredToken(tokens, baseRef), baseRef }
  })
}

export function cssVarName(variant: LigVariant, token: string): string {
  return `--lig-${variant.replace(/-/g, '_')}-${token.replace(/[._]/g, '-')}`
}
