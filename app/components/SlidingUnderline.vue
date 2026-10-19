<script setup lang="ts">
import { prefersReducedMotion } from '@froq/ui/core'

const props = defineProps<{ active: string }>()

interface Rule {
  left: number
  top: number
  width: number
}

const root = ref<HTMLElement>()
const mark = ref<HTMLElement>()
const rest = reactive({ x: 0, y: 0, w: 0 })
const placed = ref(false)
let motion: Animation | undefined
let disposed = false

function item(id: string): HTMLElement | undefined {
  return root.value?.querySelector<HTMLElement>(`[data-slide="${CSS.escape(id)}"]`) ?? undefined
}

function measure(el: HTMLElement, left = el.offsetLeft, width = el.offsetWidth): Rule {
  return { left, top: el.offsetTop + el.offsetHeight + 3, width }
}

function current(el: HTMLElement): Rule {
  const style = getComputedStyle(el)
  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: Number.parseFloat(style.width) || el.offsetWidth,
  }
}

function frame(shape: Rule, offset: number, easing: string): Keyframe {
  return {
    left: `${shape.left}px`,
    top: `${shape.top}px`,
    width: `${shape.width}px`,
    offset,
    easing,
  }
}

function settle(): void {
  const el = item(props.active)
  if (!el) {
    placed.value = false
    return
  }
  const shape = measure(el)
  rest.x = shape.left
  rest.y = shape.top
  rest.w = shape.width
  placed.value = true
}

function travel(from: string, to: string): void {
  const el = mark.value
  const a = item(from)
  const b = item(to)
  if (!el || !a || !b) {
    settle()
    return
  }
  const start = motion?.playState === 'running' ? current(el) : measure(a)
  motion?.cancel()
  settle()
  if (prefersReducedMotion()) return
  const left = Math.min(a.offsetLeft, b.offsetLeft)
  const right = Math.max(a.offsetLeft + a.offsetWidth, b.offsetLeft + b.offsetWidth)
  motion = el.animate(
    [
      frame(start, 0, 'cubic-bezier(0.5, 0, 0.75, 0)'),
      frame(measure(b, left, right - left), 0.46, 'cubic-bezier(0.16, 1, 0.3, 1)'),
      frame(measure(b), 1, 'cubic-bezier(0.7, 0, 0.84, 0)'),
    ],
    { duration: 640 },
  )
}

watch(
  () => props.active,
  (next, prev) => {
    nextTick(() => {
      if (!prev || prev === next) settle()
      else travel(prev, next)
    })
  },
)

function onResize(): void {
  motion?.cancel()
  settle()
}

onMounted(async () => {
  settle()
  addEventListener('resize', onResize)
  await document.fonts?.ready
  if (!disposed) settle()
})

onBeforeUnmount(() => {
  disposed = true
  motion?.cancel()
  removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    ref="root"
    class="lig-slide"
  >
    <slot />
    <span
      v-show="placed"
      ref="mark"
      class="lig-slide-rule"
      :style="{ left: `${rest.x}px`, top: `${rest.y}px`, width: `${rest.w}px` }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.lig-slide {
  position: relative;
}

.lig-slide-rule {
  position: absolute;
  height: 1px;
  background: var(--accent);
  pointer-events: none;
}
</style>
