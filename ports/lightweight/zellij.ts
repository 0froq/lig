import type { ThemeIR } from '../types'
import { color, heading, onColor, rgb } from './common'

export function zellij(theme: ThemeIR): string {
  const fg = color(theme, 'text.primary')
  const strong = color(theme, 'text.strong')
  const bg = color(theme, 'surface.canvas')
  const selection = color(theme, 'surface.selection')
  const raised = color(theme, 'surface.raised')
  const green = color(theme, 'accent.green.base')
  const blue = color(theme, 'accent.blue.base')
  const orange = color(theme, 'accent.orange.base')
  const red = color(theme, 'diagnostic.error')
  const emphases = [orange, blue, green, red]
  const components: Record<string, [string, string, string[]?]> = {
    text_unselected: [fg, bg],
    text_selected: [strong, selection],
    ribbon_unselected: [fg, raised],
    ribbon_selected: [onColor(theme, green), green, [onColor(theme, green), onColor(theme, green), onColor(theme, green), onColor(theme, green)]],
    table_title: [strong, bg],
    table_cell_unselected: [fg, bg],
    table_cell_selected: [strong, selection],
    list_unselected: [fg, bg],
    list_selected: [strong, selection],
    frame_unselected: [color(theme, 'border.default'), bg],
    frame_selected: [green, bg],
    frame_highlight: [orange, bg],
    exit_code_success: [green, bg],
    exit_code_error: [red, bg],
  }
  let output = `${heading(theme, '//')}themes {\n  "lig-${theme.variant}" {\n`
  for (const [name, [base, background, emphasis = emphases]] of Object.entries(components)) {
    output += `    ${name} {\n      base ${rgb(base)}\n      background ${rgb(background)}\n`
    output += emphasis.map((hex, index) => `      emphasis_${index} ${rgb(hex)}\n`).join('')
    output += '    }\n'
  }
  const players = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'orange', 'azure']
  output += '    multiplayer_user_colors {\n'
  output += Array.from({ length: 10 }, (_, index) => `      player_${index + 1} ${rgb(color(theme, `accent.${players[index % players.length]}.base`))}\n`).join('')
  return `${output}    }\n  }\n}\n`
}
