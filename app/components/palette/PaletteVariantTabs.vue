<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const tabs: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft' },
]
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
      {{ t(tab.label) }}
    </button>
  </div>
</template>
