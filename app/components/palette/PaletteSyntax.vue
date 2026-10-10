<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { Oklch, ResolvedVariant } from '../../../core'
import { apcaContrast, contrast, oklchToHex, resolveVariant, spec, VARIANTS } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const resolved = computed(() => resolveVariant(variant.value))

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
] as const

const neutralOptions = [...neutralOrder.map(name => ({
  name,
  hex: oklchToHex(spec.palette.neutrals[name]!),
  lightness: spec.palette.neutrals[name]!.l,
})), ...Object.entries(spec.palette.paper).map(([name, color]) => ({
  name,
  hex: oklchToHex(color),
  lightness: color.l,
}))]

type BackgroundName = string
interface LabState {
  baseLightness: number
  baseChroma: number
  background: BackgroundName
}

function labState(variant: LigVariant): LabState {
  const initial = resolveVariant(variant)
  const base = initial.oklch['family.struct.base']!
  return {
    baseLightness: base.l,
    baseChroma: base.c,
    background: neutralOptions.find(option => option.hex === initial.tokens['surface.canvas'])?.name ?? 'surface.canvas',
  }
}

const labByVariant = ref(Object.fromEntries(VARIANTS.map(name => [name, labState(name)])) as Record<LigVariant, LabState>)
const activeLab = computed(() => labByVariant.value[variant.value])
const backgroundName = computed<BackgroundName>({
  get: () => activeLab.value.background,
  set: value => activeLab.value.background = value,
})
const baseLightness = computed<number>({
  get: () => activeLab.value.baseLightness,
  set: value => activeLab.value.baseLightness = value,
})
const baseChroma = computed<number>({
  get: () => activeLab.value.baseChroma,
  set: value => activeLab.value.baseChroma = value,
})
const backgroundColor = computed(() => backgroundName.value === 'surface.canvas'
  ? resolved.value.oklch['surface.canvas']!
  : (spec.palette.neutrals[backgroundName.value] ?? spec.palette.paper[backgroundName.value])!)
const backgroundHex = computed(() => oklchToHex(backgroundColor.value))

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function experimentalColor(sourceBase: Oklch, source: Oklch, mono = false): Oklch {
  // Mono keeps its authored neutral-ramp selections while chromatic inks vary.
  if (mono || sourceBase.h === null)
    return source
  const targetBase = resolved.value.oklch['family.struct.base']!
  const lightnessDelta = baseLightness.value - targetBase.l
  const chromaDelta = baseChroma.value - targetBase.c
  const l = clamp(source.l + lightnessDelta, 0, 1)
  const c = Math.max(0, source.c + chromaDelta)
  return { l, c, h: c === 0 ? null : sourceBase.h }
}

const inks = computed(() => families.map((family) => {
  const baseToken = `family.${family}.base`
  const sourceBase = resolved.value.oklch[baseToken]!
  const levels = (['highlight', 'base', 'muted'] as const).map((tier) => {
    const token = `family.${family}.${tier}`
    const color = experimentalColor(sourceBase, resolved.value.oklch[token]!, family === 'mono')
    const hex = oklchToHex(color)
    return {
      tier,
      token,
      color,
      hex,
      neutral: family === 'mono' ? neutralOptions.find(option => option.hex === hex)?.name : undefined,
      wcag: contrast(hex, backgroundHex.value),
      apca: apcaContrast(hex, backgroundHex.value),
    }
  })
  return { family, token: baseToken, hex: levels[1]!.hex, levels }
}))

