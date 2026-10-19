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
  watch(() => route.hash, (hash) => {
    if (hash === '#terminal-colors')
      open.value = true
  }, { immediate: true })
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
        {{ copied === 'terminal.background' ? t('install.copied') : resolved.tokens['terminal.background'] }}
      </button>
    </p>
    <div
      class="lig-color-table-scroll"
      role="region"
      tabindex="0"
      :aria-label="t('palette.terminal.reference')"
    >
      <table class="lig-color-table">
        <caption>{{ variant }} / terminal.ansi.0-15</caption>
        <thead>
          <tr>
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
      </table>
    </div>
    <span
      class="lig-color-announcement"
      role="status"
    >{{ copied ? t('install.copied') : '' }}</span>
  </Collapsible>
</template>

<style scoped>
.lig-terminal-reference {
  scroll-margin-top: 100px;
}
</style>
