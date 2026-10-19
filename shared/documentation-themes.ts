import { VARIANTS } from '../core/resolve'
import { VARIANT_LABELS } from '../ports/constants'
import { compileTheme } from '../ports/styles'
import { vscodeTheme } from '../ports/vscode/emit'

/** Markdown uses the exact TextMate adapter shipped to VS Code; no second palette. */
export function documentationThemes() {
  const themes = Object.fromEntries(
    VARIANTS.map(variant => {
      const native = vscodeTheme(compileTheme(variant), VARIANT_LABELS[variant])
      return [
        variant === 'light' ? 'default' : variant,
        {
          name: `lig-${variant}`,
          type: native.type,
          colors: native.colors,
          settings: native.tokenColors,
        },
      ]
    }),
  )
  return {
    'default': themes.default!,
    'dark': themes.dark!,
    'light-paper': themes['light-paper']!,
    'dark-paper': themes['dark-paper']!,
  }
}
