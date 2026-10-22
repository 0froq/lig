<script setup lang="ts">
import { UiDevtools } from '@froq/ui'
import { canonicalUrl } from '~/utils/site'

const { product } = useAppConfig()
const { t } = useI18n()
const localeHead = useLocaleHead()
useLigTheme()
const dev = import.meta.dev

function skinStyle(): string {
  const skin = product.skin
  const vars: [string, string | number | undefined][] = [
    ['--font-display', skin?.font?.display],
    ['--font-text', skin?.font?.text],
    ['--font-meta', skin?.font?.meta],
    ['--display-scale', skin?.scale?.display],
    ['--poster-scale', skin?.scale?.poster],
    ['--title-scale', skin?.scale?.title],
    ['--section-scale', skin?.scale?.section],
    ['--gap', skin?.gap],
    ['--section', skin?.section],
    ['--span-margin', skin?.margin],
    ['--span-body', skin?.body],
  ]
  return vars
    .flatMap(([name, value]) => (value == null || value === '' ? [] : [`${name}: ${value}`]))
    .join('; ')
}

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    dir: () => localeHead.value.htmlAttrs?.dir,
    style: () => skinStyle(),
  },
  style: [{ key: 'theme', innerHTML: () => themeStyle(product.theme) }],
  titleTemplate: title => {
    const brand = product.name ? `${product.name}${product.mark}` : ''
    if (title) return brand ? `${title} — ${brand}` : title
    return t('site.title') || 'paper-landing'
  },
})

// The OG layer uses the image host; localized document links use the public site.
function documentUrl(value: string): string {
  return canonicalUrl(new URL(value).pathname)
}
useHead(() => ({
  link: (localeHead.value.link ?? []).map(link => ({
    ...link,
    href: link.href ? documentUrl(link.href) : undefined,
  })),
  meta: (localeHead.value.meta ?? []).map(meta =>
    meta.property === 'og:url' && typeof meta.content === 'string'
      ? { ...meta, content: documentUrl(meta.content) }
      : meta,
  ),
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div
    v-if="dev"
    class="lig-ui ui"
  >
    <UiDevtools />
  </div>
</template>

<style>
/* Fill.ts and Stop.ts generate placeholders without scope attributes throughout
   the app, including error pages. App has no single DOM root to anchor deep. */
/* Empty copy: a block labeled with the field that still needs replacing */
.l-fill {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: max-content;
  min-width: calc(var(--fill, 8) * 0.5em);
  max-width: 100%;
  height: 1.35rem;
  padding: 0 0.45rem;
  vertical-align: middle;
  border-radius: 2px;
  background: var(--faint);
  color: var(--fg);
  font-family: var(--font-meta);
  font-size: 0.68rem;
  font-weight: 400;
  font-style: normal;
  letter-spacing: 0;
  line-height: 1;
  white-space: nowrap;
}

/* Each page is a new sheet */
/* NuxtPage applies these classes to route roots, not App's own elements.
   Keep their original specificity without requiring an App scope on route roots. */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s var(--ease);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