const preview = computed<ResolvedVariant>(() => {
  const nextTokens = { ...resolved.value.tokens }
  const nextOklch = { ...resolved.value.oklch }
  const authored = new Set<string>()

  for (const ink of inks.value) {
    for (const level of ink.levels) {
      nextTokens[level.token] = level.hex
      nextOklch[level.token] = level.color
      authored.add(level.token)
    }
  }

  const monoSecondary = resolved.value.oklch['family.mono.secondary']!
  nextOklch['family.mono.secondary'] = monoSecondary
  nextTokens['family.mono.secondary'] = oklchToHex(monoSecondary)
  authored.add('family.mono.secondary')
  const monoMap = {
    'text.strong': 'family.mono.highlight',
    'text.primary': 'family.mono.base',
    'text.secondary': 'family.mono.secondary',
    'text.subtle': 'family.mono.muted',
  } as const
  for (const [token, source] of Object.entries(monoMap)) {
    nextOklch[token] = nextOklch[source]!
    nextTokens[token] = nextTokens[source]!
    authored.add(token)
  }

  const background = backgroundColor.value
  nextOklch['surface.canvas'] = background
  nextTokens['surface.canvas'] = backgroundHex.value
  authored.add('surface.canvas')
  const selected = spec.variants[variant.value]
  const expressions = { ...spec.tokens, ...spec.modes[selected.mode], ...selected.overrides }
  const updated = new Set(authored)
  function updateAlias(token: string): void {
    if (updated.has(token))
      return
    updated.add(token)
    const source = expressions[token]
    if (typeof source !== 'string' || !nextOklch[source])
      return
    updateAlias(source)
    nextOklch[token] = nextOklch[source]!
    nextTokens[token] = nextTokens[source]!
  }
  for (const token of Object.keys(expressions))
    updateAlias(token)
  return { mode: resolved.value.mode, tokens: nextTokens, oklch: nextOklch }
})

function formatApca(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)} Lc`
}
</script>

<template>
  <p class="lig-syntax-lede">
    {{ t('palette.syntax.lede') }}
  </p>
  <div class="lig-syntax-lab">
    <div class="lig-syntax-lab-heading">
      <p class="lig-syntax-lab-title">
        {{ t('palette.syntax.lab.title') }}
      </p>
      <p class="lig-syntax-lab-note">
        {{ t(variant.endsWith('paper') ? 'palette.syntax.lab.paperNote' : 'palette.syntax.lab.note') }}
      </p>
    </div>
    <div class="lig-syntax-lab-controls">
      <label class="lig-syntax-control">
        <span>{{ t('palette.syntax.lab.lightness') }} <output>{{ baseLightness.toFixed(2) }}</output></span>
        <input
          v-model.number="baseLightness"
          type="range"
          min="0"
          max="1"
          step="0.01"
        >
      </label>
      <label class="lig-syntax-control">
        <span>{{ t('palette.syntax.lab.chroma') }} <output>{{ baseChroma.toFixed(3) }}</output></span>
        <input
          v-model.number="baseChroma"
          type="range"
          min="0"
          max="0.2"
          step="0.005"
        >
      </label>
      <label class="lig-syntax-control">
        <span>{{ t('palette.syntax.lab.background') }}</span>
        <select v-model="backgroundName">
          <option value="surface.canvas">
            surface.canvas · L {{ resolved.oklch['surface.canvas']!.l.toFixed(2) }}
          </option>
          <option
            v-for="option in neutralOptions"
            :key="option.name"
            :value="option.name"
          >
            {{ option.name }} · L {{ option.lightness.toFixed(2) }}
          </option>
        </select>
      </label>
    </div>
  </div>
  <div class="lig-inks lig-semantic-families">
    <button
      v-for="ink in inks"
      :key="ink.family"
      type="button"
      class="lig-ink"
      :class="{ 'is-copied': copied === ink.family }"
      @click="copyValue(textFor(ink.hex, format, variant, ink.token), ink.family)"
    >
      <span
        class="lig-family-colors"
      >
        <span
          v-for="level in ink.levels"
          :key="level.tier"
          class="lig-family-level"
        >
          <i :style="{ background: level.hex }" />
          <span
            class="lig-family-metrics"
            :class="{ 'is-low-contrast': level.wcag < 4.5 }"
          >
            <b>{{ level.tier }}</b>
            <span>{{ level.neutral ?? `C ${level.color.c.toFixed(3)}` }}</span>
            <span>L {{ level.color.l.toFixed(2) }}</span>
            <span>WCAG 2.2 {{ level.wcag.toFixed(2) }}:1</span>
            <span>APCA {{ formatApca(level.apca) }}</span>
          </span>
        </span>
      </span>
      <span class="lig-ink-name">{{ ink.family }}</span>
      <span class="lig-family-description">{{ t(`palette.syntax.families.${ink.family}`) }}</span>
      <span class="lig-ink-value">{{ copied === ink.family ? t('install.copied') : textFor(ink.hex, format, variant, ink.token) }}</span>
    </button>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteStage
    :variant="variant"
    :preview="preview"
  />
</template>
