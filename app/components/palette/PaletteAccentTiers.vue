<script setup lang="ts">
import type { LigVariant } from '../../../core'
import { resolveVariant, spec } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const { copied, copyValue } = usePaletteClipboard()
const tiers = [
  { key: 'highlight', label: 'highlight' },
  { key: 'base', label: 'base' },
  { key: 'faded', label: 'muted' },
] as const
const families = computed(() => {
  const { tokens, oklch } = resolveVariant(props.variant)
  return Object.keys(spec.palette.accents).map(name => ({
    name,
    hex: tokens[`accent.${name}.base`]!,
    levels: tiers.map(tier => {
      const token = `accent.${name}.${tier.key}`
      return { token, label: tier.label, hex: tokens[token]!, ...oklch[token]! }
    }),
  }))
})
</script>

<template>
  <div>
    <p class="lig-color-table-title"> {{ variant }} / accent.* </p>
    <PaletteColorTable
      :label="t('palette.more')"
      :table-style="{ '--pin-1': '7ch' }"
    >
      <template #columns>
        <th
          scope="col"
          class="lig-pin-1"
        >
          {{ t('palette.tiers.color') }}
        </th>
        <th
          scope="col"
          class="lig-pin-2 lig-pin-end"
        >
          {{ t('palette.tiers.tier') }}
        </th>
        <th scope="col"> HEX </th>
        <th scope="col"> L </th>
        <th scope="col"> C </th>
        <th scope="col"> H </th>
      </template>
      <template #default>
        <tbody
          v-for="family in families"
          :key="family.name"
        >
          <tr
            v-for="(level, index) in family.levels"
            :key="level.token"
          >
            <th
              v-if="index === 0"
              scope="rowgroup"
              rowspan="3"
              class="lig-pin-1"
              :style="{ color: family.hex }"
            >
              {{ family.name }}
            </th>
            <th
              scope="row"
              class="lig-pin-2 lig-pin-end"
              :style="{ color: level.hex }"
            >
              {{ t(`palette.tiers.${level.label}`) }}
            </th>
            <td>
              <span
                class="lig-color-key"
                :style="{ background: level.hex }"
                aria-hidden="true"
              />
              <button
                type="button"
                class="lig-color-copy"
                :style="{ '--copy-color': level.hex }"
                :class="{ 'is-copied': copied === level.token }"
                :aria-label="`${t('install.copy')}: ${level.hex}`"
                @click="copyValue(level.hex, level.token)"
              >
                {{ copied === level.token ? t('install.copied') : level.hex }}
              </button>
            </td>
            <td>{{ level.l.toFixed(3) }}</td>
            <td>{{ level.c.toFixed(3) }}</td>
            <td>{{ level.h?.toFixed(1) ?? '—' }}</td>
          </tr>
        </tbody>
      </template>
      <template #after>
        <span
          class="lig-color-announcement"
          role="status"
          >{{ copied ? t('install.copied') : '' }}</span
        >
      </template>
    </PaletteColorTable>
  </div>
</template>

<style scoped>
.lig-color-table-title {
  margin: 16px 0 12px;
  font: 11px/1.6 var(--font-meta);
  font-variant-numeric: tabular-nums;
}
</style>
