import type { ThemeIR } from '../types'
import { VARIANT_LABELS } from '../constants'
import { ANSI_NAMES, color } from './common'

const WT_ANSI = [...ANSI_NAMES.slice(0, 5), 'purple', ...ANSI_NAMES.slice(6)] as const
const WT_BRIGHT = WT_ANSI.map(name => `bright${name[0]!.toUpperCase()}${name.slice(1)}`)

/** Windows Terminal color scheme JSON (Settings import). */
export function windowsTerminal(theme: ThemeIR): string {
  const scheme = {
    name: VARIANT_LABELS[theme.variant],
    background: color(theme, 'terminal.background'),
    foreground: color(theme, 'terminal.foreground'),
    cursorColor: color(theme, 'terminal.cursor'),
    selectionBackground: color(theme, 'terminal.selection'),
    ...Object.fromEntries(
      WT_ANSI.map((name, index) => [name, color(theme, `terminal.ansi.${index}`)]),
    ),
    ...Object.fromEntries(
      WT_BRIGHT.map((name, index) => [name, color(theme, `terminal.ansi.${index + 8}`)]),
    ),
  }
  return `${JSON.stringify(scheme, null, 2)}\n`
}
