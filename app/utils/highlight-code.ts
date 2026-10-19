import type { CodeSpan } from '@froq/ui'
import type { HighlighterCore } from 'shiki/core'
import type { LigVariant } from '../../core'
import lua from '@shikijs/langs/lua'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { documentationThemes } from '#shared/documentation-themes'

const languages = { lua }

let highlighter: HighlighterCore | undefined

function engine(): HighlighterCore {
  if (!highlighter) {
    const themes = documentationThemes()
    highlighter = createHighlighterCoreSync({
      themes: [themes.default, themes.dark, themes['light-paper'], themes['dark-paper']],
      langs: Object.values(languages),
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighter
}

/** Color source with the VS Code theme of the active LiG variant. Shiki 4.5, JavaScript regex engine. */
export function highlightSource(code: string, lang: keyof typeof languages, variant: LigVariant): CodeSpan[] {
  const { tokens } = engine().codeToTokens(code, { lang, theme: `lig-${variant}` })
  const spans: CodeSpan[] = []
  tokens.forEach((line, index) => {
    if (index)
      spans.push({ text: '\n' })
    for (const token of line) {
      if (token.content)
        spans.push({ text: token.content, color: token.color })
    }
  })
  return spans
}
