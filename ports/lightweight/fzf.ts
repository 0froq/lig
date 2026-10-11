import type { ThemeIR } from '../types'
import { color } from './common'

export const FZF_BINDINGS: Record<string, string> = {
  'fg': 'text.primary',
  'fg+': 'text.strong',
  'bg': 'surface.canvas',
  'bg+': 'surface.selection',
  'hl': 'accent.green.base',
  'hl+': 'accent.green.highlight',
  'info': 'text.secondary',
  'marker': 'accent.blue.base',
  'prompt': 'accent.green.base',
  'spinner': 'accent.orange.base',
  'pointer': 'text.strong',
  'header': 'text.secondary',
  'border': 'border.default',
  'label': 'text.secondary',
  'query': 'text.strong',
  'gutter': 'surface.canvas',
  'preview-fg': 'text.primary',
  'preview-bg': 'surface.canvas',
  'preview-border': 'border.default',
  'preview-label': 'text.secondary',
}

// An options-file fragment, not shell code. Preserve the user's preview/bind/layout.
export function fzf(theme: ThemeIR): string {
  return `--color=${theme.mode},${Object.entries(FZF_BINDINGS).map(([key, token]) => `${key}:${color(theme, token)}`).join(',')}\n`
}
