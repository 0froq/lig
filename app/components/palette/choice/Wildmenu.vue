<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { radioKey, VARIANT_OPTIONS } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const ids = VARIANT_OPTIONS.map(option => option.id)
const PREFIX = ':colorscheme lig-'

const target = ref<LigVariant>(variant.value)
const typed = ref<string>(variant.value)
let timer: ReturnType<typeof setTimeout> | undefined

function run(): void {
  const goal = target.value
  const current = typed.value
  if (current === goal) {
    variant.value = goal
    return
  }
  typed.value = goal.startsWith(current) ? goal.slice(0, current.length + 1) : current.slice(0, -1)
  timer = setTimeout(run, goal.startsWith(typed.value) ? 34 : 18)
}

function choose(next: LigVariant): void {
  target.value = next
  clearTimeout(timer)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = next
    variant.value = next
    return
  }
  run()
}

watch(variant, (next) => {
  if (next === target.value)
    return
  clearTimeout(timer)
  target.value = next
  typed.value = next
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="lig-wild">
    <div
      class="lig-wild-menu"
      role="radiogroup"
      :aria-label="t('palette.variantLabel')"
    >
      <button
        v-for="option in VARIANT_OPTIONS"
        :key="option.id"
        type="button"
        role="radio"
        class="lig-wild-item"
        :class="{ 'is-active': target === option.id }"
        :aria-checked="target === option.id"
        :tabindex="target === option.id ? 0 : -1"
        @click="choose(option.id)"
        @keydown="radioKey($event, ids, target, choose)"
      >
        lig-{{ option.id }}
      </button>
    </div>
    <p
      class="lig-wild-cmd"
      aria-hidden="true"
    >
      {{ PREFIX }}{{ typed }}<span class="lig-wild-cursor" />
    </p>
  </div>
</template>
