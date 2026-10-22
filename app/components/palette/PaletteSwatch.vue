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
        >{{ detail }}</span
      >
      <span
        v-if="showValue !== false || copied === name"
        class="lig-chip-value"
        >{{ copied === name ? $t('install.copied') : value }}</span
      >
    </span>
  </button>
</template>

<style scoped>
/* Default list swatches retain their square and compact copy target. */
.lig-chip {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  width: 100%;
  min-width: 0;
  min-height: 52px;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid var(--line);
  color: inherit;
  background: none;
  cursor: pointer;
  font: 11px/1.5 var(--font-meta);
  text-align: left;
}

.lig-chip-fill {
  display: block;
  width: 36px;
  height: 36px;
  background: var(--swatch);
  box-shadow: inset 0 0 0 1px var(--line);
}

.lig-chip-text {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 8px;
  min-width: 0;
}

.lig-chip-name {
  overflow-wrap: anywhere;
}

.lig-chip-detail,
.lig-chip-value {
  color: var(--muted);
  overflow-wrap: anywhere;
}

.lig-chip-detail {
  margin-left: auto;
  font-size: 10px;
}

.lig-chip-value {
  flex-basis: 100%;
}

.lig-chip:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

.lig-chip:hover .lig-chip-name,
.lig-chip.is-copied .lig-chip-name {
  color: var(--accent);
}

@media (max-width: 600px) {
  .lig-chip {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px;
    font-size: 10px;
  }

  .lig-chip-fill {
    width: 28px;
    height: 28px;
  }
}
</style>
