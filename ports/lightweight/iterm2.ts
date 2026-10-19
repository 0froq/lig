import type { ThemeIR } from '../types'
import { color } from './common'

const escape = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function real(value: number): string {
  return `<real>${value}</real>`
}

function srgbColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255
  return `<dict><key>Alpha Component</key>${real(1)}<key>Blue Component</key>${real(b)}<key>Color Space</key><string>sRGB</string><key>Green Component</key>${real(g)}<key>Red Component</key>${real(r)}</dict>`
}

/** iTerm2 color preset (Apple plist XML). */
export function iterm2(theme: ThemeIR): string {
  const entries: [string, string][] = [
    ...Array.from(
      { length: 16 },
      (_, index) =>
        [`Ansi ${index} Color`, color(theme, `terminal.ansi.${index}`)] as [string, string],
    ),
    ['Background Color', color(theme, 'terminal.background')],
    ['Foreground Color', color(theme, 'terminal.foreground')],
    ['Cursor Color', color(theme, 'terminal.cursor')],
    ['Cursor Text Color', color(theme, 'terminal.background')],
    ['Selection Color', color(theme, 'terminal.selection')],
    ['Selected Text Color', color(theme, 'text.primary')],
    ['Bold Color', color(theme, 'terminal.foreground')],
    ['Link Color', color(theme, 'terminal.ansi.4')],
  ]
  const body = entries.map(([key, hex]) => `<key>${escape(key)}</key>${srgbColor(hex)}`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>${body}</dict></plist>\n`
}
