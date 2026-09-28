import type { Ref } from 'vue'

/** The vanish: without an install page, "Install" removes the site and leaves the paper. */
export function useInstalled(): Ref<boolean> {
  return useState('installed', () => false)
}
