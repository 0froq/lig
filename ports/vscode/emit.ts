import type { ThemeIR, VscodeStyle } from '../types'
import { DECLARATIONS, SEMANTIC_TYPES } from '../semantics'
import { requireStyle, requireToken } from '../styles'
import { LANGUAGE_SEMANTIC, TEXTMATE } from './bindings'
import { WORKBENCH } from './workbench'

export function vscodeStyle(theme: ThemeIR, role: string): VscodeStyle {
  const { foreground, ...attributes } = requireStyle(role)
  return foreground ? { foreground: requireToken(theme, foreground), ...attributes } : attributes
}

export function vscodeTheme(theme: ThemeIR, name: string): object {
  const semanticTokenColors: Record<string, VscodeStyle> = {}
  for (const [type, role] of Object.entries(SEMANTIC_TYPES))
    semanticTokenColors[type] = vscodeStyle(theme, role)
  for (const [type, role] of Object.entries(DECLARATIONS)) {
    for (const modifier of ['declaration', 'definition'])
      semanticTokenColors[`${type}.${modifier}`] = vscodeStyle(theme, role)
  }
  semanticTokenColors['*.defaultLibrary'] = vscodeStyle(theme, 'modifier.defaultLibrary')
  semanticTokenColors['*.deprecated'] = vscodeStyle(theme, 'modifier.deprecated')
  for (const [selector, role] of Object.entries(LANGUAGE_SEMANTIC))
    semanticTokenColors[selector] = vscodeStyle(theme, role)
  return {
    $schema: 'vscode://schemas/color-theme',
    name,
    type: theme.mode,
    semanticHighlighting: true,
    semanticTokenColors,
    colors: Object.fromEntries(Object.entries(WORKBENCH).map(([key, binding]) => [key, requireToken(theme, binding.token) + (binding.alpha ?? '')])),
    tokenColors: TEXTMATE.map(({ scope, role }) => {
      const style = vscodeStyle(theme, role)
      const fontStyle = ['bold', 'italic', 'underline', 'strikethrough'].filter(attribute => style[attribute as keyof VscodeStyle] === true).join(' ')
      return { name: `LiG ${role}`, scope, settings: {
        ...(style.foreground ? { foreground: style.foreground } : {}),
        ...(fontStyle ? { fontStyle } : {}),
      } }
    }),
  }
}
