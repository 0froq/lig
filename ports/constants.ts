import type { LigVariant } from '../core/types'

export const COMPILER_VERSION = '0.7.2'
export const PACKAGE_VERSION = '0.2.2'
export const SOURCE_REF = 'codex/mono-muted-parity'
export const VARIANT_LABELS: Record<LigVariant, string> = {
  'dark': 'LiG Dark',
  'light': 'LiG Light',
  'light-paper': 'LiG Light Paper',
  'dark-paper': 'LiG Dark Paper',
}

export const NEOVIM_VERSION = '0.2.2'
export const NEOVIM_SOURCE_REF = SOURCE_REF
