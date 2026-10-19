<script setup lang="ts">
const { t, locale } = useI18n()
const copy = useCopy()
const contentPath = useContentPath()

const { data: releases } = await useAsyncData(
  () => `changelog-${locale.value}`,
  () =>
    queryCollection('changelog')
      .where('path', 'LIKE', `${contentPath('/changelog')}/%`)
      .order('date', 'DESC')
      .order('version', 'DESC')
      .all(),
)

const timeline = computed(() =>
  (releases.value ?? [])
    .filter(release => isFilled(release.version))
    .map(release => ({ id: release.version, version: release.version, date: release.date })),
)

useHead({ title: () => t('changelog.label') })
const files = useRuntimeConfig().public.publicFiles
const override = computed(() =>
  explicitContentCover(
    {
      collection: 'changelog',
      path: contentPath('/changelog'),
    },
    path => hasShareFile(files, path),
  ),
)
if (!override.value) {
  defineOgImage(
    'Paper',
    {
      title: () => t('changelog.label'),
      description: () =>
        t('changelog.lede').trim() || t('changelog.description') || t('palette.meta.description'),
      words: 0,
    },
    {
      alt: () => t('changelog.label'),
    },
  )
}
useShareMeta({
  title: () => t('changelog.label'),
  description: () => t('changelog.lede').trim() || t('changelog.description'),
  image: () => override.value ?? false,
})
useSeoMeta({
  robots: () =>
    releases.value?.some(release => release.title?.trim()) ? undefined : 'noindex, follow',
})
</script>

<template>
  <Sheet>
    <SectionLayout>
      <template #nav>
        <ChangelogTimeline
          :label="t('nav.sections')"
          :items="timeline"
        />
      </template>
      <template #banner>
        <PageHead
          :kicker="copy('changelog.label')"
          kicker-name="changelog.label"
          :title="copy('changelog.title')"
          title-name="changelog.title"
          :lede="copy('changelog.lede')"
          lede-name="changelog.lede"
          long
          variant="section"
        >
          <template #meta>
            {{ t('changelog.count', { n: releases?.length ?? 0 }) }}
          </template>
        </PageHead>
      </template>
      <section
        v-for="(release, index) in releases"
        :id="isFilled(release.version) ? release.version : undefined"
        :key="release.path"
        class="l-version"
      >
        <p class="l-kicker">
          <Fill
            :value="release.date"
            name="changelog.date"
            :size="10"
          /><template v-if="index === 0"> · {{ t('changelog.latest') }} </template>
        </p>
        <h2 class="l-entry-title">
          <Fill
            :value="release.title"
            name="changelog.title"
            :size="12"
          />
        </h2>
        <DocBody notes>
          <ChangelogRelease :open="index === 0">
            <ContentRenderer :value="release" />
          </ChangelogRelease>
        </DocBody>
      </section>
    </SectionLayout>
  </Sheet>
</template>

<style scoped>
.l-version {
  padding-top: clamp(36px, 6vh, 72px);
  scroll-margin-top: 48px;
}

.l-version :deep(.l-changes ul) {
  margin-top: 0;
}

.l-kicker {
  margin: 0;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-entry-title {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(32px, 3.6vw, 56px) * var(--title-scale));
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

:lang(zh) .l-entry-title {
  letter-spacing: 0;
}
</style>
