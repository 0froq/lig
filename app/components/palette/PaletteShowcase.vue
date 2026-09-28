<script setup lang="ts">
import type { SwatchEntry } from '#palette/nvim-build'
import { accents } from '#palette/source'

const { t } = useI18n()
const { variant, swatches, semantics } = useLigVariant()
const { format, labelFor } = usePaletteClipboard()

const formats = ['hex', 'rgb', 'hsl', 'css'] as const

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
]

const neutrals = computed(() => {
  const byName = new Map(swatches.value.filter(sw => sw.role === 'neutral').map(sw => [sw.name, sw]))
  return neutralOrder.flatMap((name) => {
    const sw = byName.get(name)
    return sw ? [sw] : []
  })
})

const families = computed(() => {
  return (Object.keys(accents) as (keyof typeof accents)[]).map((name) => {
    const steps: { caption: string, swatch: SwatchEntry }[] = []
    for (const step of ['hl', 'base', 'fd'] as const) {
      const swatch = swatches.value.find(item => item.name === `${name}_${step}`)
      if (swatch)
        steps.push({ caption: step, swatch })
    }
    return { name, steps }
  })
})

const accentBases = computed(() =>
  families.value.flatMap(family => family.steps.filter(step => step.caption === 'base').map(step => step.swatch)),
)
</script>

<template>
  <section class="l-hero lig-hero">
    <h1
      class="l-word"
      :style="{ '--len': 3 }"
      aria-label="LiG"
    >
      <span data-anchor="word">LiG</span><span
        class="l-mark"
        data-anchor="mark"
      >.</span>
    </h1>
    <div
      class="l-hero-foot"
      data-anchor="rule"
    >
      <p
        class="l-tagline"
        data-anchor="tagline"
        lang="en"
      >
        {{ t('palette.hero.tagline') }}
      </p>
      <p class="l-lede">
        {{ t('palette.hero.lede') }}
      </p>
      <PaletteVariantTabs v-model:variant="variant" />
      <div
        class="lig-accent-bar"
        aria-hidden="true"
      >
        <span
          v-for="sw in accentBases"
          :key="sw.name"
          :style="{ background: sw.hex }"
        />
      </div>
    </div>
  </section>

  <section
    id="swatches"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.swatches') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.swatchesTitle') }}
      </h2>
      <div
        class="lig-copy-bar"
        role="group"
        :aria-label="t('palette.copyAs')"
      >
        <span>{{ t('palette.copyAs') }}</span>
        <button
          v-for="item in formats"
          :key="item"
          type="button"
          :class="{ 'is-active': format === item }"
          @click="format = item"
        >
          {{ labelFor(item) }}
        </button>
      </div>

      <p class="lig-group">
        {{ t('palette.groups.neutrals') }}
      </p>
      <div class="lig-ramp">
        <PaletteSwatch
          v-for="sw in neutrals"
          :key="sw.name"
          :name="sw.name"
          :hex="sw.hex"
          :variant="variant"
        />
      </div>

      <p class="lig-group">
        {{ t('palette.groups.accents') }}
      </p>
      <div
        v-for="family in families"
        :key="family.name"
        class="lig-family"
      >
        <h3>{{ family.name }}</h3>
        <div class="lig-triad">
          <PaletteSwatch
            v-for="step in family.steps"
            :key="step.swatch.name"
            :name="step.swatch.name"
            :hex="step.swatch.hex"
            :caption="step.caption"
            :variant="variant"
          />
        </div>
      </div>
    </div>
  </section>

  <section
    id="semantic"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.semantic') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.semanticTitle') }}
      </h2>
      <PaletteSemanticTable
        :variant="variant"
        :rows="semantics"
      />
    </div>
  </section>

  <section
    id="previews"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.previews') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.previewsTitle') }}
      </h2>
      <PalettePreviews :variant="variant" />
    </div>
  </section>

  <section
    id="downloads"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.downloads') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.downloadsTitle') }}
      </h2>
      <PaletteDownloads />
    </div>
  </section>
</template>
