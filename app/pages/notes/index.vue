<script setup lang="ts">
const { t, locale } = useI18n()
const copy = useCopy()
const link = useKitLink()
const contentPath = useContentPath()

const { data: notes } = await useAsyncData(
  () => `notes-${locale.value}`,
  () =>
    queryCollection('notes')
      .where('path', 'LIKE', `${contentPath('/notes')}/%`)
      .order('date', 'DESC')
      .all()
      .then(items => items.filter(item => item.title?.trim())),
)

const slug = (path: string): string => path.split('/').pop() ?? ''

useHead({ title: () => t('notes.label') })
const files = useRuntimeConfig().public.publicFiles
const override = computed(() =>
  explicitContentCover(
    {
      collection: 'notes',
      path: contentPath('/notes'),
    },
    path => hasShareFile(files, path),
  ),
)
if (!override.value) {
  defineOgImage(
    'Paper',
    {
      title: () => t('notes.label'),
      description: () =>
        t('notes.lede').trim() || t('notes.description') || t('palette.meta.description'),
      words: 0,
    },
    {
      alt: () => t('notes.label'),
    },
  )
}
useShareMeta({
  title: () => t('notes.label'),
  description: () => t('notes.lede').trim() || t('notes.description'),
  image: () => override.value ?? false,
})
</script>

<template>
  <Sheet>
    <SectionLayout>
      <template #banner>
        <PageHead
          :kicker="copy('notes.label')"
          kicker-name="notes.label"
          :title="copy('notes.title')"
          title-name="notes.title"
          :lede="copy('notes.lede')"
          lede-name="notes.lede"
          long
          variant="section"
        >
          <template #meta>
            {{ t('notes.count', { n: notes?.length ?? 0 }) }}
          </template>
        </PageHead>
      </template>
      <ul class="l-note-list">
        <li
          v-for="note in notes"
          :key="note.path"
        >
          <NuxtLink
            class="l-note-entry"
            :to="link(`/notes/${slug(note.path)}`)"
          >
            <Kicker>
              <Fill
                :value="note.date"
                name="note.date"
                :size="10"
              />
            </Kicker>
            <EntryTitle>
              <Fill
                :value="note.title"
                name="note.title"
                :size="16"
              />
            </EntryTitle>
            <Prose
              v-if="note.description?.trim()"
              as="p"
            >
              <Fill
                :value="note.description"
                name="note.description"
                :size="24"
              />
            </Prose>
            <span class="l-more"
              >{{ t('notes.read') }}
              <small>{{ t('notes.minutes', { n: readingMinutes(note.body) }) }}</small></span
            >
          </NuxtLink>
        </li>
      </ul>
    </SectionLayout>
  </Sheet>
</template>

<style scoped>
.l-note-list {
  max-width: 42rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.l-note-entry {
  display: grid;
  gap: 10px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
  transition: color 0.3s;
}

.l-note-list li:first-child .l-note-entry {
  padding-top: 0;
  border-top: 0;
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
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(32px, 3.6vw, 56px) * var(--title-scale));
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-wrap: balance;
  transition: color 0.3s;
}

:lang(zh) .l-entry-title {
  letter-spacing: 0;
}

.l-copy {
  margin: 0;
  color: var(--muted);
}

.l-more {
  font-size: 14px;
  color: var(--muted);
}

.l-note-entry:hover .l-entry-title {
  color: var(--muted);
}

.l-more {
  display: inline-flex;
  gap: 10px;
  align-items: baseline;
  margin-top: 6px;
  font-size: 14px;
}

.l-more::after {
  content: '→';
  transition: translate 0.4s var(--ease);
}

.l-more small {
  order: 2;
  font-size: 13px;
  color: var(--muted);
}
</style>
