<script setup lang="ts">
import { Collapsible } from '@froq/ui'
import { radioKey } from '~/utils/lig-variant'
import { spec } from '../../../core'

const { t } = useI18n()
const link = useKitLink()
const { variant, swatches } = useLigVariant()
const { format, labelFor } = usePaletteClipboard()

const formats = ['hex', 'rgb', 'hsl'] as const

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
  const byName = new Map(
    swatches.value.filter(sw => sw.role === 'neutral').map(sw => [sw.name, sw]),
  )
  const names = variant.value.endsWith('paper')
    ? neutralOrder.map(name => name.replace('soft_', 'paper_'))
    : neutralOrder
  return names.flatMap(name => {
    const sw = byName.get(name)
    return sw
      ? [{ ...sw, lightness: (spec.palette.paper[name] ?? spec.palette.neutrals[name])!.l }]
      : []
  })
})
</script>

<template>
  <HeroFrame
    class="lig-hero"
    :length="3"
    word-class="lig-hero-title"
    word-label="LiG"
  >
    <template #word>
      <img
        class="lig-hero-icon"
        :src="`/brand/lig-${variant}.svg`"
        alt=""
        width="96"
        height="96"
      />
      <span class="lig-hero-name">
        <span data-anchor="word">LiG</span><AccentMark>.</AccentMark>
      </span>
    </template>
    <template #tagline>
      {{ t('palette.hero.tagline') }}
    </template>
  </HeroFrame>

  <Section id="syntax">
    <template #label>{{ ' Syntax ' }}</template>
    <template #title>
      {{ t('palette.sections.syntaxTitle') }}
    </template>
    <PaletteSyntax v-model:variant="variant" />
  </Section>

  <Section
    id="palette"
    class="lig-section-quiet"
  >
    <template #label>{{ ' Source ' }}</template>
    <div class="lig-palette-lead">
      <h2 class="lig-quiet-title">
        {{ t('palette.sections.swatchesTitle') }}
      </h2>
      <NuxtLink
        class="lig-oklch-note-link"
        :to="link('/notes/color-design')"
      >
        {{ t('palette.oklch.designNote') }} ↗
      </NuxtLink>
    </div>
    <div class="lig-copy-bar">
      <span class="lig-copy-label">{{ t('palette.copyAs') }}</span>
      <SlidingUnderline
        class="lig-copy-formats"
        role="radiogroup"
        :active="format"
        :aria-label="t('palette.copyAs')"
      >
        <button
          v-for="item in formats"
          :key="item"
          type="button"
          role="radio"
          :class="{ 'is-active': format === item }"
          :aria-checked="format === item"
          :tabindex="format === item ? 0 : -1"
          @click="format = item"
          @keydown="radioKey($event, formats, format, next => (format = next))"
        >
          <span :data-slide="item">{{ labelFor(item) }}</span>
        </button>
      </SlidingUnderline>
    </div>
    <div class="lig-source-palette">
      <section class="lig-palette-column">
        <PaletteNeutralRibbon :colors="neutrals" />
      </section>
      <PaletteOklch :variant="variant" />
    </div>
    <PaletteTerminalReference :variant="variant" />
    <Collapsible
      class="lig-more lig-ui ui"
      :label="t('palette.more')"
    >
      <PaletteAccentTiers :variant="variant" />
    </Collapsible>
  </Section>

  <Section
    id="downloads"
    class="lig-section-quiet"
  >
    <template #label>{{ ' Ports ' }}</template>
    <h2 class="lig-quiet-title">
      {{ t('palette.sections.downloadsTitle') }}
    </h2>
    <PaletteDownloads />
  </Section>
</template>
