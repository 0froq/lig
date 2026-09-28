<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { layoutText } from '~/kit/hand-font'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const options: { id: LigVariant, label: string, hand: string }[] = [
  { id: 'light', label: 'palette.variants.light', hand: 'light' },
  { id: 'dark', label: 'palette.variants.dark', hand: 'dark' },
  { id: 'light-soft', label: 'palette.variants.lightSoft', hand: 'light soft' },
  { id: 'dark-soft', label: 'palette.variants.darkSoft', hand: 'dark soft' },
]

const SIZE = 30

function write(text: string): { width: number, height: number, viewBox: string, paths: string[] } {
  const layout = layoutText(text, { size: SIZE })
  return {
    width: layout.width,
    height: layout.ascent + layout.descent,
    viewBox: `0 ${-layout.ascent} ${Math.max(layout.width, 1)} ${layout.ascent + layout.descent}`,
    paths: layout.strokes.map(points =>
      points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(' '),
    ),
  }
}

const written = Object.fromEntries(options.map(option => [option.id, write(option.hand)])) as Record<LigVariant, ReturnType<typeof write>>
</script>

<template>
  <div
    class="lig-choice"
    role="radiogroup"
    :aria-label="t('palette.variantLabel')"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="radio"
      class="lig-choice-item"
      :aria-checked="variant === option.id"
      :class="{ 'is-active': variant === option.id }"
      @click="variant = option.id"
    >
      <span class="lig-choice-set">{{ t(option.label) }}</span>
      <svg
        class="lig-choice-hand"
        :viewBox="written[option.id].viewBox"
        :width="written[option.id].width"
        :height="written[option.id].height"
        aria-hidden="true"
      >
        <path
          v-for="(path, index) in written[option.id].paths"
          :key="index"
          :d="path"
        />
      </svg>
    </button>
  </div>
</template>
