/**
 * Theme resolution — mirrors lig.nvim `lua/lig/colors/template.lua` (`M.build`).
 */

import { accents, neutrals } from './source'
import * as util from './util'

export type LigVariant = 'light' | 'dark' | 'light-soft' | 'dark-soft'

export type ColorTriad = [string, string, string]

export interface BuiltColors {
  [key: string]: string | ColorTriad | Record<string, string> | string[]
}

function genTriad(base: string): ColorTriad {
  return [util.blendFg(base, 0.6), base, util.blendBg(base, 0.6)]
}

function getPalette(isLight: boolean): BuiltColors {
  const palette: BuiltColors = { ...neutrals }
  for (const [name, base] of Object.entries(accents)) {
    let triad = genTriad(base)
    if (isLight)
      triad = [triad[2], triad[1], triad[0]]
    palette[name] = triad
  }
  return palette
}

function applyStyle(colors: BuiltColors, style: LigVariant): void {
  const isLight = style.includes('light')
  const isSoft = style.includes('soft')
  const c = colors as Record<string, string | ColorTriad>

  if (isLight) {
    c.bg = isSoft ? util.blendBg(c.soft_50 as string, 0.95) : c.soft_50 as string
    c.bg_alt = isSoft ? c.soft_200 as string : c.soft_100 as string
    c.bg_float = isSoft ? util.blendBg(c.soft_50 as string, 0.95) : c.soft_50 as string
    c.bg_reversed = c.soft_900 as string
    c.bg_highlight = c.soft_600 as string
    c.fg = c.soft_700 as string
    c.fg_muted = c.soft_400 as string
    c.fg_dim = c.soft_200 as string
    c.fg_reversed = c.soft_100 as string
    c.fg_strong = c.soft_950 as string
  }
  else {
    c.bg = isSoft ? util.blendFg(c.soft_950 as string, 0.95) : c.soft_950 as string
    c.bg_alt = c.soft_900 as string
    c.bg_float = isSoft ? util.blendFg(c.soft_950 as string, 0.95) : c.soft_950 as string
    c.bg_reversed = c.soft_100 as string
    c.bg_highlight = c.soft_400 as string
    c.fg = c.soft_300 as string
    c.fg_muted = c.soft_600 as string
    c.fg_dim = c.soft_800 as string
    c.fg_reversed = c.soft_900 as string
    c.fg_strong = c.soft_50 as string
  }
}

function triadAt(triad: ColorTriad, index: 0 | 1 | 2): string {
  return triad[index]
}

function applyUi(colors: BuiltColors): void {
  const c = colors as Record<string, string | ColorTriad | Record<string, string>>
  util.setBlendContext({ bg: c.bg as string, fg: c.fg as string })

  c.bg_selection = util.blendFg(c.bg_alt as string, 0.95)
  c.bg_folded = util.blendFg(c.bg_alt as string, 0.8)
  c.bg_search = triadAt(c.yellow as ColorTriad, 1)
  c.bg_substitute = triadAt(c.red as ColorTriad, 1)
  c.bg_statusline = util.blendFg(c.bg as string, 0.9)
  c.fg_sidebar = c.fg_muted as string
  c.border = c.fg_muted as string
  c.divider = c.fg_muted as string
  c.shadow = c.fg_dim as string

  c.mode = {
    normal: triadAt(c.green as ColorTriad, 1),
    insert: c.bg_reversed as string,
    visual: triadAt(c.magenta as ColorTriad, 1),
    replace: triadAt(c.yellow as ColorTriad, 1),
    command: triadAt(c.blue as ColorTriad, 1),
    other: c.bg_highlight as string,
  }

  c.accent1 = triadAt(c.green as ColorTriad, 1)
  c.accent2 = triadAt(c.orange as ColorTriad, 1)
  c.none = 'NONE'
}

function applySemantic(colors: BuiltColors): void {
  const c = colors as Record<string, string | ColorTriad | Record<string, string> | string[]>
  c.git = {
    add: triadAt(c.green as ColorTriad, 1),
    delete: triadAt(c.red as ColorTriad, 1),
    change: triadAt(c.yellow as ColorTriad, 1),
    ignore: c.fg_muted as string,
  }
  c.diag = {
    error: triadAt(c.red as ColorTriad, 1),
    warn: triadAt(c.yellow as ColorTriad, 1),
    info: triadAt(c.cyan as ColorTriad, 1),
    hint: triadAt(c.green as ColorTriad, 1),
    ok: triadAt(c.blue as ColorTriad, 1),
  }
  c.msg = {
    success: triadAt(c.green as ColorTriad, 1),
    failure: triadAt(c.red as ColorTriad, 1),
    warning: triadAt(c.yellow as ColorTriad, 1),
    info: triadAt(c.cyan as ColorTriad, 1),
  }
}

