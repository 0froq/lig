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
  <section class="l-hero lig-hero">
    <h1
      class="l-word lig-hero-title"
      :style="{ '--len': 3 }"
      aria-label="LiG"
    >
      <img
        class="lig-hero-icon"
        :src="`/brand/lig-${variant}.svg`"
        alt=""
        width="96"
        height="96"
      />
      <span class="lig-hero-name">
        <span data-anchor="word">LiG</span
        ><span
          class="l-mark"
          data-anchor="mark"
          >.</span
        >
      </span>
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
    </div>
  </section>

  <section
    id="syntax"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      Syntax
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.syntaxTitle') }}
      </h2>
      <PaletteSyntax v-model:variant="variant" />
    </div>
  </section>

  <section
    id="palette"
    class="l-section lig-section-quiet"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      Source
    </p>
    <div class="l-body">
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
    </div>
  </section>

  <section
    id="downloads"
    class="l-section lig-section-quiet"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      Ports
    </p>
    <div class="l-body">
      <h2 class="lig-quiet-title">
        {{ t('palette.sections.downloadsTitle') }}
      </h2>
      <PaletteDownloads />
    </div>
  </section>
</template>
