<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })

const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()

const built = computed(() => buildVariant(variant.value))

function color(key: string): string {
  const value = (built.value as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

const ink = computed(() => [
  { id: 'text', hex: color('fg'), roles: 'keyword' },
  { id: 'quiet', hex: color('fg_muted'), roles: 'string' },
  { id: 'type', hex: color('type'), roles: 'type' },
  { id: 'value', hex: color('number'), roles: 'number' },
  { id: 'call', hex: color('func'), roles: 'func' },
  { id: 'special', hex: color('special'), roles: 'special' },
])
</script>

<template>
  <p class="lig-syntax-lede">
    {{ t('palette.syntax.lede') }}
  </p>
  <div class="lig-inks">
    <button
      v-for="inkItem in ink"
      :key="inkItem.id"
      type="button"
      class="lig-ink"
      :class="{ 'is-copied': copied === inkItem.id }"
      @click="copyValue(textFor(inkItem.hex, format, variant, inkItem.roles), inkItem.id)"
    >
      <span
        class="lig-ink-fill"
        :style="{ background: inkItem.hex }"
      />
      <span class="lig-ink-name">{{ t(`palette.syntax.ink.${inkItem.id}`) }}</span>
      <span class="lig-ink-value">{{ copied === inkItem.id ? t('install.copied') : textFor(inkItem.hex, format, variant, inkItem.roles) }}</span>
    </button>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteChoiceStop v-model:variant="variant" />
  <PaletteStage :variant="variant" />
</template>
