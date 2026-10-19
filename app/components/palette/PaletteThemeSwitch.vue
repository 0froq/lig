<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const { variant } = useLigVariant()
const { t } = useI18n()
const options = VARIANT_OPTIONS
const ids = options.map(option => option.id)
const selected = computed(() => variant.value)

function select(next: LigVariant): void {
  variant.value = next
}
</script>

<template>
  <SlidingUnderline
    class="lig-theme-switch"
    role="radiogroup"
    :active="selected"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="radio"
      :class="{ 'is-active': selected === option.id }"
      :aria-checked="selected === option.id"
      :tabindex="selected === option.id ? 0 : -1"
      @click="select(option.id)"
      @keydown="radioKey($event, ids, selected, select)"
    >
      <span :data-slide="option.id">{{ t(option.label) }}</span>
    </button>
  </SlidingUnderline>
</template>
