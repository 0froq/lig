<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { resolveVariant } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const resolved = computed(() => resolveVariant(variant.value))

const inks = computed(() =>
  families.map(family => {
    const levels = (['highlight', 'base', 'muted'] as const).map(tier => {
      const token = `family.${family}.${tier}`
      const hex = resolved.value.tokens[token]!
      return {
        tier,
        hex,
        token,
      }
    })
    return { family, levels }
  }),
)
</script>

<template>
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
  <PaletteStage :variant="variant" />
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

.lig-palette-heading {
  margin: 0 0 16px;
  color: var(--muted);
  font: 11px/1.5 var(--font-meta);
}

.lig-swatch-group {
  min-width: 0;
}

.lig-swatch-group .lig-palette-heading {
  margin-bottom: 8px;
  color: var(--fg);
}

.lig-family-description {
  margin: 12px 0 0;
  color: var(--muted);
  font: 11px/1.6 var(--font-meta);
}

@media (max-width: 900px) {
  .lig-swatch-groups:not(.lig-semantic-families) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

<style>
/* Keep the base less specific than the existing scoped .lig-semantic-families,
   including its narrow-screen override, even though migrated rules are appended. */
.lig-swatch-groups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px 24px;
  margin-top: 28px;
}
</style>
