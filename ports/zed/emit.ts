import type { ThemeIR, UiBinding } from '../types'
import { requireStyle, requireToken } from '../styles'

export const ZED_SCHEMA = 'https://zed.dev/schema/themes/v0.2.0.json'

// Native Zed keys, checked against the official v0.2.0 schema. Colors stay in core.
const UI: Record<string, string> = {
  'background': 'surface.canvas',
  'surface.background': 'surface.canvas',
  'elevated_surface.background': 'surface.floating',
  'border': 'border.default',
  'border.variant': 'border.divider',
  'border.focused': 'accent.primary',
  'border.selected': 'accent.primary',
  'border.disabled': 'border.divider',
  'text': 'text.primary',
  'text.muted': 'text.subtle',
  'text.placeholder': 'text.subtle',
  'text.disabled': 'text.dim',
  'text.accent': 'accent.primary',
  'icon': 'text.primary',
  'icon.muted': 'text.subtle',
  'icon.placeholder': 'text.subtle',
  'icon.disabled': 'text.dim',
  'icon.accent': 'accent.primary',
  'element.background': 'surface.raised',
  'element.hover': 'surface.selection',
  'element.active': 'surface.selection',
  'element.selected': 'surface.selection',
  'element.disabled': 'surface.canvas',
  'ghost_element.hover': 'surface.raised',
  'ghost_element.active': 'surface.selection',
  'ghost_element.selected': 'surface.selection',
  'ghost_element.disabled': 'surface.canvas',
  'status_bar.background': 'surface.status',
  'title_bar.background': 'surface.canvas',
  'title_bar.inactive_background': 'surface.canvas',
  'toolbar.background': 'surface.canvas',
  'tab_bar.background': 'surface.canvas',
  'tab.active_background': 'surface.canvas',
  'tab.inactive_background': 'surface.raised',
  'panel.background': 'surface.floating',
  'panel.focused_border': 'accent.primary',
  'panel.indent_guide': 'border.divider',
  'panel.indent_guide_active': 'text.subtle',
  'panel.indent_guide_hover': 'text.subtle',
  'pane.focused_border': 'border.default',
  'pane_group.border': 'border.default',
  'scrollbar.thumb.background': 'border.default',
  'scrollbar.thumb.hover_background': 'text.subtle',
  'scrollbar.thumb.border': 'border.divider',
  'scrollbar.track.background': 'surface.canvas',
  'scrollbar.track.border': 'border.divider',
  'editor.foreground': 'text.primary',
  'editor.background': 'surface.canvas',
  'editor.gutter.background': 'surface.canvas',
  'editor.subheader.background': 'surface.raised',
  'editor.active_line.background': 'surface.raised',
  'editor.highlighted_line.background': 'surface.selection',
  'editor.line_number': 'text.subtle',
  'editor.active_line_number': 'text.strong',
  'editor.invisible': 'text.dim',
  'editor.wrap_guide': 'border.divider',
  'editor.active_wrap_guide': 'text.subtle',
  'editor.indent_guide': 'border.divider',
  'editor.indent_guide_active': 'text.subtle',
  'editor.document_highlight.bracket_background': 'surface.selection',
  'editor.document_highlight.read_background': 'surface.selection',
  'editor.document_highlight.write_background': 'surface.selection',
  'search.match_background': 'surface.search.match',
  'link_text.hover': 'accent.primary',
  'terminal.background': 'terminal.background',
  'terminal.ansi.background': 'terminal.background',
  'terminal.foreground': 'terminal.foreground',
  'terminal.bright_foreground': 'text.strong',
  'terminal.dim_foreground': 'text.subtle',
  'conflict': 'diagnostic.warning',
  'created': 'git.add',
  'deleted': 'git.delete',
  'modified': 'git.change',
  'renamed': 'git.add',
  'error': 'diagnostic.error',
  'warning': 'diagnostic.warning',
  'info': 'diagnostic.info',
  'hint': 'diagnostic.hint',
  'success': 'diagnostic.hint',
  'ignored': 'git.ignore',
  'hidden': 'text.subtle',
  'predictive': 'text.subtle',
  'unreachable': 'text.subtle',
}

