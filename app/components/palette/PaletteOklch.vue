<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { resolveVariant, spec } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const link = useKitLink()
const center = 180
const radius = 120
const activeName = ref('red')
const { format, copied, copyValue, textFor } = usePaletteClipboard()

const colors = computed(() => {
  const { tokens, oklch } = resolveVariant(props.variant)
  return Object.keys(spec.palette.accents).map((name) => {
    const token = `accent.${name}.base`
    return { name, hex: tokens[token]!, ...oklch[token]! }
  }).sort((a, b) => (a.h ?? 0) - (b.h ?? 0))
})
const active = computed(() => colors.value.find(color => color.name === activeName.value) ?? colors.value[0]!)

function copyColor(color: { name: string, hex: string }): void {
  activeName.value = color.name
  void copyValue(textFor(color.hex, format.value), color.name)
}

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
const activePoint = computed(() => points.value.find(point => point.name === active.value.name)!)
const activeIndex = computed(() => colors.value.findIndex(color => color.name === active.value.name))

function pointScale(index: number): number {
  return index === activeIndex.value ? 1 : 0.64
}

const activeRadius = computed(() => 14 * pointScale(activeIndex.value))
const lightnessRadius = computed(() => 9 * pointScale(activeIndex.value))
const lightnessAxis = 90
const lightnessFade = 96
const lightnessMask = `${useId().replace(/\W/g, '')}-lightness`
const hueSvg = useTemplateRef<SVGSVGElement>('hue')
const lightnessSvg = useTemplateRef<SVGSVGElement>('lightness')
const hueNudge = reactive({ x: 0, y: 0 })
const lightnessNudge = reactive({ x: 0, y: 0 })
const pointer = ref<{ chart: 'hue' | 'lightness', x: number, y: number } | null>(null)
let nudgeFrame = 0

function localPoint(event: PointerEvent, svg: SVGSVGElement): { x: number, y: number } | null {
  const ctm = svg.getScreenCTM()
  if (!ctm)
    return null
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const local = point.matrixTransform(ctm.inverse())
  return { x: local.x, y: local.y }
}

function aimedNudge(chart: 'hue' | 'lightness'): { x: number, y: number } {
  if (pointer.value?.chart !== chart)
    return { x: 0, y: 0 }
  const origin = chart === 'hue'
    ? { x: activePoint.value.x, y: activePoint.value.y }
    : { x: lightnessAxis + active.value.l * 200, y: 40 + activeIndex.value * 24 }
  const cap = chart === 'hue' ? 20 : 12
  const dx = pointer.value.x - origin.x
  const dy = pointer.value.y - origin.y
  if (Math.hypot(dx, dy) > cap)
    return { x: 0, y: 0 }
  return { x: dx * 0.18, y: dy * 0.18 }
}

function pullNudge(): void {
  cancelAnimationFrame(nudgeFrame)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const step = () => {
    let moving = false
    for (const [nudge, next] of [[hueNudge, aimedNudge('hue')], [lightnessNudge, aimedNudge('lightness')]] as const) {
      const dx = next.x - nudge.x
      const dy = next.y - nudge.y
      if (reduced || Math.hypot(dx, dy) < 0.15) {
        nudge.x = next.x
        nudge.y = next.y
      }
      else {
        nudge.x += dx * 0.05
        nudge.y += dy * 0.05
        moving = true
      }
    }
    if (moving)
      nudgeFrame = requestAnimationFrame(step)
  }
  nudgeFrame = requestAnimationFrame(step)
}

function onPoint(event: PointerEvent, chart: 'hue' | 'lightness', name: string): void {
  activeName.value = name
  const svg = chart === 'hue' ? hueSvg.value : lightnessSvg.value
  const local = svg ? localPoint(event, svg) : null
  if (!local)
    return
  pointer.value = { chart, ...local }
  pullNudge()
}

function onPointLeave(chart: 'hue' | 'lightness'): void {
  if (pointer.value?.chart === chart)
    pointer.value = null
  pullNudge()
}

