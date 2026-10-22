<script setup lang="ts">
import type { PageSection } from '~/composables/usePageSections'

defineProps<{ sections: PageSection[]; current: string }>()
const { t } = useI18n()
</script>

<template>
  <nav
    class="l-sections"
    :aria-label="t('nav.sections')"
  >
    <a
      v-for="section in sections"
      :key="section.id"
      :href="`#${section.id}`"
      :aria-current="section.id === current ? 'true' : undefined"
      >{{ section.label }}</a
    >
  </nav>
</template>

<style scoped>
.l-sections {
  display: flex;
  gap: 20px;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-sections a {
  transition: color 0.3s;
}

/* Preserve the shared selector group here and in SiteHeader without a global rule. */
.l-sections a[aria-current='true'],
.l-nav a:hover,
.l-sections a:hover {
  color: var(--fg);
}
</style>
