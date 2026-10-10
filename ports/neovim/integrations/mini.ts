import type { PluginIntegration } from '../../types'

// Adapted from lig.nvim; upstream provenance and complete group coverage are in coverage.json.
export const MINI_INTEGRATIONS: Record<string, PluginIntegration> = {
  mini_clue: {
    plugin: 'mini.clue',
    groups: {
      MiniClueBorder: {
        fg: 'border.default',
        bg: 'surface.floating',
      },
      MiniClueDescGroup: {
        fg: 'text.subtle',
        italic: true,
      },
      MiniClueDescSingle: {
        fg: 'text.primary',
      },
      MiniClueNextKey: {
        fg: 'text.strong',
      },
      MiniClueNextKeyWithPostkeys: {
        fg: 'accent.primary',
      },
      MiniClueSeparator: {
        fg: 'text.subtle',
      },
      MiniClueTitle: {
        fg: 'text.strong',
        bg: 'surface.floating',
      },
    },
  },
  mini_completion: {
    plugin: 'mini.completion',
    groups: {
      MiniCompletionInfoBorderOutdated: {
        fg: 'diagnostic.warning',
      },
      MiniCompletionActiveParameter: {
        bg: 'surface.selection',
      },
      MiniCompletionDeprecated: {
        fg: 'text.dim',
        strikethrough: true,
      },
    },
  },
  mini_cursorword: {
    plugin: 'mini.cursorword',
    groups: {
      MiniCursorword: {
        bg: 'surface.cursorword',
      },
      MiniCursorwordCurrent: {
        bg: 'surface.cursorword.current',
      },
    },
  },
  mini_diff: {
    plugin: 'mini.diff',
    groups: {
      MiniDiffSignAdd: {
        fg: 'git.add',
      },
      MiniDiffSignChange: {
        fg: 'git.change',
      },
      MiniDiffSignDelete: {
        fg: 'git.delete',
      },
      MiniDiffOverAdd: {
        bg: 'surface.git.add.overlay',
      },
      MiniDiffOverChange: {
        bg: 'surface.git.change.inline',
      },
      MiniDiffOverChangeBuf: {
        bg: 'surface.git.change.overlay',
      },
      MiniDiffOverContext: {
        bg: 'surface.diff.context',
      },
      MiniDiffOverContextBuf: {
        bg: 'surface.diff.context.buffer',
      },
      MiniDiffOverDelete: {
        bg: 'surface.git.delete.inline',
      },
    },
  },
  mini_files: {
    plugin: 'mini.files',
    groups: {
      MiniFilesDirectory: {
        fg: 'text.primary',
        bg: 'surface.canvas',
      },
      MiniFilesFile: {
        fg: 'text.subtle',
        bg: 'surface.canvas',
      },
      MiniFilesNormal: {
        bg: 'surface.canvas',
      },
      MiniFilesTitle: {
        fg: 'text.subtle',
      },
      MiniFilesTitleFocused: {
        fg: 'text.strong',
        bold: true,
      },
      MiniFilesBorder: {
        fg: 'border.default',
        bg: 'surface.canvas',
      },
      MiniFilesBorderModified: {
        fg: 'git.change',
        bg: 'surface.canvas',
      },
      MiniFilesCursorLine: {
        fg: 'text.strong',
        bg: 'surface.selection',
      },
    },
  },
  mini_indentscope: {
    plugin: 'mini.indentscope',
    groups: {
      MiniIndentscopeSymbol: {
        fg: 'border.divider',
      },
    },
  },
  mini_jump2d: {
    plugin: 'mini.jump2d',
    groups: {
      MiniJump2dSpotAhead: {
        sp: 'accent.primary',
        fg: 'text.strong',
        underline: true,
      },
      MiniJump2dSpot: {
        fg: 'text.primary',
        italic: false,
      },
      MiniJump2dSpotUnique: {
        sp: 'accent.primary',
        bold: true,
        fg: 'text.strong',
        undercurl: true,
      },
      MiniJump2dDim: {
        fg: 'text.dim',
      },
    },
  },
  mini_snippets: {
    plugin: 'mini.snippets',
    groups: {
      MiniSnippetsCurrentReplace: {
        underdouble: true,
        sp: 'accent.yellow.base',
      },
      MiniSnippetsFinal: {
        underdouble: true,
        sp: 'accent.red.base',
      },
      MiniSnippetsUnvisited: {
        underdouble: true,
        sp: 'text.primary',
      },
      MiniSnippetsVisited: {
        underdouble: true,
        sp: 'text.subtle',
      },
      MiniSnippetsCurrent: {
        underdouble: true,
        sp: 'text.strong',
      },
    },
  },
  mini_statusline: {
    plugin: 'mini.statusline',
    groups: {
      MiniStatuslineFileinfo: {
        fg: 'text.subtle',
      },
      MiniStatuslineInactive: {
        fg: 'text.dim',
      },
      MiniStatuslineModeNormal: {
        fg: 'text.inverse',
        bg: 'mode.normal',
      },
      MiniStatuslineModeInsert: {
        fg: 'text.inverse',
        bg: 'mode.insert',
      },
      MiniStatuslineModeVisual: {
        fg: 'text.inverse',
        bg: 'mode.visual',
      },
      MiniStatuslineModeReplace: {
        fg: 'text.inverse',
        bg: 'mode.replace',
      },
      MiniStatuslineModeCommand: {
        fg: 'text.inverse',
        bg: 'mode.command',
      },
      MiniStatuslineModeOther: {
        fg: 'text.inverse',
        bg: 'mode.other',
      },
      MiniStatuslineDevinfo: {
        fg: 'text.primary',
      },
      MiniStatuslineFilename: {
        fg: 'text.subtle',
      },
    },
  },
  mini_tabline: {
    plugin: 'mini.tabline',
    groups: {
      MiniTablineCurrent: {
        fg: 'text.inverse',
        bg: 'surface.inverse',
      },
      MiniTablineVisible: {
        fg: 'text.primary',
        bg: 'surface.status',
      },
      MiniTablineHidden: {
        fg: 'text.subtle',
        bg: 'surface.status',
      },
      MiniTablineModifiedCurrent: {
        fg: 'text.inverse',
        bg: 'git.change',
      },
      MiniTablineModifiedVisible: {
        bg: 'surface.status',
        fg: 'git.change',
      },
      MiniTablineModifiedHidden: {
        bg: 'surface.status',
        fg: 'git.delete',
      },
      MiniTablineFill: {
        bg: 'surface.status',
      },
      MiniTablineTabpagesection: {
        fg: 'text.strong',
        bg: 'surface.status',
      },
      MiniTablineTrunc: {
        fg: 'text.subtle',
      },
    },
  },
}
