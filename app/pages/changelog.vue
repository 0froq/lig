<script setup lang="ts">
const { t, locale } = useI18n()
const copy = useCopy()
const contentPath = useContentPath()

const { data: releases } = await useAsyncData(
  () => `changelog-${locale.value}`,
  () => queryCollection('changelog').where('path', 'LIKE', `${contentPath('/changelog')}/%`).order('date', 'DESC').all(),
)

useHead({ title: () => t('changelog.label') })
const files = useRuntimeConfig().public.publicFiles
const override = computed(() => explicitContentCover({
  collection: 'changelog',
  path: contentPath('/changelog'),
}, path => hasShareFile(files, path)))
if (!override.value) {
  defineOgImage('Paper', {
    title: () => t('changelog.label'),
    description: () => t('changelog.lede').trim() || t('changelog.description') || t('palette.meta.description'),
    words: 0,
  }, {
    alt: () => t('changelog.label'),
  })
}
useShareMeta({
  title: () => t('changelog.label'),
  description: () => t('changelog.lede').trim() || t('changelog.description'),
  image: () => override.value ?? false,
})
useSeoMeta({ robots: () => releases.value?.some(release => release.title?.trim()) ? undefined : 'noindex, follow' })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('changelog.label')"
      kicker-name="changelog.label"
      :title="copy('changelog.title')"
      title-name="changelog.title"
      :lede="copy('changelog.lede')"
      lede-name="changelog.lede"
    >
      <template #meta>
        {{ t('changelog.count', { n: releases?.length ?? 0 }) }}
      </template>
    </PageHead>
    <Block
      v-for="(release, index) in releases"
      :id="isFilled(release.version) ? release.version : undefined"
      :key="release.path"
      :label="release.version"
      label-name="changelog.version"
      entry
    >
      <p class="l-kicker">
        <Fill
          :value="release.date"
          name="changelog.date"
          :size="10"
        /><template v-if="index === 0">
          · {{ t('changelog.latest') }}
        </template>
      </p>
      <h2 class="l-entry-title">
        <Fill
          :value="release.title"
          name="changelog.title"
          :size="12"
        />
      </h2>
      <ContentRenderer
        :value="release"
        class="l-notes"
      />
    </Block>
    <Final
      :title="copy('changelog.end')"
      title-name="changelog.end"
      end
    />
  </Sheet>
</template>
