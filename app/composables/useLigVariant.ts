import type { LigVariant } from '#palette/nvim-build'
import { baseSwatches, buildVariant, semanticRoles, VARIANTS } from '#palette/nvim-build'

import { parseVariant } from '~/utils/lig-variant'

const STORAGE_KEY = 'lig-palette-variant'

export function useLigVariant() {
  const variant = useState<LigVariant>('lig-variant', () => 'dark')

  onMounted(() => {
    try {
      const requested = parseVariant(new URLSearchParams(window.location.search).get('variant'))
      if (requested) {
        variant.value = requested
        localStorage.setItem(STORAGE_KEY, requested)
        return
      }
      const stored = parseVariant(localStorage.getItem(STORAGE_KEY))
      if (stored) {
        variant.value = stored
        localStorage.setItem(STORAGE_KEY, stored)
      }
    }
    catch { /* ignore */ }
  })

  watch(variant, (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, v)
    }
    catch { /* ignore */ }
  })

  const colors = computed(() => buildVariant(variant.value))
  const swatches = computed(() => baseSwatches(variant.value))
  const semantics = computed(() => semanticRoles(variant.value))

  function resolved(key: string): string {
    const c = colors.value as Record<string, unknown>
    if (key.includes('.')) {
      const [group, part] = key.split('.') as [string, string]
      const obj = c[group] as Record<string, string>
      return obj?.[part] ?? ''
    }
    const val = c[key]
    return typeof val === 'string' ? val : ''
  }

  return { variant, variants: VARIANTS, colors, swatches, semantics, resolved }
}
