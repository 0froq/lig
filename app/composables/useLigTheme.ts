import type { LigVariant } from '#palette/nvim-build'
import { parseVariant, splitVariant } from '~/utils/lig-variant'

const STORAGE_KEY = 'lig-palette-variant'

/** App-root owner of preference restoration and variant/global-theme synchronization. */
export function useLigTheme(): void {
  const { variant } = useLigVariant()
  const { setTheme } = useTheme()
  const route = useRoute()
  const router = useRouter()
  let initialized = false

  if (import.meta.client) {
    const scrollBehavior = router.options.scrollBehavior
    // Changing the theme query must not re-scroll an unchanged #syntax anchor.
    router.options.scrollBehavior = (to, from, savedPosition) => {
      if (to.path === from.path && to.hash === from.hash && to.query.variant !== from.query.variant)
        return savedPosition ?? false
      return scrollBehavior?.(to, from, savedPosition)
    }
    onBeforeUnmount(() => router.options.scrollBehavior = scrollBehavior)
  }

  function sync(next: LigVariant): void {
    setTheme(splitVariant(next).tone)
    document.documentElement.dataset.ligVariant = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    }
    catch { /* The selected variant works without storage. */ }
    if (route.query.variant !== next)
      void router.replace({ query: { ...route.query, variant: next }, hash: route.hash })
  }

  onMounted(() => {
    const requested = parseVariant(new URLSearchParams(window.location.search).get('variant'))
    let stored: LigVariant | null = null
    try {
      stored = parseVariant(localStorage.getItem(STORAGE_KEY))
    }
    catch { /* A valid query must still work when storage is blocked. */ }
    variant.value = requested ?? stored ?? (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    initialized = true
    sync(variant.value)
  })

  watch(variant, (next) => {
    if (initialized)
      sync(next)
  }, { flush: 'sync' })

  watch(() => route.query.variant, (value) => {
    const requested = parseVariant(typeof value === 'string' ? value : null)
    if (initialized && requested)
      variant.value = requested
  })
}
