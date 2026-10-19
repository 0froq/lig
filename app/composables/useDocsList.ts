export interface DocsPageItem {
  title: string | null | undefined
  path: string
  to: string
}

export function useDocsList() {
  const { locale, t } = useI18n()
  const contentPath = useContentPath()

  const { data: list } = useAsyncData(
    () => `docs-list-${locale.value}`,
    async () => {
      const root = contentPath('/docs')
      const all = await queryCollection('docs').where('path', 'LIKE', `${root}%`).order('stem', 'ASC').select('path', 'title', 'description').all()
      return { all, root }
    },
  )

  function toPublic(path: string): string {
    const root = list.value?.root ?? contentPath('/docs')
    const localeRoot = root.slice(0, root.length - '/docs'.length)
    return path.startsWith(localeRoot) ? path.slice(localeRoot.length) || '/' : path
  }

  const pages = computed<DocsPageItem[]>(() => (list.value?.all ?? []).map(item => ({
    title: item.title,
    path: item.path,
    to: toPublic(item.path),
  })))

  const navGroups = computed(() => [{
    items: pages.value.map(item => ({
      label: item.to === '/docs'
        ? t('docs.overview')
        : item.title?.trim() || item.to.split('/').pop() || item.to,
      to: item.to,
    })),
  }])

  const indexDoc = computed(() => (list.value?.all ?? []).find(item => toPublic(item.path) === '/docs'))

  return { list, pages, navGroups, indexDoc, toPublic }
}
