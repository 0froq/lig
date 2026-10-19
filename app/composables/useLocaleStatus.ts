/** A locale file may set top-level `status` to `wip` while that language is unfinished. */
export function useLocaleStatus() {
  const { locale } = useI18n()
  const statusByCode: Record<string, string | undefined> = useRuntimeConfig().public.localeStatus

  function status(code: string): 'wip' | undefined {
    return statusByCode[code] === 'wip' ? 'wip' : undefined
  }

  const current = computed(() => status(locale.value))
  return { status, current }
}
