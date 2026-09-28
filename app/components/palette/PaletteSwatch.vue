<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const props = defineProps<{
  name: string
  hex: string
  variant: LigVariant
  caption?: string
}>()

const { format, copied, copyValue, textFor } = usePaletteClipboard()
const value = computed(() => textFor(props.hex, format.value, props.variant, props.name))

async function onCopy(): Promise<void> {
  await copyValue(value.value, props.name)
}
</script>

<template>
  <button
    type="button"
    class="lig-chip"
    :class="{ 'is-copied': copied === name }"
    :style="{ '--swatch': hex }"
    @click="onCopy"
  >
    <span class="lig-chip-fill" />
    <span class="lig-chip-name">{{ caption || name }}</span>
    <span class="lig-chip-value">{{ copied === name ? $t('install.copied') : value }}</span>
  </button>
</template>
