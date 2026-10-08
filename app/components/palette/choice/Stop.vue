<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()
const labelId = useId()

const DOT = 6
const DOT_TOP = 12
const RULE_TOP = 21
const RULE = 1.5

interface Shape {
  left: number
  top: number
  width: number
  height: number
  radius: number
}

const ids = VARIANT_OPTIONS.map(option => option.id)
const words: HTMLElement[] = []
const mark = ref<HTMLElement>()
const rest = reactive({ x: 0, y: 0 })
let motion: Animation | undefined

function wordOf(id: LigVariant): HTMLElement | undefined {
  return words[ids.indexOf(id)]
}

function dot(word: HTMLElement): Shape {
  return { left: word.offsetLeft + word.offsetWidth + 3, top: word.offsetTop + DOT_TOP, width: DOT, height: DOT, radius: DOT / 2 }
}

function rule(word: HTMLElement, left = word.offsetLeft, width = word.offsetWidth): Shape {
  return { left, top: word.offsetTop + RULE_TOP, width, height: RULE, radius: RULE / 2 }
}

function current(el: HTMLElement): Shape {
  const style = getComputedStyle(el)
  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
    radius: Number.parseFloat(style.borderTopLeftRadius) || 0,
  }
}

function frame(shape: Shape, offset: number, easing: string): Keyframe {
  return {
    left: `${shape.left}px`,
    top: `${shape.top}px`,
    width: `${shape.width}px`,
    height: `${shape.height}px`,
    borderRadius: `${shape.radius}px`,
    offset,
    easing,
  }
}

function settle(): void {
  const word = wordOf(variant.value)
  if (!word)
    return
  const shape = dot(word)
  rest.x = shape.left
  rest.y = shape.top
}

function travel(from: LigVariant, to: LigVariant): void {
  const el = mark.value
  const a = wordOf(from)
  const b = wordOf(to)
  if (!el || !a || !b)
    return
  const start = motion?.playState === 'running' ? current(el) : dot(a)
  motion?.cancel()
  settle()
  if (a.offsetTop !== b.offsetTop || matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  const left = Math.min(a.offsetLeft, b.offsetLeft)
  const right = Math.max(a.offsetLeft + a.offsetWidth, b.offsetLeft + b.offsetWidth)
  motion = el.animate([
    frame(start, 0, 'cubic-bezier(0.5, 0, 0.75, 0)'),
    frame(rule(a), 0.2, 'cubic-bezier(0.45, 0, 0.55, 1)'),
    frame(rule(b, left, right - left), 0.5, 'cubic-bezier(0.16, 1, 0.3, 1)'),
    frame(rule(b), 0.78, 'cubic-bezier(0.7, 0, 0.84, 0)'),
    frame(dot(b), 1, 'linear'),
  ], { duration: 820 })
}

function choose(next: LigVariant): void {
  if (next === variant.value)
    return
  const from = variant.value
  variant.value = next
  nextTick(() => travel(from, next))
}

watch(variant, () => nextTick(settle))

function onResize(): void {
  motion?.cancel()
  settle()
}

onMounted(async () => {
  settle()
  await document.fonts?.ready
  settle()
  addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  motion?.cancel()
  removeEventListener('resize', onResize)
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
        ref="mark"
        class="lig-stop-mark"
        :style="{ left: `${rest.x}px`, top: `${rest.y}px` }"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
