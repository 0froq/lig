import type { Ref } from 'vue'
import type { Theme } from '~/types'

const KEY = 'kit-theme'

/** Theme on `html[data-theme]`; the head script picks it before paint, this keeps it in sync. */
export function useTheme(): { theme: Ref<Theme>, ready: Ref<boolean>, setTheme: (next: Theme) => void } {
  const theme = useState<Theme>('theme', () => 'light')
  const ready = useState('theme-ready', () => false)
  const initializing = useState('theme-initializing', () => false)

  if (import.meta.client && !initializing.value) {
    initializing.value = true
    onNuxtReady(() => {
      theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      ready.value = true
    })
  }

  function setTheme(next: Theme): void {
    document.documentElement.dataset.theme = next
    theme.value = next
    try {
      localStorage.setItem(KEY, next)
    }
    catch { /* Storage may be unavailable; the current theme still applies. */ }
  }

  return { theme, ready, setTheme }
}
