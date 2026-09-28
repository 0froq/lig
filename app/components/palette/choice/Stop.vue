<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()
const labelId = useId()

const ids = VARIANT_OPTIONS.map(option => option.id)
const words: HTMLElement[] = []
const mark = reactive({ x: 0, y: 0, ready: false, moving: false })
let settle: ReturnType<typeof setTimeout> | undefined

function place(): void {
  const word = words[ids.indexOf(variant.value)]
  if (!word)
    return
  mark.x = word.offsetLeft + word.offsetWidth
  mark.y = word.offsetTop
}

function choose(next: LigVariant): void {
  if (next === variant.value)
    return
  variant.value = next
  mark.moving = true
  clearTimeout(settle)
  settle = setTimeout(() => (mark.moving = false), 700)
}

watch(variant, () => nextTick(place))

onMounted(async () => {
  place()
  await document.fonts?.ready
  place()
  requestAnimationFrame(() => (mark.ready = true))
  addEventListener('resize', place)
})

onBeforeUnmount(() => {
  clearTimeout(settle)
  removeEventListener('resize', place)
})
</script>

<template>
  <div class="lig-stop">
    <span
      :id="labelId"
      class="lig-stop-label"
    >{{ t('palette.choice.label') }}</span>
    <div
      class="lig-stop-options"
      role="radiogroup"
      :aria-labelledby="labelId"
    >
      <button
        v-for="(option, index) in VARIANT_OPTIONS"
        :key="option.id"
        :ref="el => { if (el) words[index] = el as HTMLElement }"
        type="button"
        role="radio"
        class="lig-stop-word"
        :class="{ 'is-active': variant === option.id }"
        :aria-checked="variant === option.id"
        :tabindex="variant === option.id ? 0 : -1"
        @click="choose(option.id)"
        @keydown="radioKey($event, ids, variant, choose)"
      >
        {{ t(option.label) }}
      </button>
      <span
        class="lig-stop-mark"
        :class="{ 'is-ready': mark.ready, 'is-moving': mark.moving }"
        :style="{ translate: `${mark.x}px ${mark.y}px` }"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
