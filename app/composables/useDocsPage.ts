export async function useDocsPage() {
  const route = useRoute()
  const { locale } = useI18n()
  const contentPath = useContentPath()
  const { pages, toPublic } = useDocsList()

  const rest = computed(() => {
    const slug = route.params.slug
    const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
    return parts.length ? `/${parts.join('/')}` : ''
  })

  const { data: page } = await useAsyncData(
    () => `docs-${locale.value}-${rest.value}`,
    () => queryCollection('docs').path(`${contentPath('/docs')}${rest.value}`).first(),
  )

  if (!page.value)
    throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

  const doc = computed(() => page.value!)

  const herePath = computed(() => toPublic(doc.value.path))
  const isIndex = computed(() => herePath.value === '/docs')
  const index = computed(() => pages.value.findIndex(item => item.to === herePath.value))
  const prev = computed(() => pages.value[index.value - 1])
  const next = computed(() => pages.value[index.value + 1])

  return { doc, isIndex, prev, next }
}
