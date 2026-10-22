<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const copy = useCopy()
const link = useKitLink()
const { product } = useAppConfig()
const { t, localeProperties } = useI18n()

useHead({
  style: [{ key: 'theme', innerHTML: () => themeStyle(product.theme) }],
  title: () => copy('notFound.title') || `${props.error.statusCode ?? 404} — ${t('site.title')}`,
  titleTemplate: '%s',
  htmlAttrs: {
    lang: () => localeProperties.value.language,
    dir: () => localeProperties.value.dir ?? 'ltr',
  },
})
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <NuxtLayout>
    <Sheet>
      <PageHead
        :kicker="String(props.error.statusCode ?? 404)"
        :title="copy('notFound.title')"
        title-name="notFound.title"
        :lede="copy('notFound.lede')"
        lede-name="notFound.lede"
        long
      >
        <template #meta>
          <CtaLink
            :to="link('/')"
            @click.prevent="clearError({ redirect: link('/') })"
          >
            {{ copy('notFound.back') }}
          </CtaLink>
        </template>
      </PageHead>
    </Sheet>
  </NuxtLayout>
</template>
