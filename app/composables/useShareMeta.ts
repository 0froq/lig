import type { MaybeRefOrGetter } from 'vue'
import { OG_IMAGE_URL } from '#shared/site'

type ShareType = 'website' | 'article'

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
  publishedTime?: MaybeRefOrGetter<string | undefined>
}): void {
  const { t } = useI18n()
  const { product } = useAppConfig()

  const title = computed(() => {
    const page = toValue(input?.title)?.trim()
    if (!page)
      return t('site.title')
    if (toValue(input?.bareTitle))
      return page
    const brand = product.name ? `${product.name}${product.mark}` : ''
    return brand ? `${page} — ${brand}` : page
  })
  const description = computed(() => toValue(input?.description)?.trim() || t('palette.meta.description'))

  // Page entries are scoped to their component and disposed on navigation.
  if (input) {
    useSeoMeta({
      ogType: () => toValue(input.type) ?? 'website',
      ogTitle: () => title.value,
      ogDescription: () => description.value,
      description: () => description.value,
      twitterTitle: () => title.value,
      twitterDescription: () => description.value,
      articlePublishedTime: () => toValue(input.publishedTime),
    })
    return
  }

  useSeoMeta({
    twitterCard: 'summary_large_image',
    ogType: 'website',
    ogSiteName: () => product.name,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    description: () => description.value,
    ogImage: OG_IMAGE_URL,
    ogImageAlt: () => `${product.name} — ${t('site.footer')}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: OG_IMAGE_URL,
    twitterImageAlt: () => `${product.name} — ${t('site.footer')}`,
  })
}
