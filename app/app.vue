<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const localeHead = useLocaleHead()
useLigTheme()

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
  return vars.flatMap(([name, value]) => value == null || value === '' ? [] : [`${name}: ${value}`]).join('; ')
}

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    style: () => skinStyle(),
  },
  style: [{ key: 'theme', innerHTML: () => themeStyle(product.theme) }],
  titleTemplate: (title) => {
    const brand = product.name ? `${product.name}${product.mark}` : ''
    if (title)
      return brand ? `${title} — ${brand}` : title
    return t('site.title') || 'paper-landing'
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
