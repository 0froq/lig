<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { ResolvedVariant, TokenExpression } from '../../../core'
import { apcaContrast, contrast, offsetOklch, oklchToHex, resolveVariant, spec, VARIANTS } from '../../../core'

const variant = defineModel<LigVariant>('variant', { required: true })
const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()
const families = ['mono', 'struct', 'ref', 'action'] as const
const chromaticFamilies = ['struct', 'ref', 'action'] as const
type ChromaticFamily = typeof chromaticFamilies[number]
const accentFor = { struct: 'green', ref: 'blue', action: 'orange' } as const
const selectedFamily = ref<ChromaticFamily>('struct')
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
  families: Record<ChromaticFamily, { l: number, c: number }>
  background: BackgroundName
}

function labState(variant: LigVariant): LabState {
  const initial = resolveVariant(variant)
  return {
    families: Object.fromEntries(chromaticFamilies.map((family) => {
      const { l, c } = initial.oklch[`family.${family}.base`]!
      return [family, { l, c }]
    })) as LabState['families'],
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
  get: () => activeLab.value.families[selectedFamily.value].l,
  set: value => activeLab.value.families[selectedFamily.value].l = value,
})
const baseChroma = computed<number>({
  get: () => activeLab.value.families[selectedFamily.value].c,
  set: value => activeLab.value.families[selectedFamily.value].c = value,
})
const backgroundColor = computed(() => backgroundName.value === 'surface.canvas'
  ? resolved.value.oklch['surface.canvas']!
  : (spec.palette.neutrals[backgroundName.value] ?? spec.palette.paper[backgroundName.value])!)
const backgroundHex = computed(() => oklchToHex(backgroundColor.value))

const preview = computed<ResolvedVariant>(() => {
  const selected = spec.variants[variant.value]
  const overrides: Record<string, TokenExpression> = { ...selected.overrides }
  for (const family of chromaticFamilies) {
    const name = accentFor[family]
    const primitive = spec.palette.accents[name]!
    const target = activeLab.value.families[family]
    overrides[`accent.${name}.base`] = {
      offset: `palette.accents.${name}`,
      lightness: target.l - primitive.l,
      chroma: target.c - primitive.c,
    }
    const base = offsetOklch(primitive, target.l - primitive.l, target.c - primitive.c)
    // Keep both endpoints valid even when the base is near the L/C limits.
    const lightness = Math.min(0.07, base.l, 1 - base.l)
    const chroma = resolved.value.mode === 'dark' ? -Math.min(0.02, base.c) : 0
    overrides[`accent.${name}.highlight`] = {
      offset: `accent.${name}.base`,
      lightness: resolved.value.mode === 'dark' ? lightness : -lightness,
      chroma,
    }
    overrides[`accent.${name}.faded`] = {
      offset: `accent.${name}.base`,
      lightness: resolved.value.mode === 'dark' ? -lightness : lightness,
      chroma,
    }
  }
  if (backgroundName.value !== 'surface.canvas') {
    const group = Object.hasOwn(spec.palette.neutrals, backgroundName.value) ? 'neutrals' : 'paper'
    overrides['surface.canvas'] = `palette.${group}.${backgroundName.value}`
  }
  return resolveVariant(variant.value, {
    ...spec,
    variants: { ...spec.variants, [variant.value]: { ...selected, overrides } },
  })
})

const inks = computed(() => families.map((family) => {
  const baseToken = `family.${family}.base`
  const levels = (['highlight', 'base', 'muted'] as const).map((tier) => {
    const token = `family.${family}.${tier}`
    const color = preview.value.oklch[token]!
    const hex = preview.value.tokens[token]!
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
        <span>{{ t('palette.syntax.lab.family') }}</span>
        <select v-model="selectedFamily">
          <option
            v-for="family in chromaticFamilies"
            :key="family"
            :value="family"
          >
            {{ family }}
          </option>
        </select>
      </label>
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
