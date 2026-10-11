<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { joinVariant, radioKey, splitVariant, VARIANT_OPTIONS } from '~/utils/lig-variant'

const props = defineProps<{ toneOnly?: boolean }>()
const { variant } = useLigVariant()
const { t } = useI18n()
const options = computed(() => props.toneOnly ? VARIANT_OPTIONS.slice(0, 2) : VARIANT_OPTIONS)
const ids = computed(() => options.value.map(option => option.id))
const selected = computed(() => props.toneOnly ? splitVariant(variant.value).tone : variant.value)

function select(next: LigVariant): void {
  variant.value = props.toneOnly ? joinVariant(splitVariant(next).tone, splitVariant(variant.value).edge) : next
}
</script>

<template>
  <div
    class="lig-theme-switch"
    role="radiogroup"
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
      {{ t(option.label) }}
    </button>
  </div>
</template>
