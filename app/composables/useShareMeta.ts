import type { MaybeRefOrGetter } from 'vue'
import { absoluteImageUrl, OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH } from '~/utils/site'

export type ShareType = 'website' | 'article'

export interface ShareMetaInput {
  title?: MaybeRefOrGetter<string | undefined | null>
  description?: MaybeRefOrGetter<string | undefined | null>
  type?: MaybeRefOrGetter<ShareType | undefined>
  /** When true, `og:title` is the page title only (no product suffix). */
  bareTitle?: MaybeRefOrGetter<boolean | undefined>
  /**
   * Share image path or https URL.
   * `false` when defineOgImage owns `og:image`.
   * Omitted routes use `/og.png`.
   */
  image?: MaybeRefOrGetter<string | false | undefined>
  publishedTime?: MaybeRefOrGetter<string | undefined>
}

function filled(value: string | undefined | null, fallback: string): string {
  const text = value?.trim()
  return text || fallback
}

/**
 * Open Graph / Twitter tags for the current route.
 * `og:url` stays on the site origin. Image URLs use the Worker origin.
 */
export function useShareMeta(input: ShareMetaInput = {}): void {
  const { t } = useI18n()
  const { product } = useAppConfig()

  const title = computed(() => {
    const page = filled(toValue(input.title), t('site.title'))
    if (toValue(input.bareTitle))
      return page
    const brand = product.name ? `${product.name}${product.mark}` : ''
    return brand && page !== t('site.title') ? `${page} — ${brand}` : page
  })
  const description = computed(() => filled(toValue(input.description), t('palette.meta.description')))
  const type = computed(() => toValue(input.type) ?? 'website')
  const skipImage = toValue(input.image) === false
  const image = computed(() => {
    const value = toValue(input.image)
    if (value === false || !value)
      return absoluteImageUrl(OG_IMAGE_PATH)
    return absoluteImageUrl(value)
  })
  const imageAlt = computed(() => `${product.name} — ${t('site.footer')}`)

  useSeoMeta({
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: () => type.value,
    ogSiteName: () => product.name,
    twitterCard: 'summary_large_image',
    articlePublishedTime: () => toValue(input.publishedTime),
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
  })

  if (!skipImage) {
    useSeoMeta({
      ogImage: () => image.value,
      ogImageType: 'image/png',
      ogImageWidth: OG_IMAGE_WIDTH,
      ogImageHeight: OG_IMAGE_HEIGHT,
      ogImageAlt: () => imageAlt.value,
      twitterImage: () => image.value,
      twitterImageAlt: () => imageAlt.value,
    })
  }
}
