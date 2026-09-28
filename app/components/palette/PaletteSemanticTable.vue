<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'

const props = defineProps<{
  variant: LigVariant
  rows: { role: string, hex: string, baseRef: string }[]
}>()

const { format, copied, copyValue, textFor } = usePaletteClipboard()
</script>

<template>
  <div class="lig-roles">
    <button
      v-for="row in rows"
      :key="row.role"
      type="button"
      class="lig-role"
      :class="{ 'is-copied': copied === row.role }"
      @click="copyValue(textFor(row.hex, format, props.variant, row.role), row.role)"
    >
      <span
        class="lig-role-mark"
        :style="{ background: row.hex }"
      />
      <span class="lig-role-name">{{ row.role }}</span>
      <span class="lig-role-value">{{ copied === row.role ? $t('install.copied') : textFor(row.hex, format, props.variant, row.role) }}</span>
    </button>
  </div>
</template>
