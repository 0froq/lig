import type { BuildMetadata, HighlightBinding, ThemeIR } from '../types'
import { spec } from '../../core/resolve'
import { DECLARATIONS, SEMANTIC_TYPES } from '../semantics'
import { requireStyle, requireToken, STYLES } from '../styles'
import { BASE, CAPTURES } from './bindings'
import { INTEGRATIONS } from './integrations'
import { KINDS } from './integrations/kinds'
import { STATUSLINE } from './statusline'

export function neovimGroups(includePlugins = true): Record<string, HighlightBinding> {
  const groups: Record<string, HighlightBinding> = { ...BASE, ...CAPTURES, ...KINDS, '@lsp': {} }
  for (const [type, role] of Object.entries(SEMANTIC_TYPES))
    groups[`@lsp.type.${type}`] = { role }
  for (const [type, role] of Object.entries(DECLARATIONS)) {
    for (const mod of ['declaration', 'definition'])
      groups[`@lsp.typemod.${type}.${mod}`] = { role }
  }
  groups['@lsp.mod.defaultLibrary'] = { role: 'modifier.defaultLibrary' }
  groups['@lsp.mod.deprecated'] = { role: 'modifier.deprecated' }
  for (const mod of ['static', 'abstract', 'async', 'modification', 'documentation', 'readonly', 'declaration', 'definition'])
    groups[`@lsp.mod.${mod}`] = {}
  for (const severity of ['Error', 'Warn', 'Info', 'Hint', 'Ok']) {
    const token = `diagnostic.${severity === 'Warn' ? 'warning' : severity.toLowerCase()}`
    groups[`Diagnostic${severity}`] = { fg: token }
    groups[`DiagnosticSign${severity}`] = { fg: token }
    groups[`DiagnosticVirtualText${severity}`] = { fg: token }
    groups[`DiagnosticFloating${severity}`] = { fg: token, bg: 'surface.floating' }
    groups[`DiagnosticUnderline${severity}`] = { sp: token, undercurl: true }
  }
  groups.DiagnosticDeprecated = { strikethrough: true }
  for (const [group, token] of Object.entries({ 'DiffAdd': 'git.add', 'DiffDelete': 'git.delete', 'DiffChange': 'git.change', 'DiffText': 'git.change', '@diff.plus': 'git.add', '@diff.minus': 'git.delete', '@diff.delta': 'git.change' }))
    groups[group] = { fg: token }
  for (const name of ['SpellBad', 'SpellCap', 'SpellLocal', 'SpellRare'])
    groups[name] = { sp: 'diagnostic.error', undercurl: true }
  if (includePlugins) {
    for (const integration of Object.values(INTEGRATIONS)) {
      for (const [name, binding] of Object.entries(integration.groups)) {
        if (groups[name])
          throw new Error(`Duplicate native group: ${name}`)
        groups[name] = binding
      }
    }
  }
  return groups
}

export function neovimData(themes: ThemeIR[], metadata: BuildMetadata): object {
  for (const [name, binding] of Object.entries(neovimGroups())) {
    if (binding.link && Object.keys(binding).length !== 1)
      throw new Error(`Link mixed with attributes: ${name}`)
    if (binding.role)
      requireStyle(binding.role)
    for (const key of ['fg', 'bg', 'sp'] as const) {
      if (binding[key]) {
        for (const theme of themes)
          requireToken(theme, binding[key]!)
      }
    }
  }
  for (const sections of Object.values(STATUSLINE)) {
    for (const binding of Object.values(sections)) {
      for (const theme of themes) {
        requireToken(theme, binding.fg)
        requireToken(theme, binding.bg)
      }
    }
  }
  return {
    metadata,
    styles: STYLES,
    groups: neovimGroups(false),
    integrations: INTEGRATIONS,
    statusline: STATUSLINE,
    variants: Object.fromEntries(themes.map(theme => ({ theme, expressions: { ...spec.tokens, ...spec.modes[theme.mode], ...spec.variants[theme.variant].overrides } })).map(({ theme, expressions }) => [theme.variant, {
      mode: theme.mode,
      tokens: theme.tokens,
      aliases: Object.fromEntries(Object.entries(expressions).filter(([name, expression]) => typeof expression === 'string' && Object.hasOwn(theme.tokens, expression) && name !== expression)),
    }])),
  }
}