// Zed supports dotted capture keys and falls back to their longest theme prefix.
// Bind semantic intent rather than assuming Neovim's capture vocabulary matches.
export const ZED_SYNTAX: Record<string, string> = {
  // Native HTML/Vue @attribute captures are properties, not decorators.
  'attribute': 'property',
  'attribute.builtin': 'attribute',
  'attribute.special': 'property',
  'boolean': 'constant',
  'comment': 'comment',
  'comment.doc': 'comment',
  'constant': 'constant',
  'constant.builtin': 'constant.builtin',
  'constructor': 'constructor',
  'embedded': 'text',
  'emphasis': 'markup.italic',
  'emphasis.strong': 'markup.strong',
  'enum': 'type.reference',
  'function': 'function.call',
  'function.builtin': 'function.definition',
  'function.definition': 'function.definition',
  'function.decorator': 'attribute',
  'function.kwargs': 'parameter.binding',
  'function.method': 'method.call',
  'function.method.constructor': 'constructor',
  'function.special': 'function.definition',
  'hint': 'comment.note',
  'keyword': 'keyword',
  'keyword.modifier': 'keyword.modifier',
  'keyword.operator': 'operator',
  'keyword.operator.regex': 'escape',
  'keyword.return': 'keyword.action',
  'keyword.exception': 'keyword.action',
  'keyword.coroutine': 'keyword.action',
  'label': 'constant',
  'lifetime': 'attribute',
  'link_text': 'markup.link',
  'link_uri': 'markup.link',
  'number': 'number',
  'none': 'text',
  'operator': 'operator',
  'parameter': 'parameter.binding',
  'predictive': 'comment',
  'preproc': 'keyword.directive',
  'primary': 'text',
  'property': 'property',
  'punctuation': 'punctuation',
  'punctuation.bracket': 'punctuation',
  'punctuation.delimiter': 'punctuation',
  'punctuation.list_marker': 'punctuation',
  'punctuation.special': 'punctuation',
  'string': 'string',
  'string.escape': 'escape',
  'string.regex': 'escape',
  'string.special': 'escape',
  'string.special.symbol': 'constant',
  'tag': 'tag',
  'tag.jsx': 'tag.builtin',
  'tag.doctype': 'keyword.directive',
  'text': 'text',
  'text.literal': 'markup.raw',
  'title': 'markup.heading',
  'type': 'type.reference',
  'type.builtin': 'type.reference',
  'variable': 'variable',
  'variable.special': 'variable.builtin',
  'variable.parameter': 'parameter.binding',
  'variant': 'constant',
}

const ANSI = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
const ACCENTS = ['green', 'blue', 'orange', 'red', 'yellow', 'magenta', 'cyan', 'azure']

export function zedTheme(theme: ThemeIR) {
  const bindings: Record<string, UiBinding> = Object.fromEntries(
    Object.entries(UI).map(([key, token]) => [key, { token }]),
  )
  for (const [key, token] of Object.entries(UI)) {
    if (
      [
        'conflict',
        'created',
        'deleted',
        'modified',
        'renamed',
        'error',
        'warning',
        'info',
        'hint',
        'success',
        'ignored',
        'hidden',
        'predictive',
        'unreachable',
      ].includes(key)
    ) {
      bindings[`${key}.background`] = { token, alpha: '18' }
      bindings[`${key}.border`] = { token, alpha: '60' }
    }
  }
  bindings['border.transparent'] = { token: 'border.default', alpha: '00' }
  bindings['ghost_element.background'] = { token: 'surface.canvas', alpha: '00' }
  bindings['drop_target.background'] = { token: 'accent.primary', alpha: '30' }
  ANSI.forEach((name, index) => {
    bindings[`terminal.ansi.${name}`] = { token: `terminal.ansi.${index}` }
    bindings[`terminal.ansi.bright_${name}`] = { token: `terminal.ansi.${index + 8}` }
    // No extra dim palette: use the existing normal slot when dim ANSI is requested.
    bindings[`terminal.ansi.dim_${name}`] = { token: `terminal.ansi.${index}` }
  })
  const colors = Object.fromEntries(
    Object.entries(bindings).map(([key, { token, alpha = '' }]) => [
      key,
      `${requireToken(theme, token)}${alpha}`,
    ]),
  )
  const syntax = Object.fromEntries(
    Object.entries(ZED_SYNTAX).map(([capture, role]) => {
      const style = requireStyle(role)
      return [
        capture,
        {
          color: requireToken(theme, style.foreground ?? 'text.primary'),
          font_style: style.italic ? 'italic' : 'normal',
          // Leave ordinary syntax at the user's buffer_font_weight.
          font_weight: style.bold ? 700 : null,
        },
      ]
    }),
  )
  return {
    name: `LiG ${theme.variant
      .split('-')
      .map(word => word[0]!.toUpperCase() + word.slice(1))
      .join(' ')}`,
    appearance: theme.mode,
    style: {
      ...colors,
      accents: ACCENTS.map(name => requireToken(theme, `accent.${name}.base`)),
      players: [
        {
          cursor: requireToken(theme, 'text.primary'),
          background: requireToken(theme, 'text.primary'),
          selection: requireToken(theme, 'surface.selection'),
        },
        ...ACCENTS.map(name => ({
          cursor: requireToken(theme, `accent.${name}.base`),
          background: requireToken(theme, `accent.${name}.base`),
          selection: `${requireToken(theme, `accent.${name}.base`)}30`,
        })),
      ],
      syntax,
    },
  }
}

export function zedFamily(themes: ThemeIR[]) {
  return { $schema: ZED_SCHEMA, name: 'LiG', author: '0froq', themes: themes.map(zedTheme) }
}
