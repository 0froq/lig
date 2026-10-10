import type { LigVariant } from '../core/types'

/** Download metadata only; safe to share with the website without compiler code. */
export const LIGHTWEIGHT_PORTS = [
  { id: 'ghostty', title: 'Ghostty', extension: '', docs: 'https://ghostty.org/docs/features/theme' },
  { id: 'fzf', title: 'fzf', extension: '.fzfrc', docs: 'https://github.com/junegunn/fzf/blob/master/man/man1/fzf.1' },
  { id: 'zellij', title: 'Zellij', extension: '.kdl', docs: 'https://zellij.dev/documentation/themes' },
  { id: 'tmux', title: 'tmux', extension: '.conf', docs: 'https://github.com/tmux/tmux/wiki/Getting-Started' },
  { id: 'starship', title: 'Starship', extension: '.toml', docs: 'https://starship.rs/config/#prompt' },
  { id: 'bat', title: 'bat', extension: '.tmTheme', docs: 'https://github.com/sharkdp/bat#adding-new-themes' },
  { id: 'eza', title: 'eza', extension: '.yml', docs: 'https://github.com/eza-community/eza-themes' },
] as const

export type LightweightPort = typeof LIGHTWEIGHT_PORTS[number]['id']

export function lightweightPath(port: typeof LIGHTWEIGHT_PORTS[number], variant: LigVariant): string {
  return `${port.id}/${port.id === 'bat' ? 'LiG' : 'lig'}-${variant}${port.extension}`
}
