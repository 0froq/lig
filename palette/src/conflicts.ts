/**
 * Cross-repo comparison for documented conflicts (same role, different hex).
 */

import { neutrals } from './source'

export interface SourceConflict {
  key: string
  nvim: string
  vscode: string
  note: string
}

/** vscode `scripts/colors.ts` neutrals omit black/white; defaults match nvim literals. */
const vscodeNeutrals = { ...neutrals }
delete (vscodeNeutrals as Partial<typeof neutrals>).black
delete (vscodeNeutrals as Partial<typeof neutrals>).white

export function listBasePaletteConflicts(): SourceConflict[] {
  const conflicts: SourceConflict[] = []
  for (const key of Object.keys(neutrals) as (keyof typeof neutrals)[]) {
    if (key === 'black' || key === 'white') {
      conflicts.push({
        key: `neutrals.${key}`,
        nvim: neutrals[key],
        vscode: key === 'black' ? '#000000' : '#ffffff',
        note: 'vscode-theme-LiG omits key in colors.ts; theme template defaults apply',
      })
      continue
    }
    const v = neutrals[key]
    if (vscodeNeutrals[key as keyof typeof vscodeNeutrals] !== v) {
      conflicts.push({
        key: `neutrals.${key}`,
        nvim: v,
        vscode: vscodeNeutrals[key as keyof typeof vscodeNeutrals] ?? '(missing)',
        note: 'value mismatch',
      })
    }
  }
  return conflicts.filter(c => c.nvim.toLowerCase() !== c.vscode.toLowerCase() || c.note.includes('omit'))
}