onBeforeUnmount(() => cancelAnimationFrame(nudgeFrame))
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
        ref="hue"
        class="lig-oklch-plot"
        viewBox="0 0 360 360"
        role="group"
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
            y="16"
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
          v-for="(point, index) in points"
          :key="point.name"
          class="lig-oklch-point"
          :class="{ 'is-current': activeName === point.name }"
          :style="{ '--point-color': point.hex }"
          role="button"
          tabindex="0"
          :aria-label="`${point.name}: ${textFor(point.hex, format)}`"
          @pointerenter="onPoint($event, 'hue', point.name)"
          @pointermove="onPoint($event, 'hue', point.name)"
          @pointerleave="onPointLeave('hue')"
          @focus="activeName = point.name"
          @click="copyColor(point)"
          @keydown.enter.prevent="copyColor(point)"
          @keydown.space.prevent="copyColor(point)"
        >
          <title>{{ point.name }}: L {{ point.l.toFixed(3) }}, C {{ point.c.toFixed(3) }}, H {{ point.h }}°</title>
          <circle
            class="lig-oklch-hit"
            :cx="point.x"
            :cy="point.y"
            r="20"
          />
          <circle
            :cx="point.x"
            :cy="point.y"
            :r="14 * pointScale(index)"
            :fill="point.hex"
          />
          <text
            :x="point.labelX"
            :y="point.labelY"
            :text-anchor="point.anchor"
          >{{ point.name }}</text>
        </g>
        <MotionOutline
          :x="activePoint.x - activeRadius - 6"
          :y="activePoint.y - activeRadius - 6"
          :width="(activeRadius + 6) * 2"
          :height="(activeRadius + 6) * 2"
          :radius="activeRadius + 6"
          :color="active.hex"
          :nudge-x="hueNudge.x"
          :nudge-y="hueNudge.y"
        />
      </svg>
      <svg
        ref="lightness"
        class="lig-oklch-plot lig-oklch-lightness"
        viewBox="0 0 320 238"
        role="group"
        :aria-label="t('palette.oklch.lightnessTitle')"
      >
        <defs>
          <linearGradient
            :id="`${lightnessMask}-fade`"
            gradientUnits="userSpaceOnUse"
            :x1="lightnessAxis"
            y1="0"
            :x2="lightnessAxis + lightnessFade"
            y2="0"
          >
            <stop
              offset="0"
              stop-color="#fff"
              stop-opacity="0"
            />
            <stop
              offset="1"
              stop-color="#fff"
            />
          </linearGradient>
          <mask
            :id="lightnessMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="320"
            height="238"
          >
            <rect
              x="0"
              y="0"
              width="320"
              height="238"
              :fill="`url(#${lightnessMask}-fade)`"
            />
          </mask>
        </defs>
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
          :class="{ 'is-current': activeName === color.name }"
          :style="{ '--point-color': color.hex }"
          role="button"
          tabindex="0"
          :aria-label="`${color.name}: ${textFor(color.hex, format)}`"
          @pointerenter="onPoint($event, 'lightness', color.name)"
          @pointermove="onPoint($event, 'lightness', color.name)"
          @pointerleave="onPointLeave('lightness')"
          @focus="activeName = color.name"
          @click="copyColor(color)"
          @keydown.enter.prevent="copyColor(color)"
          @keydown.space.prevent="copyColor(color)"
        >
          <title>{{ color.name }}: L {{ color.l.toFixed(3) }}</title>
          <rect
            class="lig-oklch-hit"
            x="0"
            :y="28 + index * 24"
            width="310"
            height="24"
          />
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
            :mask="`url(#${lightnessMask})`"
          />
          <circle
            :cx="90 + color.l * 200"
            :cy="40 + index * 24"
            :r="9 * pointScale(index)"
            :fill="color.hex"
          />
        </g>
        <MotionOutline
          :x="90 + active.l * 200 - lightnessRadius - 4"
          :y="40 + activeIndex * 24 - lightnessRadius - 4"
          :width="(lightnessRadius + 4) * 2"
          :height="(lightnessRadius + 4) * 2"
          :radius="lightnessRadius + 4"
          :color="active.hex"
          :nudge-x="lightnessNudge.x"
          :nudge-y="lightnessNudge.y"
        />
      </svg>
    </div>
    <div
      class="lig-oklch-readout"
      :style="{ '--point-color': active.hex }"
    >
      <span class="lig-oklch-current">{{ active.name }}</span>
      <span class="lig-oklch-coordinates">
        L {{ active.l.toFixed(3) }} · C {{ active.c.toFixed(3) }} · H {{ active.h?.toFixed(1) ?? '—' }}°
      </span>
      <button
        type="button"
        :aria-label="`${active.name}: ${textFor(active.hex, format)}`"
        @click="copyColor(active)"
      >
        {{ copied === active.name ? $t('install.copied') : textFor(active.hex, format) }}
      </button>
      <span
        class="lig-oklch-announcement"
        role="status"
      >{{ copied ? $t('install.copied') : '' }}</span>
    </div>
  </figure>
</template>
