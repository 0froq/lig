import type { ThemeIR } from '../types'
import { color, heading } from './common'

export function tmux(theme: ThemeIR): string {
  const fg = color(theme, 'text.primary')
  const strong = color(theme, 'text.strong')
  const bg = color(theme, 'surface.canvas')
  const raised = color(theme, 'surface.raised')
  const selection = color(theme, 'surface.selection')
  const accent = color(theme, 'accent.green.base')
  const error = color(theme, 'diagnostic.error')
  return `${heading(theme) + [
    `set -g status-style 'fg=${fg},bg=${raised}'`,
    `set -g message-style 'fg=${strong},bg=${selection}'`,
    `set -g message-command-style 'fg=${strong},bg=${selection}'`,
    `set -g pane-border-style 'fg=${color(theme, 'border.default')},bg=${bg}'`,
    `set -g pane-active-border-style 'fg=${accent},bg=${bg}'`,
    `set -g mode-style 'fg=${strong},bg=${selection}'`,
    `set -g window-status-style 'fg=${color(theme, 'text.secondary')},bg=${raised}'`,
    `set -g window-status-current-style 'fg=${strong},bg=${selection},bold'`,
    `set -g window-status-activity-style 'fg=${accent},bg=${raised}'`,
    `set -g window-status-bell-style 'fg=${error},bg=${raised}'`,
    `set -g clock-mode-colour '${accent}'`,
  ].join('\n')}\n`
}
