import type { ThemeIR } from '../types'
import { color, heading } from './common'

export function ghostty(theme: ThemeIR): string {
  const bindings = {
    'background': 'terminal.background',
    'foreground': 'terminal.foreground',
    'cursor-color': 'terminal.cursor',
    'cursor-text': 'terminal.background',
    'selection-background': 'terminal.selection',
    'selection-foreground': 'text.primary',
  }
  return heading(theme) + Object.entries(bindings).map(([key, token]) => `${key} = ${color(theme, token)}\n`).join('')
    + Array.from({ length: 16 }, (_, index) => `palette = ${index}=${color(theme, `terminal.ansi.${index}`)}\n`).join('')
}
