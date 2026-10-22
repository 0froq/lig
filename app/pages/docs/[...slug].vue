<script setup lang="ts">
const { t } = useI18n()
const link = useKitLink()

const { doc, isIndex, prev, next } = await useDocsPage()

useHead({ title: () => doc.value?.title?.trim() || t('docs.label') })
const files = useRuntimeConfig().public.publicFiles
const override = computed(() => contentOgOverride(doc.value, 'docs', files))
if (override.value === undefined) {
  defineOgImage(
    ogComponentName(doc.value),
    {
      title: () => paperFields(doc.value).title,
      description: () => paperFields(doc.value, t('palette.meta.description')).description,
      evergreen: () => paperFields(doc.value).evergreen,
      created: () => paperFields(doc.value).created,
      updated: () => paperFields(doc.value).updated,
      words: () => paperFields(doc.value).words,
      ...ogExtraProps(doc.value),
    },
    {
      alt: () => paperFields(doc.value).title,
    },
  )
}
useShareMeta({
  title: () => doc.value?.title?.trim() || t('docs.label'),
  description: () => doc.value?.description,
  image: () => (override.value === undefined ? false : override.value),
})
useSeoMeta({ robots: () => (doc.value?.title?.trim() ? undefined : 'noindex, follow') })
</script>

<template>
  <div>
    <header
      v-if="!isIndex"
      class="l-doc-head"
    >
      <p class="l-doc-kicker">
        <NuxtLink :to="link('/docs')">
          {{ t('docs.label') }}
        </NuxtLink>
      </p>
      <h1 class="l-doc-title">
        {{ doc.title }}
      </h1>
      <p
        v-if="doc.description"
        class="l-doc-lede"
      >
        {{ doc.description }}
      </p>
    </header>
    <DocBody>
      <ContentRenderer
        :value="doc"
        class="l-md"
      />
    </DocBody>
    <nav
      v-if="prev || next"
      class="l-pager"
    >
      <p class="l-label">
        <NuxtLink
          v-if="prev"
          :to="link(prev.to)"
        >
          ←
          <Fill
            :value="prev.title"
            name="doc.title"
            :size="10"
          />
        </NuxtLink>
      </p>
      <EntryLink
        v-if="next"
        :to="link(next.to)"
      >
        <template #kicker>{{ t('docs.next') }}</template>
        <Fill
          :value="next.title"
          name="doc.title"
          :size="12"
        />
      </EntryLink>
    </nav>
  </div>
</template>

<style scoped>
.l-doc-head {
  max-width: 42rem;
  padding-bottom: clamp(24px, 4vh, 40px);
}

.l-doc-kicker {
  margin: 0 0 18px;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-doc-kicker a {
  transition: color 0.3s;
}

.l-doc-kicker a:hover {
  color: var(--fg);
}

.l-doc-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(44px, 6vw, 80px) * var(--title-scale));
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

:lang(zh) .l-doc-title {
  letter-spacing: 0;
}

.l-doc-lede {
  margin: 18px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.5;
}

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
