<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const options: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft' },
]
</script>

<template>
  <div
    class="lig-choice"
    role="radiogroup"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="radio"
      class="lig-choice-item"
      :aria-checked="variant === option.id"
      :class="{ 'is-active': variant === option.id }"
      @click="variant = option.id"
    >
      <span
        class="lig-choice-mark"
        aria-hidden="true"
      />
      <span>{{ t(option.label) }}</span>
    </button>
  </div>
</template>
