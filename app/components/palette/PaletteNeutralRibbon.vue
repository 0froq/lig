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
const tracking = ref(false)
const nudging = ref(false)
const pointerX = ref<number | null>(null)
const nudge = ref(0)
let observer: ResizeObserver | undefined
let follow = 0
let nudgeFrame = 0

function swatchScale(index: number): number {
  const reach = 2
  const distance = Math.min(Math.abs(index - active.value), reach) / reach
  return 1 - 0.36 * distance
}

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
    x: target.left - bounds.left - outset + nudge.value,
    y: target.top - bounds.top - outset,
    width: target.width + outset * 2,
    height: target.height + outset * 2,
  }
}

function aimedNudge(): number {
  const button = ribbon.value?.children.item(active.value)
  if (!button || pointerX.value == null)
    return 0
  const target = button.getBoundingClientRect()
  if (target.width === 0)
    return 0
  const ratio = Math.min(1, Math.max(0, (pointerX.value - target.left) / target.width))
  return (ratio - 0.5) * target.width * 0.18
}

function pullNudge(): void {
  cancelAnimationFrame(nudgeFrame)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const step = () => {
    const next = aimedNudge()
    const delta = next - nudge.value
    if (reduced || Math.abs(delta) < 0.15) {
      nudge.value = next
      nudging.value = false
      updateOutline()
      return
    }
    nudging.value = true
    nudge.value += delta * 0.05
    updateOutline()
    nudgeFrame = requestAnimationFrame(step)
  }
  nudgeFrame = requestAnimationFrame(step)
}

function onPointer(event: PointerEvent, index: number): void {
  pointerX.value = event.clientX
  active.value = index
  pullNudge()
}

function onLeave(): void {
  pointerX.value = null
  pullNudge()
  followOutline()
}

function followOutline(): void {
  cancelAnimationFrame(follow)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    tracking.value = false
    updateOutline()
    return
  }
  tracking.value = true
  const started = performance.now()
  const step = (now: number) => {
    updateOutline()
    if (now - started < 300)
      follow = requestAnimationFrame(step)
    else
      tracking.value = false
  }
  follow = requestAnimationFrame(step)
}

watch(active, followOutline, { flush: 'post' })
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
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(follow)
  cancelAnimationFrame(nudgeFrame)
})
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
        @pointerleave="onLeave"
        @scroll.passive="updateOutline"
      >
        <button
          v-for="(color, index) in colors"
          :key="color.name"
          type="button"
          :style="{ background: color.hex, height: `${swatchScale(index) * 100}%` }"
          :aria-label="`${color.name}: ${textFor(color.hex, format)}`"
          @pointerenter="onPointer($event, index)"
          @pointermove="onPointer($event, index)"
          @focus="active = index"
          @click="active = index; copyValue(textFor(color.hex, format), color.name)"
        />
      </div>
      <svg
        class="lig-neutral-outline"
        :class="{ 'is-tracking': tracking, 'is-nudging': nudging }"
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
  align-items: center;
  height: clamp(80px, 10vw, 128px);
  overflow-x: auto;
}

.lig-neutral-ribbon button {
  flex: 1 0 24px;
  min-width: 0;
  padding: 0;
  border: 0;
  cursor: pointer;
  transition:
    flex-grow 260ms var(--ease),
    height 260ms var(--ease);
}

.lig-neutral-outline.is-nudging :deep(.motion-outline) {
  transition: color 260ms var(--ease);
}

.lig-neutral-outline.is-tracking :deep(.motion-outline),
.lig-neutral-outline.is-tracking :deep(.motion-outline rect) {
  transition: none;
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
  .lig-neutral-ribbon button,
  .lig-neutral-outline.is-tracking :deep(.motion-outline),
  .lig-neutral-outline.is-tracking :deep(.motion-outline rect) {
    transition: none;
  }
}
</style>
