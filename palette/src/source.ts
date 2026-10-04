/** Website compatibility names; primitives are authored only in core/spec.json. */
import type definition from '../../core/spec.json'
import { resolvePalette } from '../../core'

const palette = resolvePalette()
export const accents = palette.accents
export const neutrals = palette.neutrals
export type AccentName = keyof typeof definition.palette.accents
export type NeutralName = keyof typeof definition.palette.neutrals
