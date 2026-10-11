import type { LigVariant } from './types'
import { spec } from './resolve'

/** Shared Neovim capture vocabulary -> semantic color roles. No literal colors. */
export const SYNTAX_CAPTURES: Record<string, string> = {
  'none': 'text.primary',
  'variable': 'syntax.variable',
  'variable.builtin': 'syntax.variable.builtin',
  'variable.parameter': 'syntax.parameter',
  'variable.parameter.builtin': 'syntax.parameter.builtin',
  'variable.member': 'syntax.property',
  'property': 'syntax.property',
  'module': 'syntax.module',
  'module.builtin': 'syntax.module.builtin',
  'attribute': 'syntax.attribute',
  'tag': 'syntax.tag',
  'tag.builtin': 'syntax.tag.builtin',
  'tag.attribute': 'syntax.property',
  'tag.delimiter': 'syntax.punctuation',
  'type': 'syntax.type',
  'type.definition': 'syntax.type.definition',
  'type.builtin': 'syntax.type',
  'constructor': 'syntax.constructor',
  // Lua's constructor capture paints table braces, not callable symbols.
  'constructor.lua': 'syntax.punctuation',
  'constant': 'syntax.constant',
  'constant.builtin': 'syntax.constant.builtin',
  'constant.macro': 'syntax.constant.builtin',
  'label': 'syntax.constant',
  'number': 'syntax.number',
  'boolean': 'syntax.constant',
  'function': 'syntax.function',
  'function.call': 'syntax.function.call',
  'function.builtin': 'syntax.function',
  'function.macro': 'syntax.function',
  'function.method': 'syntax.method',
  'function.method.call': 'syntax.method.call',
  'keyword': 'syntax.keyword',
  'keyword.modifier': 'syntax.keyword.modifier',
  'keyword.directive': 'syntax.keyword.directive',
  'keyword.coroutine': 'syntax.keyword.action',
  'keyword.return': 'syntax.keyword.action',
  'keyword.exception': 'syntax.keyword.action',
  'keyword.debug': 'syntax.keyword.action',
  'keyword.operator': 'syntax.operator',
  'operator': 'syntax.operator',
  'punctuation': 'syntax.punctuation',
  'punctuation.special': 'syntax.punctuation',
  'punctuation.bracket': 'syntax.punctuation',
  'punctuation.delimiter': 'syntax.punctuation',
  'string': 'syntax.string',
  'string.escape': 'syntax.special',
  'string.regexp': 'syntax.special',
  'character': 'syntax.string',
  'character.special': 'syntax.special',
  'comment': 'syntax.comment',
  'comment.error': 'diagnostic.error',
  'comment.warning': 'diagnostic.warning',
  'comment.todo': 'diagnostic.info',
  'comment.note': 'diagnostic.hint',
  'markup': 'text.primary',
  'markup.heading': 'text.strong',
  'markup.strong': 'text.strong',
  'markup.quote': 'text.primary',
  'markup.link': 'syntax.constant',
  'markup.link.url': 'syntax.constant',
  'markup.link.label': 'text.primary',
  'markup.raw': 'text.primary',
}

export interface SyntaxDecorations {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

/** Decoration-only captures inherit the foreground of underlying captures. */
export const SYNTAX_DECORATIONS: Record<string, SyntaxDecorations> = {
  'markup.heading': { bold: true },
  'markup.strong': { bold: true },
  'markup.italic': { italic: true },
  'markup.quote': { italic: true },
  'markup.link': { underline: true },
  'markup.link.url': { underline: true },
  // The label deliberately uses ordinary text rather than the link URL style.
  'markup.link.label': {},
  'markup.strikethrough': { strikethrough: true },
  'markup.underline': { underline: true },
}

export function captureDecorations(capture: string): SyntaxDecorations {
  let name = capture
  while (name) {
    if (SYNTAX_DECORATIONS[name])
      return SYNTAX_DECORATIONS[name]!
    name = name.slice(0, !name.includes('.') ? 0 : name.lastIndexOf('.'))
  }
  return {}
}

export function captureRole(capture: string): { token: string, matched: string | null } | null {
  // Predicate helper captures and spell annotations do not paint text.
  if (capture.startsWith('_') || capture === 'spell' || capture === 'nospell')
    return null
  let name = capture
  while (name) {
    if (SYNTAX_CAPTURES[name])
      return { token: SYNTAX_CAPTURES[name]!, matched: name }
    if (SYNTAX_DECORATIONS[name])
      return null
    name = name.slice(0, !name.includes('.') ? 0 : name.lastIndexOf('.'))
  }
  return { token: 'text.primary', matched: null }
}

/** Syntax roles alias a family/tier in the core spec; the inspector uses the same link. */
export function syntaxFamily(token: string, variant?: LigVariant): string | null {
  const selected = variant ? spec.variants[variant] : undefined
  const value = selected?.overrides[token] ?? (selected ? spec.modes[selected.mode][token] : undefined) ?? spec.tokens[token]
  return typeof value === 'string' && value.startsWith('family.') ? value.slice(7) : null
}
