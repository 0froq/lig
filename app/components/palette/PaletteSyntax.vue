<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { resolveVariant } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const resolved = computed(() => resolveVariant(variant.value))

const inks = computed(() => families.map((family) => {
  const baseToken = `family.${family}.base`
  const levels = (['highlight', 'base', 'muted'] as const).map((tier) => {
    const token = `family.${family}.${tier}`
    const hex = resolved.value.tokens[token]!
    return {
      tier,
      hex,
    }
  })
  return { family, token: baseToken, hex: levels[1]!.hex, levels }
}))
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
      :aria-label="copied === ink.family ? t('install.copied') : ink.family"
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
          <span class="lig-family-tier">{{ level.tier }}</span>
        </span>
      </span>
      <span class="lig-ink-name">{{ ink.family }}</span>
      <span class="lig-family-description">{{ t(`palette.syntax.families.${ink.family}`) }}</span>
    </button>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteStage
    :variant="variant"
  />
</template>
