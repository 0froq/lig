<script setup lang="ts">
import type { LigVariant } from '../../../core'
import { resolveVariant } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const route = useRoute()
const resolved = computed(() => resolveVariant(props.variant))
const banks = computed(() => terminalColors(resolved.value.tokens))
</script>

<template>
  <details
    id="terminal-colors"
    class="lig-more lig-terminal-reference"
    :open="route.hash === '#terminal-colors'"
  >
    <summary>{{ t('palette.terminal.reference') }}</summary>
    <p class="lig-aside">
      {{ t('palette.terminal.note') }}
      <code>{{ resolved.tokens['terminal.background'] }}</code>
    </p>
    <div
      class="lig-terminal-table-scroll"
      role="region"
      tabindex="0"
      :aria-label="t('palette.terminal.reference')"
    >
      <table>
        <caption>{{ variant }} / terminal.ansi.0-15</caption>
        <thead>
          <tr>
            <th scope="col">
              ANSI
            </th>
            <th scope="col">
              {{ t('palette.terminal.color') }}
            </th>
            <th scope="col">
              HEX
            </th>
            <th scope="col">
              SGR fg / bg
            </th>
            <th scope="col">
              WCAG 2.2
            </th>
            <th scope="col">
              APCA Lc
            </th>
          </tr>
        </thead>
        <tbody
          v-for="bank in banks"
          :key="bank.start"
        >
          <tr
            v-for="color in bank.colors"
            :key="color.index"
          >
            <th scope="row">
              {{ color.index }}
            </th>
            <td>
              <span
                class="lig-terminal-color-key"
                :style="{ background: color.hex }"
                aria-hidden="true"
              />{{ color.name }}
            </td>
            <td>{{ color.hex }}</td>
            <td>{{ color.foregroundCode }} / {{ color.backgroundCode }}</td>
            <td>{{ color.wcag }}:1</td>
            <td>{{ color.apca > 0 ? '+' : '' }}{{ color.apca.toFixed(0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="lig-aside">
      {{ t('palette.terminal.contrastNote') }}
    </p>
  </details>
</template>

<style scoped>
.lig-terminal-reference {
  scroll-margin-top: 100px;
}

.lig-terminal-table-scroll {
  margin-top: 24px;
  overflow-x: auto;
}

.lig-terminal-table-scroll:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  font: 11px/1.6 var(--font-meta);
  font-variant-numeric: tabular-nums;
  text-align: left;
}

caption {
  padding-bottom: 12px;
  text-align: left;
}

th,
td {
  padding: 6px 16px 6px 0;
  font-weight: 400;
}

thead {
  color: var(--muted);
}

tbody {
  border-top: 1px solid var(--line);
}

.lig-terminal-color-key {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  vertical-align: -2px;
  box-shadow: inset 0 0 0 1px var(--line);
}
</style>
