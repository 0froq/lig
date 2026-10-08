import type { LigVariant } from '#palette/nvim-build'
import { baseSwatches, buildVariant, semanticRoles, VARIANTS } from '#palette/nvim-build'

const STORAGE_KEY = 'lig-palette-variant'

export function useLigVariant() {
  const variant = useState<LigVariant>('lig-variant', () => 'dark')

  onMounted(() => {
    try {
      const requested = new URLSearchParams(window.location.search).get('variant') as LigVariant | null
      if (requested && VARIANTS.includes(requested)) {
        variant.value = requested
        return
      }
      const stored = localStorage.getItem(STORAGE_KEY) as LigVariant | null
      if (stored && VARIANTS.includes(stored))
        variant.value = stored
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
