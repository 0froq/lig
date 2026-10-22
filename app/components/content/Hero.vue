<script setup lang="ts">
import InstallLink from '../InstallLink.vue'

// The wordmark, the handwritten line and the first call to action. The pen starts on its rule.
const props = withDefaults(
  defineProps<{
    tagline?: string | null
    lede?: string | null
    /** Link the latest changelog entry. */
    release?: boolean
    cta?: boolean
  }>(),
  { tagline: null, lede: null, release: true, cta: true },
)

const { product } = useAppConfig()
const { locale } = useI18n()
const contentPath = useContentPath()
const link = useKitLink()

const { data: latest } = await useAsyncData(
  () => `latest-release-${locale.value}`,
  () =>
    props.release
      ? queryCollection('changelog')
          .where('path', 'LIKE', `${contentPath('/changelog')}/%`)
          .order('date', 'DESC')
          .first()
      : Promise.resolve(null),
)

// Long names shrink so the word always fits the width
const length = computed(() => Math.max(3, [...(product.name || 'name')].length))
</script>

<template>
  <HeroFrame
    :length="length"
    :word-label="product.name ? `${product.name}${product.mark}` : undefined"
  >
    <template #word>
      <span data-anchor="word"
        ><Fill
          :value="product.name"
          name="product.name"
          :size="4" /></span
      ><AccentMark>{{ product.mark }}</AccentMark>
    </template>
    <template #tagline>
      <Fill
        :value="tagline"
        name="hero.tagline"
        :size="10"
      />
    </template>
    <NuxtLink
      v-if="latest"
      class="l-release"
      :to="link('/changelog')"
    >
      <span
        ><Fill
          :value="latest.version"
          name="changelog.version"
          :size="6"
      /></span>
      <Fill
        :value="latest.title"
        name="changelog.title"
        :size="12"
      />
    </NuxtLink>
    <p class="l-lede">
      <Fill
        :value="lede"
        name="hero.lede"
        :size="40"
      />
    </p>
    <CtaLink
      v-if="cta"
      :as="InstallLink"
    />
  </HeroFrame>
</template>
