<script setup lang="ts">
import type { LigVariant } from '../../../core'
import { Collapsible } from '@froq/ui'
import { resolveVariant } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const route = useRoute()
const resolved = computed(() => resolveVariant(props.variant))
const banks = computed(() => terminalColors(resolved.value.tokens))
const open = ref(false)
const { copied, copyValue } = usePaletteClipboard()

onMounted(() => {
  watch(
    () => route.hash,
    hash => {
      if (hash === '#terminal-colors') open.value = true
    },
    { immediate: true },
  )
})
</script>

<template>
  <Collapsible
    id="terminal-colors"
    v-model="open"
    class="lig-more lig-terminal-reference lig-ui ui"
    :label="t('palette.terminal.reference')"
  >
    <p class="lig-aside">
      {{ t('palette.terminal.note') }}
      <button
        type="button"
        class="lig-color-copy"
        :style="{ '--copy-color': resolved.tokens['terminal.background'] }"
        :aria-label="`${t('install.copy')}: ${resolved.tokens['terminal.background']}`"
        :class="{ 'is-copied': copied === 'terminal.background' }"
        @click="copyValue(resolved.tokens['terminal.background']!, 'terminal.background')"
      >
        {{
          copied === 'terminal.background'
            ? t('install.copied')
            : resolved.tokens['terminal.background']
        }}
      </button>
    </p>
    <p class="lig-color-table-title"> {{ variant }} / terminal.ansi.0-15 </p>
    <PaletteColorTable :label="t('palette.terminal.reference')">
      <template #columns>
        <th
          scope="col"
          class="lig-pin-1"
        >
          ANSI
        </th>
        <th
          scope="col"
          class="lig-pin-2 lig-pin-end"
        >
          {{ t('palette.terminal.color') }}
        </th>
        <th scope="col"> HEX </th>
        <th scope="col"> SGR fg / bg </th>
        <th scope="col"> WCAG 2.2 </th>
        <th scope="col"> APCA Lc </th>
      </template>
      <template #default>
        <tbody
          v-for="bank in banks"
          :key="bank.start"
        >
          <tr
            v-for="color in bank.colors"
            :key="color.index"
          >
            <th
              scope="row"
              class="lig-pin-1"
            >
              {{ color.index }}
            </th>
            <td
              class="lig-pin-2 lig-pin-end"
              :style="{ color: color.hex }"
            >
              <span
                class="lig-color-key"
                :style="{ background: color.hex }"
                aria-hidden="true"
              />{{ color.name }}
            </td>
            <td>
              <button
                type="button"
                class="lig-color-copy"
                :style="{ '--copy-color': color.hex }"
                :aria-label="`${t('install.copy')}: ${color.hex}`"
                :class="{ 'is-copied': copied === `terminal.ansi.${color.index}` }"
                @click="copyValue(color.hex, `terminal.ansi.${color.index}`)"
              >
                {{ copied === `terminal.ansi.${color.index}` ? t('install.copied') : color.hex }}
              </button>
            </td>
            <td>{{ color.foregroundCode }} / {{ color.backgroundCode }}</td>
            <td>{{ color.wcag }}:1</td>
            <td>{{ color.apca > 0 ? '+' : '' }}{{ color.apca.toFixed(0) }}</td>
          </tr>
        </tbody>
      </template>
    </PaletteColorTable>
    <span
      class="lig-color-announcement"
      role="status"
      >{{ copied ? t('install.copied') : '' }}</span
    >
  </Collapsible>
</template>

<style scoped>
.lig-more {
  margin-top: 28px;
}

/* Keep closed sections compact, but leave space after an open section's content. */
.lig-more:not(.is-open) + .lig-more {
  margin-top: 0;
}

.lig-more:not(.is-open) + .lig-more > :deep(.ui-collapsible-trigger) {
  padding-top: 8px;
}

/* Pinned titles sit under the notice bar when there is one. */
.ui-collapsible.lig-more.is-open > :deep(.ui-collapsible-trigger) {
  top: var(--banner-h, 0px);
}

.lig-terminal-reference {
  scroll-margin-top: 100px;
}

.lig-aside {
  max-width: 40rem;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.lig-color-table-title {
  margin: 16px 0 12px;
  font: 11px/1.6 var(--font-meta);
  font-variant-numeric: tabular-nums;
}

/* The background copy button and live region are outside PaletteColorTable. */
.lig-color-copy {
  min-width: 8ch;
  padding: 0;
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  color: var(--fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.lig-color-copy:hover,
.lig-color-copy:focus-visible {
  border-bottom-color: var(--copy-color);
}

.lig-color-copy.is-copied {
  color: var(--copy-color);
}

.lig-color-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
