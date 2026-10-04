import type { LigVariant } from '../core/types'
import type { TextStyle, ThemeIR } from './types'
import { resolveVariant } from '../core/resolve'

/** Editor-independent styles. Bindings choose these roles, never literal colors. */
export const STYLES: Record<string, TextStyle> = {
  'text': { foreground: 'text.primary' },
  'variable': { foreground: 'syntax.variable' },
  'variable.builtin': { foreground: 'syntax.variable.builtin' },
  'parameter.binding': { foreground: 'syntax.parameter' },
  'parameter.builtin': { foreground: 'syntax.parameter.builtin' },
  'property': { foreground: 'syntax.property' },
  'module': { foreground: 'syntax.module' },
  'module.definition': { foreground: 'syntax.module.builtin' },
  'attribute': { foreground: 'syntax.attribute' },
  'tag': { foreground: 'syntax.tag' },
  'tag.builtin': { foreground: 'syntax.tag.builtin' },
  'type.reference': { foreground: 'syntax.type' },
  'type.definition': { foreground: 'syntax.type.definition' },
  'constructor': { foreground: 'syntax.constructor' },
  'constant': { foreground: 'syntax.constant' },
  'constant.builtin': { foreground: 'syntax.constant.builtin' },
  'number': { foreground: 'syntax.number' },
  'function.definition': { foreground: 'syntax.function' },
  'function.call': { foreground: 'syntax.function.call' },
  'method.definition': { foreground: 'syntax.method' },
  'method.call': { foreground: 'syntax.method.call' },
  'keyword': { foreground: 'syntax.keyword' },
  'keyword.modifier': { foreground: 'syntax.keyword.modifier' },
  'keyword.directive': { foreground: 'syntax.keyword.directive' },
  'keyword.action': { foreground: 'syntax.keyword.action' },
  'operator': { foreground: 'syntax.operator' },
  'punctuation': { foreground: 'syntax.punctuation' },
  'string': { foreground: 'syntax.string' },
  'escape': { foreground: 'syntax.special' },
  'comment': { foreground: 'syntax.comment' },
  'comment.error': { foreground: 'diagnostic.error' },
  'comment.warning': { foreground: 'diagnostic.warning' },
  'comment.todo': { foreground: 'diagnostic.info' },
  'comment.note': { foreground: 'diagnostic.hint' },
  'markup.heading': { foreground: 'text.strong', bold: true },
  'markup.strong': { foreground: 'text.strong', bold: true },
  'markup.italic': { italic: true },
  'markup.quote': { foreground: 'text.primary', italic: true },
  'markup.link': { foreground: 'syntax.constant', underline: true },
  'markup.raw': { foreground: 'text.primary' },
  'modifier.defaultLibrary': { italic: true },
  'modifier.deprecated': { strikethrough: true },
}

export function requireStyle(role: string): TextStyle {
  const value = STYLES[role]
  if (!value)
    throw new Error(`Unknown style role: ${role}`)
  return value
}

export function requireToken(theme: ThemeIR, token: string): string {
  const value = theme.tokens[token]
  if (!value)
    throw new Error(`Missing token: ${token} (${theme.variant})`)
  return value
}

export function compileTheme(variant: LigVariant): ThemeIR {
  const theme = { ...resolveVariant(variant), variant, styles: STYLES }
  for (const style of Object.values(STYLES)) {
    if (style.foreground)
      requireToken(theme, style.foreground)
  }
  return theme
}
