import type { PluginIntegration } from '../../types'

// Adapted from lig.nvim; upstream provenance and complete group coverage are in coverage.json.
export const GIT_INTEGRATIONS: Record<string, PluginIntegration> = {
  gitsigns: {
    plugin: 'gitsigns.nvim',
    groups: {
      GitSignsUntrackedNr: {
        fg: 'git.ignore.visible',
      },
      GitSignsUntrackedCul: {
        fg: 'git.ignore.visible',
      },
      GitSignsChangeDelete: {
        fg: 'git.change',
      },
      GitSignsChangeDeleteLn: {
        bg: 'surface.git.change.line',
      },
      GitSignsChangeDeleteNr: {
        fg: 'git.change',
      },
      GitSignsChangeDeleteCul: {
        fg: 'git.change',
      },
      GitSignsStagedChangedelete: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsStagedChangedeleteLn: {
        bg: 'surface.git.change.line',
      },
      GitSignsStagedChangedeleteNr: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsStagedChangedeleteCul: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsAdd: {
        fg: 'git.add',
      },
      GitSignsAddLn: {
        bg: 'surface.git.add.line',
      },
      GitSignsAddNr: {
        fg: 'git.add',
      },
      GitSignsAddCul: {
        fg: 'git.add',
      },
      GitSignsAddPreview: {
        bg: 'surface.git.add.inline',
      },
      GitSignsAddLnInline: {
        bg: 'surface.git.add.inline',
      },
      GitSignsChange: {
        fg: 'git.change',
      },
      GitSignsChangeLn: {
        bg: 'surface.git.change.line',
      },
      GitSignsChangeNr: {
        fg: 'git.change',
      },
      GitSignsChangeCul: {
        fg: 'git.change',
      },
      GitSignsChangeLnInline: {
        bg: 'surface.git.change.inline',
      },
      GitSignsDelete: {
        fg: 'git.delete',
      },
      GitSignsDeleteVirtLn: {
        bg: 'surface.git.delete.line',
      },
      GitSignsDeleteNr: {
        fg: 'git.delete',
      },
      GitSignsDeleteCul: {
        fg: 'git.delete',
      },
      GitSignsDeletePreview: {
        bg: 'surface.git.delete.inline',
      },
      GitSignsDeleteLnInline: {
        bg: 'surface.git.delete.inline',
      },
      GitSignsAddInline: {
        bg: 'surface.git.add.inline',
      },
      GitSignsChangeInline: {
        bg: 'surface.git.change.inline',
      },
      GitSignsDeleteInline: {
        bg: 'surface.git.delete.inline',
      },
      GitSignsCurrentLineBlame: {
        fg: 'text.dim',
      },
      GitSignsVirtLnum: {
        fg: 'text.dim',
      },
      GitSignsStagedAdd: {
        fg: 'surface.git.add.overlay',
      },
      GitSignsStagedAddLn: {
        bg: 'surface.git.add.line',
      },
      GitSignsStagedAddNr: {
        fg: 'surface.git.add.overlay',
      },
      GitSignsStagedAddCul: {
        fg: 'surface.git.add.overlay',
      },
      GitSignsStagedChange: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsStagedChangeLn: {
        bg: 'surface.git.change.line',
      },
      GitSignsStagedChangeNr: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsStagedChangeCul: {
        fg: 'surface.git.change.overlay',
      },
      GitSignsStagedDelete: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsStagedDeleteNr: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsStagedDeleteCul: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsStagedTopdelete: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsStagedTopdeleteNr: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsStagedTopdeleteCul: {
        fg: 'surface.git.delete.overlay',
      },
      GitSignsTopdelete: {
        fg: 'git.delete',
      },
      GitSignsTopdeleteLn: {
        bg: 'surface.git.delete.line',
      },
      GitSignsTopdeleteNr: {
        fg: 'git.delete',
      },
      GitSignsTopdeleteCul: {
        fg: 'git.delete',
      },
      GitSignsUntracked: {
        fg: 'git.ignore.visible',
      },
      GitSignsUntrackedLn: {
        bg: 'surface.git.ignore.line',
      },
    },
  },
}
