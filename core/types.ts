export type LigVariant = 'light' | 'dark' | 'light-soft' | 'dark-soft' | 'light-paper' | 'dark-paper'
export type LigMode = 'light' | 'dark'

/** L is 0–1, C is nonnegative, H is degrees (null for achromatic colors). */
export interface Oklch {
  readonly l: number
  readonly c: number
  readonly h: number | null
}

/** weight is the contribution of mix[0], interpolated in OKLab. */
export type TokenExpression = string | {
  readonly mix: readonly string[]
  readonly weight: number
} | {
  readonly ramp: string
  readonly toward: string
  /** Fraction of the distance from the source L to the target L. */
  readonly lightness: number
  /** Multiplier for source C; source H is retained. */
  readonly chroma: number
} | {
  /** Fixed OKLCH deltas from a source; H is retained. Invalid results fail. */
  readonly offset: string
  readonly lightness: number
  readonly chroma: number
}

export interface CoreSpec {
  readonly schemaVersion: number
  readonly version: string
  readonly colorSpace: 'oklch'
  readonly palette: {
    readonly accents: Readonly<Record<string, Oklch>>
    readonly neutrals: Readonly<Record<string, Oklch>>
    readonly paper: Readonly<Record<string, Oklch>>
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
  oklch: Record<string, Oklch>
}

export interface TokenBundle {
  schemaVersion: number
  version: string
  colorSpace: 'oklch'
  palette: { accents: Record<string, string>, neutrals: Record<string, string>, paper: Record<string, string> }
  variants: Record<LigVariant, ResolvedVariant>
}
