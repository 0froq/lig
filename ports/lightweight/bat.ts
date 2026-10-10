import type { ThemeIR } from '../types'
import { requireStyle } from '../styles'
import { TEXTMATE } from '../vscode/bindings'
import { color } from './common'

const escape = (value: string): string => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const string = (value: string): string => `<string>${escape(value)}</string>`
const dict = (entries: Record<string, string>): string => `<dict>${Object.entries(entries).map(([key, value]) => `<key>${escape(key)}</key>${string(value)}`).join('')}</dict>`

/** bat/syntect and VS Code share TextMate intent, without copying the color table. */
export function bat(theme: ThemeIR): string {
  const defaults = {
    background: color(theme, 'surface.canvas'),
    foreground: color(theme, 'text.primary'),
    caret: color(theme, 'text.strong'),
    selection: color(theme, 'surface.selection'),
    lineHighlight: color(theme, 'surface.raised'),
    gutter: color(theme, 'surface.canvas'),
    gutterForeground: color(theme, 'text.subtle'),
  }
  const settings = TEXTMATE.map(({ scope, role }) => {
    const style = requireStyle(role)
    const attributes = ['bold', 'italic', 'underline'].filter(key => style[key as keyof typeof style] === true).join(' ')
    const settings = { ...(style.foreground ? { foreground: color(theme, style.foreground) } : {}), ...(attributes ? { fontStyle: attributes } : {}) }
    return `<dict><key>name</key>${string(`LiG ${role}`)}<key>scope</key>${string(scope.join(', '))}<key>settings</key>${dict(settings)}</dict>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>\n<key>name</key>${string(`LiG-${theme.variant}`)}\n<key>settings</key><array>\n<dict><key>settings</key>${dict(defaults)}</dict>\n${settings}\n</array></dict></plist>\n`
}
