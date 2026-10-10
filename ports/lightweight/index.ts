import type { LightweightPort } from '../catalog'
import type { ThemeIR } from '../types'
import { LIGHTWEIGHT_PORTS, lightweightPath } from '../catalog'
import { bat } from './bat'
import { eza } from './eza'
import { fzf } from './fzf'
import { ghostty } from './ghostty'
import { starship } from './starship'
import { tmux } from './tmux'
import { zellij } from './zellij'

const emitters: Record<LightweightPort, (theme: ThemeIR) => string> = { ghostty, fzf, zellij, tmux, starship, bat, eza }

export function lightweightArtifacts(themes: ThemeIR[]): Record<string, string> {
  return Object.fromEntries(themes.flatMap(theme => LIGHTWEIGHT_PORTS.map(port => [lightweightPath(port, theme.variant), emitters[port.id](theme)])))
}
