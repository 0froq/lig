<script setup lang="ts">
import type { ChoiceOption } from '@froq/ui'
import type { LigVariant } from '../../../core'
import { Choice, GridTable } from '@froq/ui'
import { VARIANT_OPTIONS } from '~/utils/lig-variant'
import { LIGHTWEIGHT_PORTS, lightweightPath } from '../../../ports/catalog'

const { t } = useI18n()
const { variant } = useLigVariant()
const options = computed<ChoiceOption<LigVariant>[]>(() =>
  VARIANT_OPTIONS.map(option => ({
    value: option.id,
    label: t(option.label),
  })),
)

function downloadName(port: (typeof LIGHTWEIGHT_PORTS)[number], id: LigVariant): string {
  return lightweightPath(port, id).split('/').pop() ?? port.id
}
</script>

<template>
  <GridTable
    class="lig-matrix lig-ui ui"
    :label="t('palette.downloads.lightweight')"
    :rows="LIGHTWEIGHT_PORTS"
    :row-key="port => port.id"
    :columns="VARIANT_OPTIONS"
    :column-key="option => option.id"
    :current="variant"
  >
    <template #header>
      <Choice
        v-model="variant"
        :options="options"
      />
    </template>
    <template #row-header="{ row: port }">
      <h3
        :id="`port-${port.id}`"
        class="lig-matrix-port"
      >
        {{ port.title }}
      </h3>
    </template>
    <template #cell="{ row: port, column: option }">
      <DownloadLink
        :href="`/ports/${lightweightPath(port, option.id)}`"
        :download="downloadName(port, option.id)"
        :title="`${port.title} ${t(option.label)}`"
      />
    </template>
  </GridTable>
</template>
