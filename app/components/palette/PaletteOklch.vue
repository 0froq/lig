<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { oklchToHex, resolveVariant, spec } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()

// Read the maintained palette, including the additional orange, without duplicating it.
const families = Object.keys(spec.palette.accents)

const selected = ref<string>('green')
const center = 240
const radius = 170
const step = 0.05
const lightnessTop = 24
const lightnessHeight = 144
const lightnessTicks = [0, 0.25, 0.5, 0.75, 1]

function lightnessY(l: number): number {
  return lightnessTop + (1 - l) * lightnessHeight
}

// Equal distances represent equal OKLCH L steps, including the neutral reference strip.
const lightnessStrip = Array.from({ length: 64 }, (_, i) => ({
  y: lightnessTop + i / 64 * lightnessHeight,
  fill: oklchToHex({ l: 1 - (i + 0.5) / 64, c: 0, h: null }),
}))

const colors = computed(() => {
  const { tokens, oklch } = resolveVariant(props.variant)
  return families.map((name) => {
    const token = `accent.${name}.base`
    const color = oklch[token]!
    return { name, token, hex: tokens[token]!, ...color }
  }).sort((a, b) => (a.h ?? 0) - (b.h ?? 0))
})

const extent = computed(() => Math.max(0.2, Math.ceil(Math.max(...colors.value.map(color => color.c)) / step) * step))
const rings = computed(() => Array.from({ length: Math.round(extent.value / step) }, (_, i) => (i + 1) * step))

function position(hue: number, r: number) {
  const angle = hue * Math.PI / 180
  return { x: center + Math.cos(angle) * r, y: center - Math.sin(angle) * r }
}

const points = computed(() => colors.value.map((color, index) => {
  const r = color.c / extent.value * radius
  const { x, y } = position(color.h ?? 0, r)
  const label = position(color.h ?? 0, r + 20)
  const dx = label.x - center
  return {
    ...color,
    x,
    y,
    labelX: label.x,
    labelY: label.y,
    anchor: Math.abs(dx) < 24 ? 'middle' : dx > 0 ? 'start' : 'end',
    lx: 84 + index / Math.max(1, colors.value.length - 1) * 358,
    ly: lightnessY(color.l),
  }
}))

// A fixed-L/C hue reference, not a gamut boundary or a lightness slice of the points.
const hueRing = Array.from({ length: 120 }, (_, i) => {
  const start = i * 3
  const end = start + 3.05
  const a = position(start, 188)
  const b = position(end, 188)
  const c = position(end, 182)
  const d = position(start, 182)
  return {
    hue: start,
    fill: oklchToHex({ l: 0.75, c: 0.1, h: start + 1.5 }),
    path: `M ${a.x} ${a.y} A 188 188 0 0 0 ${b.x} ${b.y} L ${c.x} ${c.y} A 182 182 0 0 1 ${d.x} ${d.y} Z`,
  }
})

const active = computed(() => colors.value.find(color => color.name === selected.value) ?? colors.value[0]!)
const activeCss = computed(() => `oklch(${(active.value.l * 100).toFixed(2)}% ${active.value.c.toFixed(4)} ${(active.value.h ?? 0).toFixed(2)})`)
</script>

