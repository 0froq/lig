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
      <PaletteTierRamp
        :family="ink.family"
        :levels="ink.levels"
      />
      <p class="lig-family-description">
        {{ t(`palette.syntax.families.${ink.family}`) }}
      </p>
    </section>
  </div>
  <PaletteStage
    :variant="variant"
  />
</template>

<style scoped>
.lig-semantic-families {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 16px;
  max-width: 704px;
}

@media (max-width: 540px) {
  .lig-semantic-families {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
