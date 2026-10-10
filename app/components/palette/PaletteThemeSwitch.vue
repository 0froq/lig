<script setup lang="ts">
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const { variant } = useLigVariant()
const { t } = useI18n()
const ids = VARIANT_OPTIONS.map(option => option.id)
</script>

<template>
  <div
    class="lig-theme-switch"
    role="radiogroup"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="option in VARIANT_OPTIONS"
      :key="option.id"
      type="button"
      role="radio"
      :class="{ 'is-active': variant === option.id }"
      :aria-checked="variant === option.id"
      :tabindex="variant === option.id ? 0 : -1"
      @click="variant = option.id"
      @keydown="radioKey($event, ids, variant, next => (variant = next))"
    >
      {{ t(option.label) }}
    </button>
  </div>
</template>
