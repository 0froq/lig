import type { LigVariant } from '#palette/nvim-build'

export type Tone = 'light' | 'dark'
export type Edge = 'crisp' | 'soft' | 'paper'

export const VARIANT_OPTIONS: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft' },
  { id: 'light-paper', label: 'palette.variants.lightPaper' },
  { id: 'dark-paper', label: 'palette.variants.darkPaper' },
]

export function splitVariant(variant: LigVariant): { tone: Tone, edge: Edge } {
  return {
    tone: variant.startsWith('dark') ? 'dark' : 'light',
    edge: variant.endsWith('paper') ? 'paper' : variant.endsWith('soft') ? 'soft' : 'crisp',
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
