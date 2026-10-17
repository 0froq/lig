import type { LayerColors, PenAnchors } from '@froq/ui/core'
import type { Ref } from 'vue'
import { usePaperSignature } from '@froq/ui/vue'
import { blend } from '../../core/color'

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

/** LiG's content and visibility adapter; drawing and lifetime belong to @froq/ui. */
export function useSignature(root: Ref<HTMLElement | undefined>, options: SignatureOptions): void {
  const { product } = useAppConfig()
  const { theme } = useTheme()
  const signature = usePaperSignature(root, {
    colors: readColors,
    mixColors: blend,
    settings: () => {
      const sig = product.signature
      return {
        paper: sig.paper,
        bloom: sig.bloom,
        line: sig.line && !!options.line,
        hand: sig.hand,
        dwellAfter: sig.pointer.dwell === 'wash' ? sig.pointer.dwellAfter : 0,
        click: sig.pointer.click === 'wash',
      }
    },
    anchors: (): PenAnchors & { mark: HTMLElement | null } => {
      const el = root.value
      const find = (anchor: string): HTMLElement | null => el?.querySelector<HTMLElement>(`[data-anchor="${anchor}"]`) ?? null
      const hand = find('tagline')
      const copy = hand?.cloneNode(true) as HTMLElement | undefined
      copy?.querySelectorAll('.l-fill').forEach(node => node.remove())
      const finalMark = find('final-mark')
      const narrow = window.innerWidth < 860
      return {
        mark: find('mark'),
        rule: find('rule'),
        ruleEnd: narrow ? hand : null,
        hand,
        handText: copy?.textContent ?? '',
        finalMark,
        finalSection: finalMark?.closest('section'),
        margin: find('label'),
        sections: Array.from(el?.querySelectorAll('.l-section') ?? []).flatMap((element) => {
          const label = element.querySelector('[data-anchor="label"]')
          return label ? [{ element, label, price: element.querySelector('[data-anchor="price"]') }] : []
        }),
      }
    },
  })

  // These classes only control LiG's original type/layout fallback.
  watch(signature.state, (state) => {
    if (!import.meta.client)
      return
    for (const [key, active] of Object.entries(state))
      document.documentElement.classList.toggle(`has-${key}`, active)
  }, { flush: 'sync' })

  watch(theme, async () => {
    await nextTick()
    signature.setColors()
  })
  onBeforeUnmount(() => {
    document.documentElement.classList.remove('has-paper', 'has-bloom', 'has-stroke', 'has-hand')
  })
}
