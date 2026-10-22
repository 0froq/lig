<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()
const link = useKitLink()
const contentPath = useContentPath()
const slug = computed(() => String(route.params.slug))

const { data } = await useAsyncData(
  () => `note-${locale.value}-${slug.value}`,
  async () => {
    const [note, all] = await Promise.all([
      queryCollection('notes')
        .path(contentPath(`/notes/${slug.value}`))
        .first(),
      queryCollection('notes')
        .where('path', 'LIKE', `${contentPath('/notes')}/%`)
        .order('date', 'DESC')
        .select('path', 'title')
        .all(),
    ])
    const published = all.filter(item => item.title?.trim())
    const index = published.findIndex(item => item.path === note?.path)
    const next =
      index >= 0 && published.length > 1 ? published[(index + 1) % published.length] : undefined
    return { note, next }
  },
)
const note = computed(() => data.value?.note)
if (!note.value?.title?.trim())
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const next = computed(() => data.value?.next)
const toNote = (path: string): string => link(`/notes/${path.split('/').pop()}`)

useHead({ title: () => note.value?.title })
const files = useRuntimeConfig().public.publicFiles
const override = computed(() => contentOgOverride(note.value, 'notes', files))
if (override.value === undefined) {
  defineOgImage(
    ogComponentName(note.value),
    {
      title: () => paperFields(note.value).title,
      description: () => paperFields(note.value, t('palette.meta.description')).description,
      evergreen: () => paperFields(note.value).evergreen,
      created: () => paperFields(note.value).created,
      updated: () => paperFields(note.value).updated,
      words: () => paperFields(note.value).words,
      ...ogExtraProps(note.value),
    },
    {
      alt: () => paperFields(note.value).title,
    },
  )
}
useShareMeta({
  title: () => note.value?.title,
  description: () => note.value?.description,
  type: 'article',
  publishedTime: () => note.value?.date,
  image: () => (override.value === undefined ? false : override.value),
})
</script>

<template>
  <Sheet v-if="note">
    <SectionLayout>
      <template #banner>
        <PageHead
          :title="note.title"
          title-name="note.title"
          long
          variant="section"
        >
          <template #kicker>
            <NuxtLink :to="link('/notes')">
              {{ t('notes.label') }}
            </NuxtLink>
          </template>
          <template #meta>
            {{ note.date }} · {{ t('notes.minutes', { n: readingMinutes(note.body) }) }}
          </template>
        </PageHead>
      </template>
      <DocBody>
        <p
          v-if="note.description?.trim()"
          class="l-excerpt"
        >
          <Fill
            :value="note.description"
            name="note.description"
            :size="24"
          />
        </p>
        <ContentRenderer
          :value="note"
          class="l-md"
        />
      </DocBody>
      <nav
        v-if="next"
        class="l-pager"
      >
        <p class="l-label">
          <NuxtLink :to="link('/notes')"> ← {{ t('notes.back') }} </NuxtLink>
        </p>
        <EntryLink :to="toNote(next.path)">
          <template #kicker>{{ t('notes.next') }}</template>
          <Fill
            :value="next.title"
            name="note.title"
            :size="12"
          />
        </EntryLink>
      </nav>
    </SectionLayout>
  </Sheet>
</template>

<style scoped>
.l-pager {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--gap);
  align-items: baseline;
  padding-top: clamp(96px, 18vh, 200px);
  padding-bottom: clamp(96px, 16vh, 180px);
}

.l-label {
  grid-column: span var(--span-margin);
  margin: 0;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-label a {
  transition: color 0.3s;
}

.l-label a:hover {
  color: var(--fg);
}

@media (max-width: 860px) {
  .l-pager {
    grid-template-columns: 1fr;
  }

  .l-label,
  .l-entry {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>
