/** Website compatibility names; primitives are authored only in core/spec.json. */
import definition from '../../core/spec.json'

export const accents = definition.palette.accents
export const neutrals = definition.palette.neutrals
export type AccentName = keyof typeof accents
export type NeutralName = keyof typeof neutrals
