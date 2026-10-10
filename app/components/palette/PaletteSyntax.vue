<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { apcaContrast, contrast, oklchToHex, resolveVariant, spec } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const resolved = computed(() => resolveVariant(variant.value))

const neutralOrder = [
  'white',
  'soft_50',
  'soft_100',
  'soft_200',
  'soft_300',
  'soft_400',
  'soft_500',
  'soft_600',
  'soft_700',
  'soft_800',
  'soft_900',
  'soft_950',
  'black',
] as const

const neutralOptions = [...neutralOrder.map(name => ({
  name,
  hex: oklchToHex(spec.palette.neutrals[name]!),
  lightness: spec.palette.neutrals[name]!.l,
})), ...Object.entries(spec.palette.paper).map(([name, color]) => ({
  name,
  hex: oklchToHex(color),
  lightness: color.l,
}))]

const inks = computed(() => families.map((family) => {
  const baseToken = `family.${family}.base`
  const levels = (['highlight', 'base', 'muted'] as const).map((tier) => {
    const token = `family.${family}.${tier}`
    const color = resolved.value.oklch[token]!
    const hex = resolved.value.tokens[token]!
    return {
      tier,
      token,
      color,
      hex,
      neutral: family === 'mono' ? neutralOptions.find(option => option.hex === hex)?.name : undefined,
      wcag: contrast(hex, resolved.value.tokens['surface.canvas']!),
      apca: apcaContrast(hex, resolved.value.tokens['surface.canvas']!),
    }
  })
  return { family, token: baseToken, hex: levels[1]!.hex, levels }
}))

function formatApca(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)} Lc`
}
</script>

<template>
  <p class="lig-syntax-lede">
    {{ t('palette.syntax.lede') }}
  </p>
  <div class="lig-inks lig-semantic-families">
    <button
      v-for="ink in inks"
      :key="ink.family"
      type="button"
      class="lig-ink"
      :class="{ 'is-copied': copied === ink.family }"
      @click="copyValue(textFor(ink.hex, format, variant, ink.token), ink.family)"
    >
      <span
        class="lig-family-colors"
      >
        <span
          v-for="level in ink.levels"
          :key="level.tier"
          class="lig-family-level"
        >
          <i :style="{ background: level.hex }" />
          <span
            class="lig-family-metrics"
            :class="{ 'is-low-contrast': level.wcag < 4.5 }"
          >
            <b>{{ level.tier }}</b>
            <span>{{ level.neutral ?? `C ${level.color.c.toFixed(3)}` }}</span>
            <span>L {{ level.color.l.toFixed(2) }}</span>
            <span>WCAG 2.2 {{ level.wcag.toFixed(2) }}:1</span>
            <span>APCA {{ formatApca(level.apca) }}</span>
          </span>
        </span>
      </span>
      <span class="lig-ink-name">{{ ink.family }}</span>
      <span class="lig-family-description">{{ t(`palette.syntax.families.${ink.family}`) }}</span>
      <span class="lig-ink-value">{{ copied === ink.family ? t('install.copied') : textFor(ink.hex, format, variant, ink.token) }}</span>
    </button>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteStage
    :variant="variant"
  />
</template>
