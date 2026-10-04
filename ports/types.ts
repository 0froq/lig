import type { LigVariant, ResolvedVariant } from '../core/types'

export interface TextStyle {
  foreground?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

export interface HighlightBinding {
  role?: string
  fg?: string
  bg?: string
  sp?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  undercurl?: boolean
  strikethrough?: boolean
  reverse?: boolean
  link?: string
}

export interface ScopeBinding {
  scope: string[]
  role: string
}

export interface UiBinding {
  token: string
  alpha?: string
}

export interface ThemeIR extends ResolvedVariant {
  variant: LigVariant
  styles: Record<string, TextStyle>
}

export interface VscodeStyle {
  foreground?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

export interface BuildMetadata {
  schemaVersion: number
  designVersion: string
  compilerVersion: string
  inputHash: string
  sourceRepository: string
  sourceRef: string
  variants: LigVariant[]
  colorPolicy: string
}
