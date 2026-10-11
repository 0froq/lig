import type { LigVariant } from '#palette/nvim-build'
import { VARIANTS } from '#palette/nvim-build'

export type Tone = 'light' | 'dark'
export type Edge = 'crisp' | 'paper'

export const VARIANT_OPTIONS: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-paper', label: 'palette.variants.lightPaper' },
  { id: 'dark-paper', label: 'palette.variants.darkPaper' },
]

/** Migrate retired website bookmarks/preferences without exporting soft themes. */
export function parseVariant(value: string | null): LigVariant | null {
  if (value === 'light-soft')
    return 'light-paper'
  if (value === 'dark-soft')
    return 'dark-paper'
  return VARIANTS.includes(value as LigVariant) ? value as LigVariant : null
}

export function splitVariant(variant: LigVariant): { tone: Tone, edge: Edge } {
  return {
    tone: variant.startsWith('dark') ? 'dark' : 'light',
    edge: variant.endsWith('paper') ? 'paper' : 'crisp',
  }
}

export function joinVariant(tone: Tone, edge: Edge): LigVariant {
  return edge === 'crisp' ? tone : `${tone}-${edge}`
}

/** Arrow keys move a radio group's selection and focus with it. */
export function radioKey(event: KeyboardEvent, ids: LigVariant[], current: LigVariant, set: (next: LigVariant) => void): void {
  const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
  if (!step)
    return
  event.preventDefault()
  const index = (ids.indexOf(current) + step + ids.length) % ids.length
  const next = ids[index]
  if (!next)
    return
  set(next)
  const group = (event.currentTarget as HTMLElement).closest('[role="radiogroup"]')
  group?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus()
}
