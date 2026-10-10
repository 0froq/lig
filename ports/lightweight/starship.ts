import type { ThemeIR } from '../types'
import { ANSI_NAMES, color, heading } from './common'

export function starship(theme: ThemeIR): string {
  const name = `lig_${theme.variant.replaceAll('-', '_')}`
  const entries: Record<string, string> = {
    ...Object.fromEntries(ANSI_NAMES.map((name, index) => [name, color(theme, `terminal.ansi.${index}`)])),
    ...Object.fromEntries(ANSI_NAMES.map((name, index) => [`bright-${name}`, color(theme, `terminal.ansi.${index + 8}`)])),
    'purple': color(theme, 'accent.magenta.base'),
    'bright-purple': color(theme, 'accent.magenta.highlight'),
    'orange': color(theme, 'accent.orange.base'),
    'azure': color(theme, 'accent.azure.base'),
    'fg': color(theme, 'text.primary'),
    'bg': color(theme, 'surface.canvas'),
    'muted': color(theme, 'text.subtle'),
    'strong': color(theme, 'text.strong'),
  }
  return `${heading(theme)}palette = "${name}"\n\n[palettes.${name}]\n${
    Object.entries(entries).map(([key, value]) => `${key} = "${value}"\n`).join('')}`
}
