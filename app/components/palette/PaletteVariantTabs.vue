<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'
import { looseEllipse } from '~/kit/pen-geometry'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const tabs: { id: LigVariant, label: string }[] = [
  { id: 'light', label: 'palette.variants.light' },
  { id: 'dark', label: 'palette.variants.dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft' },
]

const ring = looseEllipse(50, 32, 47, 27)
  .map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0].toFixed(2)} ${point[1].toFixed(2)}`)
  .join(' ')

function face(id: LigVariant): Record<string, string> {
  const built = buildVariant(id) as Record<string, unknown>
  const pick = (key: string): string => typeof built[key] === 'string' ? built[key] : '#000'
  return {
    '--slip-bg': pick('bg'),
    '--slip-fg': pick('fg'),
    '--slip-muted': pick('fg_muted'),
    '--slip-fn': pick('func'),
    '--slip-str': pick('string'),
    '--slip-num': pick('number'),
  }
}
</script>

<template>
  <div
    class="lig-slips"
    role="tablist"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="lig-slip"
      :aria-selected="variant === tab.id"
      :class="{ 'is-active': variant === tab.id }"
      :style="face(tab.id)"
      @click="variant = tab.id"
    >
      <span class="lig-slip-page">
        <svg
          class="lig-slip-ring"
          viewBox="-6 -8 112 80"
          aria-hidden="true"
        >
          <path :d="ring" />
        </svg>
        <span class="lig-slip-code"><span class="fn">loadTheme</span>
          <span class="muted">(</span><span class="str">"lig"</span><span class="muted">, </span><span class="num">6</span><span class="muted">)</span></span>
      </span>
      <span class="lig-slip-name">{{ t(tab.label) }}</span>
    </button>
  </div>
</template>
