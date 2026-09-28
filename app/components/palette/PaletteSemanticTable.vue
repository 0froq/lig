<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { formats } from '#palette/convert'

defineProps<{
  variant: LigVariant
  rows: { role: string, hex: string, baseRef: string }[]
}>()

const { copyValue, copied } = usePaletteClipboard()
</script>

<template>
  <div class="lig-table-wrap">
    <table class="lig-table">
      <thead>
        <tr>
          <th>{{ $t('palette.semantic.role') }}</th>
          <th>{{ $t('palette.semantic.ref') }}</th>
          <th>{{ $t('palette.semantic.hex') }}</th>
          <th>{{ $t('palette.semantic.rgb') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.role"
          class="lig-table-row"
          :class="{ 'is-copied': copied === row.role }"
          @click="copyValue(formats(row.hex).hex, row.role)"
        >
          <td><code>{{ row.role }}</code></td>
          <td><code>{{ row.baseRef }}</code></td>
          <td>
            <span
              class="lig-table-dot"
              :style="{ background: row.hex }"
            />
            {{ formats(row.hex).hex }}
          </td>
          <td>{{ formats(row.hex).rgb }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