<template>
  <figure class="lig-oklch">
    <figcaption>
      <p class="lig-oklch-kicker">
        OKLCH · {{ t('palette.oklch.count', { n: colors.length }) }}
      </p>
      <h3 class="lig-oklch-title">
        {{ t('palette.oklch.title') }}
      </h3>
      <p class="lig-aside">
        {{ t('palette.oklch.note') }}
      </p>
    </figcaption>
    <div class="lig-oklch-layout">
      <div class="lig-oklch-charts">
        <svg
          class="lig-oklch-plot"
          viewBox="0 0 480 480"
          aria-hidden="true"
        >
          <g class="lig-oklch-hues">
            <path
              v-for="segment in hueRing"
              :key="segment.hue"
              :d="segment.path"
              :fill="segment.fill"
            />
          </g>
          <g class="lig-oklch-grid">
            <circle
              v-for="chroma in rings"
              :key="chroma"
              :cx="center"
              :cy="center"
              :r="chroma / extent * radius"
            />
            <path d="M 70 240 H 410 M 240 70 V 410" />
          </g>
          <g class="lig-oklch-ticks">
            <text
              x="446"
              y="244"
              text-anchor="middle"
            >0°</text>
            <text
              x="240"
              y="32"
              text-anchor="middle"
            >90°</text>
            <text
              x="30"
              y="244"
              text-anchor="middle"
            >180°</text>
            <text
              x="240"
              y="458"
              text-anchor="middle"
            >270°</text>
            <text
              v-for="chroma in rings"
              :key="chroma"
              :x="center + chroma / extent * radius - 2"
              :y="center - 8"
              text-anchor="end"
            >{{ chroma.toFixed(2) }}</text>
            <text
              x="231"
              y="256"
              text-anchor="end"
            >C 0</text>
          </g>
          <g
            v-for="point in points"
            :key="point.name"
            class="lig-oklch-point"
            :class="{ 'is-active': selected === point.name }"
            :style="{ '--point': point.hex }"
            @mouseenter="selected = point.name"
            @click="selected = point.name"
          >
            <line
              :x1="center"
              :y1="center"
              :x2="point.x"
              :y2="point.y"
            />
            <circle
              class="lig-oklch-halo"
              :cx="point.x"
              :cy="point.y"
              r="13"
            />
            <circle
              :cx="point.x"
              :cy="point.y"
              r="6"
              class="lig-oklch-dot"
            />
            <text
              :x="point.labelX"
              :y="point.labelY"
              :text-anchor="point.anchor"
              dominant-baseline="middle"
            >{{ point.name }}</text>
          </g>
        </svg>
        <div class="lig-oklch-lightness">
          <p class="lig-oklch-axis-title">
            {{ t('palette.oklch.lightnessTitle') }}
          </p>
          <svg
            class="lig-oklch-plot"
            viewBox="0 0 480 224"
            aria-hidden="true"
          >
            <rect
              v-for="segment in lightnessStrip"
              :key="segment.y"
              x="48"
              :y="segment.y"
              width="8"
              :height="lightnessHeight / 64 + 0.1"
              :fill="segment.fill"
            />
            <g class="lig-oklch-grid">
              <line
                v-for="l in lightnessTicks"
                :key="l"
                x1="64"
                x2="456"
                :y1="lightnessY(l)"
                :y2="lightnessY(l)"
              />
            </g>
            <g class="lig-oklch-ticks">
              <text
                v-for="l in lightnessTicks"
                :key="l"
                x="38"
                :y="lightnessY(l) + 4"
                text-anchor="end"
              >{{ l.toFixed(2) }}</text>
            </g>
            <line
              class="lig-oklch-level"
              x1="64"
              x2="456"
              :y1="lightnessY(active.l)"
              :y2="lightnessY(active.l)"
              :style="{ '--point': active.hex }"
            />
            <g
              v-for="point in points"
              :key="point.name"
              class="lig-oklch-point"
              :class="{ 'is-active': selected === point.name }"
              :style="{ '--point': point.hex }"
              @mouseenter="selected = point.name"
              @click="selected = point.name"
            >
              <line
                :x1="point.lx"
                :x2="point.lx"
                :y1="point.ly"
                :y2="lightnessY(0)"
              />
              <circle
                class="lig-oklch-halo"
                :cx="point.lx"
                :cy="point.ly"
                r="12"
              />
              <circle
                class="lig-oklch-dot"
                :cx="point.lx"
                :cy="point.ly"
                r="5"
              />
              <text
                :x="point.lx"
                y="194"
                text-anchor="middle"
              >{{ point.name }}</text>
              <text
                v-if="selected === point.name"
                :x="point.lx"
                :y="point.ly - 18"
                text-anchor="middle"
              >{{ (point.l * 100).toFixed(1) }}%</text>
            </g>
          </svg>
          <p class="lig-oklch-axis-note">
            {{ t('palette.oklch.lightnessNote') }}
          </p>
        </div>
      </div>
      <div class="lig-oklch-data">
        <table class="lig-oklch-table">
          <caption class="lig-oklch-caption">
            {{ t('palette.oklch.table') }}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                Token
              </th>
              <th scope="col">
                L
              </th>
              <th scope="col">
                C
              </th>
              <th scope="col">
                H
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="color in colors"
              :key="color.name"
              :class="{ 'is-active': selected === color.name }"
            >
              <th scope="row">
                <button
                  type="button"
                  :aria-pressed="selected === color.name"
                  :aria-label="color.token"
                  @mouseenter="selected = color.name"
                  @focus="selected = color.name"
                  @click="selected = color.name"
                >
                  <span
                    class="lig-oklch-swatch"
                    :style="{ background: color.hex }"
                  />
                  {{ color.name }}
                </button>
              </th>
              <td>{{ (color.l * 100).toFixed(1) }}%</td>
              <td>{{ color.c.toFixed(3) }}</td>
              <td>{{ (color.h ?? 0).toFixed(1) }}°</td>
            </tr>
          </tbody>
        </table>
        <div
          class="lig-oklch-selection"
          :style="{ '--point': active.hex }"
        >
          <p>{{ active.token }}</p>
          <code>{{ activeCss }}</code>
          <span>{{ active.hex }}</span>
        </div>
      </div>
    </div>
  </figure>
</template>
