import type { MaybeRefOrGetter } from 'vue'

/** Production origin for canonical and Open Graph URLs. Worker config has no custom domain. */
export const SITE_ORIGIN = 'https://lig.froq.me'
export const OG_IMAGE_URL = `${SITE_ORIGIN}/og.png`

type ShareType = 'website' | 'article'

interface SharePayload {
  title?: string | null
  description?: string | null
  type?: ShareType
  bareTitle?: boolean
}

/**
 * Site-wide Open Graph / Twitter card tags.
 * `app.vue` calls this with no argument to emit the tags.
 * Pages that already have a title or description pass them as overrides.
 */
export function useShareMeta(input?: {
  title?: MaybeRefOrGetter<string | undefined | null>
  description?: MaybeRefOrGetter<string | undefined | null>
  type?: MaybeRefOrGetter<ShareType>
  bareTitle?: MaybeRefOrGetter<boolean>
}): void {
  const payload = useState<SharePayload>('share-meta', () => ({}))

  if (input) {
    watchEffect(() => {
      payload.value = {
        title: toValue(input.title),
        description: toValue(input.description),
        type: toValue(input.type),
        bareTitle: toValue(input.bareTitle),
      }
    })
    return
  }

  const route = useRoute()
  const { t, locale } = useI18n()
  const { product } = useAppConfig()

  const title = computed(() => {
    const page = payload.value.title?.trim()
    if (!page)
      return t('site.title')
    if (payload.value.bareTitle)
      return page
    const brand = product.name ? `${product.name}${product.mark}` : ''
    return brand ? `${page} — ${brand}` : page
  })
  const description = computed(() => payload.value.description?.trim() || t('palette.meta.description'))

  useSeoMeta({
    twitterCard: 'summary_large_image',
    ogType: () => payload.value.type ?? 'website',
    ogSiteName: () => product.name,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    description: () => description.value,
    ogImage: OG_IMAGE_URL,
    ogImageAlt: () => `${product.name} — ${t('site.footer')}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogUrl: () => route.path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${route.path}`,
    ogLocale: () => locale.value === 'zh' ? 'zh_CN' : 'en_US',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: OG_IMAGE_URL,
    twitterImageAlt: () => `${product.name} — ${t('site.footer')}`,
  })
}
