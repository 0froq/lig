<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const tabs: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft' },
]

const faces = computed(() => {
  const next = {} as Record<LigVariant, { bg: string, fg: string }>
  for (const tab of tabs) {
    const built = buildVariant(tab.id) as Record<string, unknown>
    next[tab.id] = {
      bg: typeof built.bg === 'string' ? built.bg : '#000',
      fg: typeof built.fg === 'string' ? built.fg : '#fff',
    }
  }
  return next
})
</script>

<template>
  <div
    class="lig-variant-tabs"
    role="tablist"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="lig-variant-tab"
      :aria-selected="variant === tab.id"
      :class="{ 'is-active': variant === tab.id }"
      @click="variant = tab.id"
    >
      <span
        class="lig-variant-face"
        :style="{ background: faces[tab.id].bg, color: faces[tab.id].fg }"
        aria-hidden="true"
      >a</span>
      <span>{{ t(tab.label) }}</span>
    </button>
  </div>
</template>
