import type { ThemeIR } from '../types'
import { VARIANT_LABELS } from '../constants'
import { ANSI_NAMES, color } from './common'

/** A registry entry for Hatoba's SCHEMES, not a user-importable theme file. */
export function hatobaScheme(theme: ThemeIR) {
  const colors = {
    background: color(theme, 'terminal.background'),
    foreground: color(theme, 'terminal.foreground'),
    cursor: color(theme, 'terminal.cursor'),
    cursorAccent: color(theme, 'terminal.background'),
    selectionBackground: color(theme, 'terminal.selection'),
    ...Object.fromEntries(ANSI_NAMES.flatMap((name, index) => [
      [name, color(theme, `terminal.ansi.${index}`)],
      [`bright${name[0]!.toUpperCase()}${name.slice(1)}`, color(theme, `terminal.ansi.${index + 8}`)],
    ])),
  }
  return {
    id: `lig-${theme.variant}`,
    name: VARIANT_LABELS[theme.variant],
    mode: theme.mode,
    // Hatoba's light schemes use xterm's contrast floor for dark-oriented programs.
    contrast: theme.mode === 'light' ? 3 : 1,
    colors,
  }
}

export function hatoba(theme: ThemeIR): string {
  return `${JSON.stringify(hatobaScheme(theme), null, 2)}\n`
}
