<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { resolveVariant } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const resolved = computed(() => resolveVariant(variant.value))

const inks = computed(() => families.map((family) => {
  const levels = (['highlight', 'base', 'muted'] as const).map((tier) => {
    const token = `family.${family}.${tier}`
    const hex = resolved.value.tokens[token]!
    return {
      tier,
      hex,
      token,
    }
  })
  return { family, levels }
}))
</script>

<template>
  <p class="lig-syntax-lede">
    {{ t('palette.syntax.lede') }}
  </p>
  <div class="lig-swatch-groups lig-semantic-families">
    <section
      v-for="ink in inks"
      :key="ink.family"
      class="lig-swatch-group"
    >
      <h3 class="lig-palette-heading">
        {{ ink.family }}
      </h3>
      <PaletteSwatch
        v-for="level in ink.levels"
        :key="level.tier"
        :name="level.token"
        :hex="level.hex"
        :caption="level.tier"
        :show-value="false"
      />
      <p class="lig-family-description">
        {{ t(`palette.syntax.families.${ink.family}`) }}
      </p>
    </section>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteStage
    :variant="variant"
  />
</template>
