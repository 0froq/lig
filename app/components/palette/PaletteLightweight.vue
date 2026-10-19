<script setup lang="ts">
import type { ChoiceOption } from '@froq/ui'
import type { LigVariant } from '../../../core'
import { Choice } from '@froq/ui'
import { VARIANT_OPTIONS } from '~/utils/lig-variant'
import { LIGHTWEIGHT_PORTS, lightweightPath } from '../../../ports/catalog'

const { t } = useI18n()
const { variant } = useLigVariant()
const options = computed<ChoiceOption<LigVariant>[]>(() => VARIANT_OPTIONS.map(option => ({
  value: option.id,
  label: t(option.label),
})))

function downloadName(port: typeof LIGHTWEIGHT_PORTS[number], id: LigVariant): string {
  return lightweightPath(port, id).split('/').pop() ?? port.id
}
</script>

<template>
  <div
    class="lig-matrix"
    role="group"
    :aria-label="t('palette.downloads.lightweight')"
  >
    <span class="lig-matrix-corner" />
    <Choice
      v-model="variant"
      class="lig-matrix-choice"
      :options="options"
    />
    <template
      v-for="port in LIGHTWEIGHT_PORTS"
      :key="port.id"
    >
      <h3
        :id="`port-${port.id}`"
        class="lig-matrix-port"
      >
        {{ port.title }}
      </h3>
      <div
        v-for="option in VARIANT_OPTIONS"
        :key="`${port.id}-${option.id}`"
        class="lig-matrix-cell"
        :class="{ 'is-current': variant === option.id }"
      >
        <DownloadLink
          :href="`/ports/${lightweightPath(port, option.id)}`"
          :download="downloadName(port, option.id)"
          :title="`${port.title} ${t(option.label)}`"
        />
      </div>
    </template>
  </div>
</template>
