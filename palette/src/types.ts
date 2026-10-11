export type ColorTriad = [string, string, string]

export interface BuiltColors {
  [key: string]: string | ColorTriad | Record<string, string> | string[]
}

export interface SwatchEntry {
  name: string
  hex: string
  role: 'neutral' | 'accent'
  sourceKey: string
}

export interface SemanticRole {
  role: string
  hex: string
  baseRef: string
}
