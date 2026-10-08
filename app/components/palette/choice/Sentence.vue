<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { Edge } from '~/utils/lig-variant'
import { joinVariant, splitVariant } from '~/utils/lig-variant'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t, locale } = useI18n()

const axes = computed(() => splitVariant(variant.value))
const words: Record<string, HTMLElement | undefined> = {}
const width = reactive({ tone: 0, edge: 0 })

function keep(key: string) {
  return (el: unknown) => {
    words[key] = el instanceof HTMLElement ? el : undefined
  }
}

function measure(): void {
  width.tone = words[axes.value.tone]?.offsetWidth ?? 0
  width.edge = words[axes.value.edge]?.offsetWidth ?? 0
}

function flipTone(): void {
  variant.value = joinVariant(axes.value.tone === 'light' ? 'dark' : 'light', axes.value.edge)
}

function flipEdge(): void {
  const edges: Edge[] = ['crisp', 'soft', 'paper']
  variant.value = joinVariant(axes.value.tone, edges[(edges.indexOf(axes.value.edge) + 1) % edges.length]!)
}

watch([variant, locale], () => nextTick(measure))

onMounted(async () => {
  measure()
  await document.fonts?.ready
  measure()
})
</script>

<template>
  <p class="lig-sentence">
    {{ t('palette.choice.sentence.lead') }}
    <button
      type="button"
      role="switch"
      class="lig-flip"
      :style="width.tone ? { width: `${width.tone}px` } : undefined"
      :aria-checked="axes.tone === 'dark'"
      :aria-label="t('palette.choice.tone')"
      @click="flipTone"
    >
      <span
        :ref="keep('light')"
        :class="{ 'is-on': axes.tone === 'light' }"
      >{{ t('palette.choice.toneLight') }}</span>
      <span
        :ref="keep('dark')"
        :class="{ 'is-on': axes.tone === 'dark' }"
      >{{ t('palette.choice.toneDark') }}</span>
    </button>{{ t('palette.choice.sentence.join') }}<button
      type="button"
      class="lig-flip"
      :style="width.edge ? { width: `${width.edge}px` } : undefined"
      :aria-label="`${t('palette.choice.edge')}: ${axes.edge}`"
      @click="flipEdge"
    >
      <span
        :ref="keep('crisp')"
        :class="{ 'is-on': axes.edge === 'crisp' }"
      >{{ t('palette.choice.edgeCrisp') }}</span>
      <span
        :ref="keep('soft')"
        :class="{ 'is-on': axes.edge === 'soft' }"
      >{{ t('palette.choice.edgeSoft') }}</span>
      <span
        :ref="keep('paper')"
        :class="{ 'is-on': axes.edge === 'paper' }"
      >{{ t('palette.choice.edgePaper') }}</span>
    </button>{{ t('palette.choice.sentence.tail') }}<span class="lig-sentence-mark">{{ t('palette.choice.sentence.mark') }}</span>
  </p>
</template>
