<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { looseEllipse } from '~/kit/pen-geometry'
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const ids = VARIANT_OPTIONS.map(option => option.id)
const words: HTMLElement[] = []
const box = reactive({ x: 0, y: 0, w: 0, h: 0 })
const drawn = ref(0)

const ring = looseEllipse(50, 20, 47, 17)
  .map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0].toFixed(2)} ${point[1].toFixed(2)}`)
  .join(' ')

function place(): void {
  const word = words[ids.indexOf(variant.value)]
  if (!word)
    return
  box.x = word.offsetLeft - 14
  box.y = word.offsetTop - 9
  box.w = word.offsetWidth + 28
  box.h = word.offsetHeight + 18
}

function choose(next: LigVariant): void {
  if (next === variant.value)
    return
  variant.value = next
  drawn.value++
}

watch(variant, () => nextTick(place))

onMounted(async () => {
  place()
  await document.fonts?.ready
  place()
  addEventListener('resize', place)
})

onBeforeUnmount(() => removeEventListener('resize', place))
</script>

<template>
  <div
    class="lig-circle"
    role="radiogroup"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="(option, index) in VARIANT_OPTIONS"
      :key="option.id"
      :ref="el => { if (el) words[index] = el as HTMLElement }"
      type="button"
      role="radio"
      class="lig-circle-word"
      :class="{ 'is-active': variant === option.id }"
      :aria-checked="variant === option.id"
      :tabindex="variant === option.id ? 0 : -1"
      @click="choose(option.id)"
      @keydown="radioKey($event, ids, variant, choose)"
    >
      {{ t(option.label) }}
    </button>
    <svg
      :key="drawn"
      class="lig-circle-ring"
      :class="{ 'is-drawn': drawn > 0 }"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      :style="{ left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` }"
      aria-hidden="true"
    >
      <path
        :d="ring"
        pathLength="1"
      />
    </svg>
  </div>
</template>
