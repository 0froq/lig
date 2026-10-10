<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { resolveVariant, spec } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const link = useKitLink()
const center = 180
const radius = 120

const colors = computed(() => {
  const { tokens, oklch } = resolveVariant(props.variant)
  return Object.keys(spec.palette.accents).map((name) => {
    const token = `accent.${name}.base`
    return { name, hex: tokens[token]!, ...oklch[token]! }
  }).sort((a, b) => (a.h ?? 0) - (b.h ?? 0))
})

// Project the authored H/C coordinates; L is shown separately, not held constant.
const extent = computed(() => Math.max(0.2, ...colors.value.map(color => color.c)))
const points = computed(() => colors.value.map((color) => {
  const angle = (color.h ?? 0) * Math.PI / 180
  const r = color.c / extent.value * radius
  const dx = Math.cos(angle)
  const dy = -Math.sin(angle)
  return {
    ...color,
    x: center + dx * r,
    y: center + dy * r,
    labelX: center + dx * (r + 26),
    labelY: center + dy * (r + 26) + 4,
    anchor: Math.abs(dx) < 0.2 ? 'middle' : dx > 0 ? 'start' : 'end',
  }
}))
</script>

<template>
  <figure class="lig-oklch">
    <figcaption>
      <h3 class="lig-oklch-title">
        {{ t('palette.oklch.title') }}
      </h3>
      <p class="lig-aside">
        {{ t('palette.oklch.note') }}
      </p>
      <NuxtLink
        class="lig-oklch-note-link"
        :to="link('/notes/color-design')"
      >
        {{ t('palette.oklch.designNote') }} ↗
      </NuxtLink>
    </figcaption>
    <div class="lig-oklch-layout">
      <svg
        class="lig-oklch-plot"
        viewBox="0 0 360 360"
        role="img"
        :aria-label="t('palette.oklch.hueChroma')"
      >
        <g class="lig-oklch-grid">
          <circle
            v-for="fraction in [0.5, 1]"
            :key="fraction"
            :cx="center"
            :cy="center"
            :r="radius * fraction"
          />
          <path d="M 60 180 H 300 M 180 60 V 300" />
        </g>
        <g class="lig-oklch-ticks">
          <text
            x="180"
            y="38"
            text-anchor="middle"
          >H 90°</text>
          <text
            x="318"
            y="184"
          >0°</text>
          <text
            x="185"
            y="195"
          >C 0</text>
          <text
            x="240"
            y="195"
            text-anchor="middle"
          >{{ (extent / 2).toFixed(2) }}</text>
          <text
            x="300"
            y="195"
            text-anchor="middle"
          >{{ extent.toFixed(2) }}</text>
        </g>
        <g
          v-for="point in points"
          :key="point.name"
          class="lig-oklch-point"
        >
          <title>{{ point.name }}: L {{ point.l.toFixed(3) }}, C {{ point.c.toFixed(3) }}, H {{ point.h }}°</title>
          <circle
            :cx="point.x"
            :cy="point.y"
            r="11"
            :fill="point.hex"
          />
          <text
            :x="point.labelX"
            :y="point.labelY"
            :text-anchor="point.anchor"
          >{{ point.name }}</text>
        </g>
      </svg>
      <svg
        class="lig-oklch-plot lig-oklch-lightness"
        viewBox="0 0 320 238"
        role="img"
        :aria-label="t('palette.oklch.lightnessTitle')"
      >
        <g class="lig-oklch-grid">
          <path d="M 90 30 V 218 M 190 30 V 218 M 290 30 V 218" />
        </g>
        <g class="lig-oklch-ticks">
          <text
            x="0"
            y="16"
          >L</text>
          <text
            x="90"
            y="16"
            text-anchor="middle"
          >0</text>
          <text
            x="190"
            y="16"
            text-anchor="middle"
          >0.5</text>
          <text
            x="290"
            y="16"
            text-anchor="middle"
          >1</text>
        </g>
        <g
          v-for="(color, index) in colors"
          :key="color.name"
          class="lig-oklch-point"
        >
          <title>{{ color.name }}: L {{ color.l.toFixed(3) }}</title>
          <text
            x="0"
            :y="44 + index * 24"
          >{{ color.name }}</text>
          <line
            x1="90"
            :y1="40 + index * 24"
            :x2="90 + color.l * 200"
            :y2="40 + index * 24"
            :stroke="color.hex"
          />
          <circle
            :cx="90 + color.l * 200"
            :cy="40 + index * 24"
            r="8"
            :fill="color.hex"
          />
        </g>
      </svg>
    </div>
  </figure>
</template>
