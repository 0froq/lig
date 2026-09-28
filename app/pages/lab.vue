<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const { t } = useI18n()

useHead({ title: () => t('palette.choice.lab.title') })

const cases = ['stop', 'sentence', 'wildmenu', 'circle', 'matrix'] as const
const picks = reactive<Record<typeof cases[number], LigVariant>>({
  stop: 'dark',
  sentence: 'dark',
  wildmenu: 'dark',
  circle: 'dark',
  matrix: 'dark',
})
</script>

<template>
  <Sheet :line="true">
    <PageHead
      :kicker="t('palette.choice.lab.kicker')"
      :title="t('palette.choice.lab.title')"
      :lede="t('palette.choice.lab.lede')"
      compact
    />
    <section
      v-for="(id, index) in cases"
      :id="id"
      :key="id"
      class="l-section lig-section-quiet"
    >
      <p
        class="l-label"
        data-anchor="label"
      >
        0{{ index + 1 }}
      </p>
      <div class="l-body">
        <h2 class="lig-quiet-title">
          {{ t(`palette.choice.lab.${id}.name`) }}
        </h2>
        <p class="lig-aside">
          {{ t(`palette.choice.lab.${id}.note`) }}
        </p>
        <PaletteChoiceStop
          v-if="id === 'stop'"
          v-model:variant="picks.stop"
        />
        <PaletteChoiceSentence
          v-else-if="id === 'sentence'"
          v-model:variant="picks.sentence"
        />
        <PaletteChoiceCircle
          v-else-if="id === 'circle'"
          v-model:variant="picks.circle"
        />
        <PaletteChoiceMatrix
          v-else-if="id === 'matrix'"
          v-model:variant="picks.matrix"
        />
        <div
          v-else
          class="lig-lab-gap"
        />
        <PaletteStage :variant="picks[id]">
          <template
            v-if="id === 'wildmenu'"
            #foot
          >
            <PaletteChoiceWildmenu v-model:variant="picks.wildmenu" />
          </template>
        </PaletteStage>
      </div>
    </section>
  </Sheet>
</template>
