import type { Ref } from 'vue'
import type { LayerColors, PaperLayer, PenLayer } from '~/kit/types'
import { createPaper } from '~/kit/paper'
import { createPen } from '~/kit/pen'
import { settled } from '~/kit/settle'

export interface SignatureOptions {
  /** The page leaves a margin for the pen; it still needs a `[data-anchor="rule"]`. */
  line?: boolean
}

function readColors(): LayerColors {
  const html = document.documentElement
  const css = getComputedStyle(html)
  const get = (name: string): string => css.getPropertyValue(name).trim()
  return { paper: get('--bg'), ink: get('--fg'), accent: get('--accent'), dark: html.dataset.theme === 'dark' }
}

/**
 * Lays one sheet of paper under a page and, if it has a margin, draws the pen through it.
 * Layers are rebuilt per page: a new page is a new sheet.
 */
export function useSignature(root: Ref<HTMLElement | undefined>, options: SignatureOptions): void {
  const { product } = useAppConfig()
  const { theme } = useTheme()
  let paper: PaperLayer | null = null
  let pen: PenLayer | null = null
  const timers: ReturnType<typeof setTimeout>[] = []
  let alive = true

  onMounted(async () => {
    const el = root.value
    if (!el)
      return
    await Promise.all([document.fonts.ready, settled(el)])
    if (!alive)
      return
    const sig = product.signature
    const find = (anchor: string): HTMLElement | null => el.querySelector<HTMLElement>(`[data-anchor="${anchor}"]`)
    const mark = find('mark')
    const finalMark = find('final-mark')
    // A page with a line holds its last stop back for the pen; one without lets it bloom when seen
    const line = sig.line && !!options.line && !!find('rule')

    if (sig.paper) {
      const marks = sig.bloom ? [mark, line ? null : finalMark].filter((m): m is HTMLElement => !!m) : []
      paper = createPaper({
        colors: readColors(),
        marks,
        washes: sig.bloom,
        dwellAfter: sig.pointer.dwell === 'wash' ? sig.pointer.dwellAfter : 0,
        click: sig.pointer.click === 'wash',
      })
    }
    const washes = !!paper && sig.bloom
    if (washes)
      timers.push(setTimeout(() => paper?.bloom(), 250))
    if (line) {
      timers.push(setTimeout(() => {
        pen = createPen({
          root: el,
          hand: sig.hand ? find('tagline') : null,
          colors: readColors(),
          wet: (x, y) => paper?.wet(x, y) ?? 0,
          flowing: () => paper?.flowing() ?? false,
          onArrive: washes && finalMark ? () => paper?.soak(finalMark) : undefined,
        })
      }, 900))
    }
  })

  watch(theme, async () => {
    await nextTick()
    const colors = readColors()
    paper?.setColors(colors)
    pen?.setColors(colors)
  })

  onBeforeUnmount(() => {
    alive = false
    timers.forEach(clearTimeout)
    paper?.destroy()
    pen?.destroy()
  })
}
