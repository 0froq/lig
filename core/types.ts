export type LigVariant = 'light' | 'dark' | 'light-soft' | 'dark-soft'
export type LigMode = 'light' | 'dark'

/** weight is the contribution of mix[0], in encoded sRGB channels. */
export type TokenExpression = string | {
  readonly mix: readonly string[]
  readonly weight: number
}

export interface CoreSpec {
  readonly schemaVersion: number
  readonly version: string
  readonly palette: {
    readonly accents: Readonly<Record<string, string>>
    readonly neutrals: Readonly<Record<string, string>>
  }
  readonly tokens: Readonly<Record<string, TokenExpression>>
  readonly modes: Readonly<Record<LigMode, Readonly<Record<string, TokenExpression>>>>
  readonly variants: Readonly<Record<LigVariant, {
    readonly mode: LigMode
    readonly overrides: Readonly<Record<string, TokenExpression>>
  }>>
}

export interface ResolvedVariant {
  mode: LigMode
  tokens: Record<string, string>
}

export interface TokenBundle {
  schemaVersion: number
  version: string
  palette: CoreSpec['palette']
  variants: Record<LigVariant, ResolvedVariant>
}