function applySyntax(colors: BuiltColors): void {
  const c = colors as Record<string, string | ColorTriad>
  const struct = c.struct as ColorTriad || (c.green as ColorTriad)
  const ref = c.ref as ColorTriad || (c.blue as ColorTriad)
  const action = c.action as ColorTriad || (c.orange as ColorTriad)

  c.struct = struct
  c.ref = ref
  c.action = action
  c.member = c.cyan as ColorTriad

  const syntax: Record<string, string> = {
    keyword: c.fg as string,
    string: c.fg_muted as string,
    comment: c.fg_muted as string,
    type: triadAt(struct, 1),
    constant: triadAt(ref, 1),
    number: triadAt(ref, 1),
    func: triadAt(action, 1),
    method: triadAt(action, 1),
    operator: c.fg_muted as string,
    special: triadAt(c.red as ColorTriad, 1),
    variable: c.fg as string,
    property: c.fg as string,
    tag: triadAt(struct, 1),
  }
  Object.assign(c, syntax)
}

function applySemanticRoles(colors: BuiltColors): void {
  const c = colors as Record<string, string | ColorTriad>
  c.struct = c.green as ColorTriad
  c.ref = c.blue as ColorTriad
  c.action = c.orange as ColorTriad
  c.member = c.cyan as ColorTriad
  applySemantic(colors)
  applySyntax(colors)
}

export function buildVariant(style: LigVariant): BuiltColors {
  const isLight = style.includes('light')
  const colors = getPalette(isLight)
  applyStyle(colors, style)
  applyUi(colors)
  applySemanticRoles(colors)
  return colors
}

export interface SwatchEntry {
  name: string
  hex: string
  role: 'neutral' | 'accent'
  sourceKey: string
}

/** Base swatches for a variant (neutrals + accent triads oriented for the flavor). */
export function baseSwatches(style: LigVariant): SwatchEntry[] {
  const isLight = style.includes('light')
  const palette = getPalette(isLight)
  const entries: SwatchEntry[] = []

  for (const [name, hex] of Object.entries(neutrals)) {
    entries.push({
      name,
      hex,
      role: 'neutral',
      sourceKey: `neutrals.${name}`,
    })
  }

  for (const name of Object.keys(accents) as (keyof typeof accents)[]) {
    const triad = palette[name] as ColorTriad
    const suffixes = ['hl', 'base', 'fd'] as const
    triad.forEach((hex, i) => {
      entries.push({
        name: `${name}_${suffixes[i]}`,
        hex,
        role: 'accent',
        sourceKey: `accents.${name} (triad[${i}])`,
      })
    })
  }

  return entries
}

export interface SemanticRole {
  role: string
  hex: string
  baseRef: string
}

const SEMANTIC_KEYS: { key: string, group?: string }[] = [
  { key: 'bg' },
  { key: 'bg_alt' },
  { key: 'bg_float' },
  { key: 'fg' },
  { key: 'fg_muted' },
  { key: 'fg_dim' },
  { key: 'fg_strong' },
  { key: 'border' },
  { key: 'accent1' },
  { key: 'accent2' },
  { key: 'diag.error', group: 'diag' },
  { key: 'diag.warn', group: 'diag' },
  { key: 'diag.info', group: 'diag' },
  { key: 'diag.hint', group: 'diag' },
  { key: 'git.add', group: 'git' },
  { key: 'git.delete', group: 'git' },
  { key: 'git.change', group: 'git' },
]

export function semanticRoles(style: LigVariant): SemanticRole[] {
  const built = buildVariant(style)
  const c = built as Record<string, string | Record<string, string>>
  return SEMANTIC_KEYS.map(({ key, group }) => {
    let hex: string
    let baseRef: string
    if (group) {
      const part = key.split('.')[1]!
      const obj = c[group] as Record<string, string>
      hex = obj[part] ?? '#000000'
      baseRef = `${group}.${part}`
    }
    else {
      hex = c[key] as string
      baseRef = key
    }
    return { role: key.replace('.', '_'), hex, baseRef }
  })
}

export const VARIANTS: LigVariant[] = ['light', 'dark', 'light-soft', 'dark-soft']

export function cssVarName(variant: LigVariant, token: string): string {
  const slug = variant.replace(/-/g, '_')
  return `--lig-${slug}-${token.replace(/[._]/g, '-')}`
}
