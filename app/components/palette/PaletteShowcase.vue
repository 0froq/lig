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

<style scoped>
.lig-hero-icon {
  flex: none;
  align-self: center;
  width: 0.65em;
  height: 0.65em;
}

.lig-hero-name {
  white-space: nowrap;
}

.lig-quiet-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
}

.lig-palette-lead {
  margin-bottom: 40px;
}

.lig-copy-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 28px;
  margin-top: 36px;
}

.lig-copy-label {
  color: var(--muted);
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lig-copy-formats {
  display: flex;
  gap: 6px 22px;
  font-family: var(--font-text);
  font-size: 15px;
  line-height: 24px;
}

.lig-copy-formats button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  cursor: pointer;
  font: inherit;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lig-copy-formats button:hover,
.lig-copy-formats button.is-active {
  color: var(--fg);
}

.lig-copy-formats button:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

/* A continuous neutral scale and an interactive map of the accent colors. */
.lig-source-palette {
  display: grid;
  gap: 36px;
  max-width: 48rem;
  margin-top: 28px;
}

.lig-palette-column {
  min-width: 0;
}

.lig-oklch-note-link {
  display: inline-block;
  margin-top: 12px;
  font: 12px/1.5 var(--font-meta);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.lig-oklch-note-link:hover {
  color: var(--accent);
}
</style>
