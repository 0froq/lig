<script setup lang="ts">
const props = defineProps<{
  colors: { name: string, hex: string, lightness: number }[]
}>()

const active = ref(6)
const preview = computed(() => props.colors[active.value] ?? props.colors[0])
const outlineColors = computed(() => {
  const neutrals = [...props.colors].sort((a, b) => a.lightness - b.lightness)
  const dark = neutrals[0]?.hex ?? 'var(--fg)'
  const light = neutrals.at(-1)?.hex ?? 'var(--bg)'
  // A contrasting hairline keeps the frame legible over adjacent swatches
  // and the page background, not just over the selected color.
  return (preview.value?.lightness ?? 0) >= 0.6
    ? { color: dark, contrastColor: light }
    : { color: light, contrastColor: dark }
})
const { format, copied, copyValue, textFor } = usePaletteClipboard()
const stage = useTemplateRef<HTMLElement>('stage')
const ribbon = useTemplateRef<HTMLElement>('ribbon')
const outline = shallowRef<{ x: number, y: number, width: number, height: number }>()
let observer: ResizeObserver | undefined

function updateOutline(): void {
  const buttons = ribbon.value?.children
  const button = buttons?.item(active.value) ?? buttons?.item(0)
  if (!stage.value || !button) {
    outline.value = undefined
    return
  }
  const bounds = stage.value.getBoundingClientRect()
  const target = button.getBoundingClientRect()
  const outset = 6
  outline.value = {
    x: target.left - bounds.left - outset,
    y: target.top - bounds.top - outset,
    width: target.width + outset * 2,
    height: target.height + outset * 2,
  }
}

watch(active, updateOutline, { flush: 'post' })
onMounted(() => {
  observer = new ResizeObserver(updateOutline)
  watch([stage, ribbon, () => props.colors], () => {
    observer!.disconnect()
    for (const element of [stage.value, ribbon.value, ...ribbon.value?.children ?? []]) {
      if (element)
        observer!.observe(element)
    }
    updateOutline()
  }, { immediate: true, flush: 'post' })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <figure class="lig-neutral-book">
    <div
      ref="stage"
      class="lig-neutral-stage"
    >
      <div
        ref="ribbon"
        class="lig-neutral-ribbon"
        @scroll.passive="updateOutline"
      >
        <button
          v-for="(color, index) in colors"
          :key="color.name"
          type="button"
          :style="{ background: color.hex }"
          :aria-label="`${color.name}: ${textFor(color.hex, format)}`"
          @pointerenter="active = index"
          @focus="active = index"
          @click="active = index; copyValue(textFor(color.hex, format), color.name)"
        />
      </div>
      <svg
        class="lig-neutral-outline"
        aria-hidden="true"
      >
        <MotionOutline
          v-if="outline"
          v-bind="outline"
          :color="outlineColors.color"
          :contrast-color="outlineColors.contrastColor"
          :stroke-width="2"
        />
      </svg>
    </div>
    <figcaption
      v-if="preview"
      class="lig-neutral-readout"
    >
      <span class="lig-neutral-caption">
        <span>{{ preview.name }}</span>
        <span class="lig-neutral-lightness">L {{ (preview.lightness * 100).toFixed(0) }}%</span>
      </span>
      <span>
        <span
          role="status"
        >{{ copied === preview.name ? $t('install.copied') : '' }}</span>
        <span v-if="copied !== preview.name">{{ textFor(preview.hex, format) }}</span>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.lig-neutral-book {
  margin: 0;
}

.lig-neutral-stage {
  position: relative;
}

.lig-neutral-outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.lig-neutral-ribbon {
  display: flex;
  height: clamp(80px, 10vw, 128px);
  overflow-x: auto;
  border: 1px solid var(--line);
}

.lig-neutral-ribbon button {
  flex: 1 0 24px;
  min-width: 0;
  padding: 0;
  border: 0;
  cursor: pointer;
  transition: flex-grow 200ms var(--ease);
}

.lig-neutral-ribbon button:hover,
.lig-neutral-ribbon button:focus-visible {
  flex-grow: 2;
}

.lig-neutral-ribbon button:focus-visible {
  outline: none;
}

.lig-neutral-readout,
.lig-neutral-caption {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  align-items: baseline;
}

.lig-neutral-readout {
  justify-content: space-between;
  min-height: 2.5em;
  padding-top: 12px;
  color: var(--fg);
  font: 11px/1.5 var(--font-meta);
  overflow-wrap: anywhere;
}

.lig-neutral-lightness {
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .lig-neutral-ribbon button {
    transition: none;
  }
}
</style>
