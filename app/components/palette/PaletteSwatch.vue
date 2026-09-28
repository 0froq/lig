<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { CopyFormat } from '~/composables/usePaletteClipboard'
import { formats } from '#palette/convert'

const props = defineProps<{
  name: string
  hex: string
  variant: LigVariant
}>()

const format = ref<CopyFormat>('hex')
const { copied, copyValue, labelFor, textFor } = usePaletteClipboard()
const f = computed(() => formats(props.hex))

const formatsList: CopyFormat[] = ['hex', 'rgb', 'hsl', 'css']

async function onCopy(): Promise<void> {
  const text = textFor(props.hex, format.value, props.variant, props.name)
  await copyValue(text, props.name)
}
</script>

<template>
  <button
    type="button"
    class="lig-swatch"
    :class="{ 'is-copied': copied === name }"
    :style="{ '--swatch': f.hex }"
    :title="name"
    @click="onCopy"
  >
    <span class="lig-swatch-chip" />
    <span class="lig-swatch-meta">
      <span class="lig-swatch-name">{{ name }}</span>
      <span class="lig-swatch-value">{{ f.hex }}</span>
      <span class="lig-swatch-sub">{{ f.rgb }} · {{ f.hsl }}</span>
    </span>
    <span class="lig-swatch-actions">
      <span
        v-for="item in formatsList"
        :key="item"
        class="lig-swatch-format"
        :class="{ 'is-active': format === item }"
        @click.stop="format = item"
      >{{ labelFor(item) }}</span>
    </span>
    <span
      v-if="copied === name"
      class="lig-swatch-toast"
    >{{ $t('install.copied') }}</span>
  </button>
</template>
