import type { PluginIntegration } from '../../types'

// Adapted from lig.nvim; upstream provenance and complete group coverage are in coverage.json.
export const OTHER_INTEGRATIONS: Record<string, PluginIntegration> = {
  'blink': {
    plugin: 'blink.cmp',
    groups: {
      BlinkCmpMenuBorder: {
        fg: 'border.default',
      },
      BlinkCmpLabelDeprecated: {
        fg: 'text.subtle',
        strikethrough: true,
      },
      BlinkCmpKindArray: {
        link: 'LspKindArray',
      },
      BlinkCmpKindBoolean: {
        link: 'LspKindBoolean',
      },
      BlinkCmpKindClass: {
        link: 'LspKindClass',
      },
      BlinkCmpKindColor: {
        link: 'LspKindColor',
      },
      BlinkCmpKindConstant: {
        link: 'LspKindConstant',
      },
      BlinkCmpKindConstructor: {
        link: 'LspKindConstructor',
      },
      BlinkCmpKindEnum: {
        link: 'LspKindEnum',
      },
      BlinkCmpKindEnumMember: {
        link: 'LspKindEnumMember',
      },
      BlinkCmpKindEvent: {
        link: 'LspKindEvent',
      },
      BlinkCmpKindField: {
        link: 'LspKindField',
      },
      BlinkCmpKindFile: {
        link: 'LspKindFile',
      },
      BlinkCmpKindFolder: {
        link: 'LspKindFolder',
      },
      BlinkCmpKindFunction: {
        link: 'LspKindFunction',
      },
      BlinkCmpKindInterface: {
        link: 'LspKindInterface',
      },
      BlinkCmpKindKey: {
        link: 'LspKindKey',
      },
      BlinkCmpKindKeyword: {
        link: 'LspKindKeyword',
      },
      BlinkCmpKindMethod: {
        link: 'LspKindMethod',
      },
      BlinkCmpKindModule: {
        link: 'LspKindModule',
      },
      BlinkCmpKindNamespace: {
        link: 'LspKindNamespace',
      },
      BlinkCmpKindNull: {
        link: 'LspKindNull',
      },
      BlinkCmpKindNumber: {
        link: 'LspKindNumber',
      },
      BlinkCmpKindObject: {
        link: 'LspKindObject',
      },
      BlinkCmpKindOperator: {
        link: 'LspKindOperator',
      },
      BlinkCmpKindPackage: {
        link: 'LspKindPackage',
      },
      BlinkCmpKindProperty: {
        link: 'LspKindProperty',
      },
      BlinkCmpKindReference: {
        link: 'LspKindReference',
      },
      BlinkCmpKindSnippet: {
        link: 'LspKindSnippet',
      },
      BlinkCmpKindString: {
        link: 'LspKindString',
      },
      BlinkCmpKindTypeParameter: {
        link: 'LspKindTypeParameter',
      },
      BlinkCmpKindStruct: {
        link: 'LspKindStruct',
      },
      BlinkCmpKindValue: {
        link: 'LspKindValue',
      },
      BlinkCmpKindUnit: {
        link: 'LspKindUnit',
      },
      BlinkCmpKindVariable: {
        link: 'LspKindVariable',
      },
      BlinkCmpKindText: {
        link: 'LspKindText',
      },
    },
  },
  'dashboard': {
    plugin: 'dashboard-nvim',
    groups: {
      DashboardHeader: {
        fg: 'accent.primary',
      },
      DashboardFooter: {
        fg: 'accent.primary',
      },
      DashboardProjectTitle: {
        fg: 'text.strong',
      },
      DashboardProjectTitleIcon: {
        fg: 'accent.secondary',
      },
      DashboardProjectIcon: {
        fg: 'accent.secondary',
      },
      DashboardMruTitle: {
        fg: 'text.strong',
      },
      DashboardMruIcon: {
        fg: 'accent.secondary',
      },
      DashboardFiles: {
        fg: 'text.primary',
      },
      DashboardShortCutIcon: {
        fg: 'text.primary',
      },
      DashboardDesc: {
        fg: 'accent.primary',
      },
      DashboardKey: {
        fg: 'accent.secondary',
      },
      DashboardIcon: {
        fg: 'accent.primary',
      },
      DashboardShortCut: {
        fg: 'accent.primary',
      },
    },
  },
  'fzf': {
    plugin: 'fzf-lua',
    groups: {
      FzfLuaBorder: {
        fg: 'border.default',
      },
      FzfLuaBackdrop: {
        bg: 'surface.canvas',
      },
    },
  },
  'telescope': {
    plugin: 'telescope.nvim',
    groups: {
      TelescopeMatching: {
        fg: 'accent.primary',
        underline: true,
      },
      TelescopeSelection: {
        bg: 'surface.selection',
        fg: 'text.strong',
      },
      TelescopeSelectionCaret: {
        bg: 'surface.selection',
        fg: 'text.strong',
      },
      TelescopeTitle: {
        fg: 'text.strong',
      },
      TelescopeBorder: {
        fg: 'border.default',
      },
      TelescopeNormal: {
        bg: 'surface.floating',
      },
    },
  },
  'which-key': {
    plugin: 'which-key.nvim',
    groups: {
      WhichKeylconCyan: {
        fg: 'accent.cyan.base',
      },
      WhichKeylconGreen: {
        fg: 'accent.green.base',
      },
      WhichKeylconGrey: {
        fg: 'text.subtle',
      },
      WhichKeylconOrange: {
        fg: 'accent.orange.base',
      },
      WhichKeylconPurple: {
        fg: 'accent.magenta.base',
      },
      WhichKeylconRed: {
        fg: 'accent.red.base',
      },
      WhichKeylconYellow: {
        fg: 'accent.yellow.base',
      },
      WhichKeyNormal: {
        bg: 'surface.floating',
      },
      WhichKeySeparator: {
        fg: 'text.subtle',
      },
      WhichKeyTitle: {
        fg: 'text.strong',
        bg: 'surface.floating',
      },
      WhichKeyValue: {
        fg: 'text.primary',
      },
      WhichKey: {
        fg: 'text.strong',
      },
      WhichKeyBorder: {
        fg: 'border.default',
        bg: 'surface.floating',
      },
      WhichKeyDesc: {
        fg: 'text.primary',
      },
      WhichKeyGroup: {
        fg: 'text.subtle',
        italic: true,
      },
      WhichKeyIcon: {
        fg: 'accent.secondary',
      },
      WhichKeylconAzure: {
        fg: 'accent.azure.base',
      },
      WhichKeylconBlue: {
        fg: 'accent.blue.base',
      },
      WhichKeyIconCyan: {
        fg: 'accent.cyan.base',
      },
      WhichKeyIconGreen: {
        fg: 'accent.green.base',
      },
      WhichKeyIconGrey: {
        fg: 'text.subtle',
      },
      WhichKeyIconOrange: {
        fg: 'accent.orange.base',
      },
      WhichKeyIconPurple: {
        fg: 'accent.magenta.base',
      },
      WhichKeyIconRed: {
        fg: 'accent.red.base',
      },
      WhichKeyIconYellow: {
        fg: 'accent.yellow.base',
      },
      WhichKeyIconAzure: {
        fg: 'accent.azure.base',
      },
      WhichKeyIconBlue: {
        fg: 'accent.blue.base',
      },
    },
  },
}
