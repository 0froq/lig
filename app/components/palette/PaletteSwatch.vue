<script setup lang="ts">
const props = defineProps<{
  name: string
  hex: string
  caption?: string
  detail?: string
  showValue?: boolean
}>()

const { format, copied, copyValue, textFor } = usePaletteClipboard()
const value = computed(() => textFor(props.hex, format.value))

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
    :aria-label="`${name}: ${value}`"
    @click="onCopy"
  >
    <span
      class="lig-chip-fill"
      aria-hidden="true"
    />
    <span class="lig-chip-text">
      <span class="lig-chip-name">{{ caption || name }}</span>
      <span
        v-if="detail"
        class="lig-chip-detail"
      >{{ detail }}</span>
      <span
        v-if="showValue !== false || copied === name"
        class="lig-chip-value"
      >{{ copied === name ? $t('install.copied') : value }}</span>
    </span>
  </button>
</template>
