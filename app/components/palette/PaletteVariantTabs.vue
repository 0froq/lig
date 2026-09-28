<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const labels: Record<LigVariant, string> = {
  'light': 'palette.variants.light',
  'dark': 'palette.variants.dark',
  'light-soft': 'palette.variants.lightSoft',
  'dark-soft': 'palette.variants.darkSoft',
}
</script>

<template>
  <div
    class="lig-variant-tabs"
    role="tablist"
    :aria-label="$t('palette.variantLabel')"
  >
    <button
      v-for="(labelKey, id) in labels"
      :key="id"
      type="button"
      role="tab"
      class="lig-variant-tab"
      :aria-selected="variant === id"
      :class="{ 'is-active': variant === id }"
      @click="variant = id as LigVariant"
    >
      {{ t(labelKey) }}
    </button>
  </div>
</template>
