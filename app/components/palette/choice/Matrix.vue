<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { Edge, Tone } from '~/utils/lig-variant'
import { joinVariant, radioKey, splitVariant, VARIANT_OPTIONS } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()

const tones: Tone[] = ['light', 'dark']
const edges: Edge[] = ['crisp', 'soft', 'paper']
const ids = tones.flatMap(tone => edges.map(edge => joinVariant(tone, edge)))
const hover = ref<LigVariant | null>(null)

const lit = computed(() => splitVariant(hover.value ?? variant.value))

function label(id: LigVariant): string {
  return t(VARIANT_OPTIONS.find(option => option.id === id)?.label ?? '')
}
</script>

<template>
  <div class="lig-matrix">
    <div
      class="lig-matrix-grid"
      role="radiogroup"
      :aria-label="t('palette.variantLabel')"
      @mouseleave="hover = null"
    >
      <span />
      <span
        v-for="edge in edges"
        :key="edge"
        class="lig-matrix-axis"
        :class="{ 'is-lit': lit.edge === edge }"
      >{{ t(`palette.choice.edge${edge[0]!.toUpperCase()}${edge.slice(1)}`) }}</span>
      <template
        v-for="tone in tones"
        :key="tone"
      >
        <span
          class="lig-matrix-axis"
          :class="{ 'is-lit': lit.tone === tone }"
        >{{ t(tone === 'light' ? 'palette.choice.toneLight' : 'palette.choice.toneDark') }}</span>
        <button
          v-for="edge in edges"
          :key="edge"
          type="button"
          role="radio"
          class="lig-matrix-cell"
          :class="{ 'is-active': variant === joinVariant(tone, edge) }"
          :aria-checked="variant === joinVariant(tone, edge)"
          :aria-label="label(joinVariant(tone, edge))"
          :tabindex="variant === joinVariant(tone, edge) ? 0 : -1"
          @mouseenter="hover = joinVariant(tone, edge)"
          @focus="hover = joinVariant(tone, edge)"
          @blur="hover = null"
          @click="variant = joinVariant(tone, edge)"
          @keydown="radioKey($event, ids, variant, next => (variant = next))"
        >
          <span class="lig-matrix-dot" />
        </button>
      </template>
    </div>
    <p class="lig-matrix-readout">
      {{ label(hover ?? variant) }}
    </p>
  </div>
</template>
