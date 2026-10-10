<script setup lang="ts">
import type { LigVariant } from '../../../core'
import { resolveVariant } from '../../../core'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()
const route = useRoute()
const resolved = computed(() => resolveVariant(props.variant))
const tokens = computed(() => resolved.value.tokens)
const style = computed(() => ({
  '--pv-bg': tokens.value['terminal.background'],
  '--pv-fg': tokens.value['terminal.foreground'],
  '--pv-muted': tokens.value['text.secondary'],
  '--pv-line': tokens.value['border.default'],
}))
const banks = computed(() => terminalColors(tokens.value))
const output = computed(() => {
  const colors = banks.value.flatMap(bank => bank.colors)
  return [
    { label: '❯', index: 2, message: 'lig check --colors' },
    { label: 'info', index: 4, message: 'loading theme tokens' },
    { label: 'fetch', index: 6, message: 'origin/codex/lig-core-tokens' },
    { label: 'pass', index: 2, message: 'palette resolved' },
    { label: 'warning', index: 3, message: 'dependency deprecated' },
    { label: 'error', index: 1, message: 'example diagnostic' },
    { label: 'branch', index: 5, message: 'preview/hue-calibration' },
    { label: 'quiet', index: 8, message: 'dimmed terminal output' },
    { label: 'ready', index: 15, message: 'theme loaded' },
  ].map(row => ({ ...row, color: colors[row.index]! }))
})
</script>

<template>
  <section
    id="terminal"
    class="lig-parsed lig-ansi"
    :style="style"
    :aria-label="t('palette.terminal.title')"
  >
    <header class="lig-parsed-header">
      <span>terminal</span>
      <NuxtLink :to="{ hash: '#terminal-colors', query: route.query }">
        {{ t('palette.terminal.referenceLink') }} ↗
      </NuxtLink>
    </header>
    <div class="lig-ansi-samples">
      <div
        v-for="bank in banks"
        :key="bank.start"
        class="lig-ansi-bank"
      >
        <span class="lig-ansi-bank-name">{{ t(bank.start === 0 ? 'palette.terminal.normal' : 'palette.terminal.bright') }}</span>
        <div class="lig-ansi-colors">
          <div
            v-for="color in bank.colors"
            :key="color.index"
            class="lig-ansi-color"
            :aria-label="`${color.index} ${color.name}`"
          >
            <code :style="{ color: color.hex }">Aa</code>
            <span
              class="lig-ansi-background"
              :style="{ color: color.label, background: color.hex }"
              aria-hidden="true"
            >{{ color.index.toString().padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="lig-ansi-output"
      role="region"
      tabindex="0"
      :aria-label="t('palette.terminal.output')"
    >
      <div
        v-for="row in output"
        :key="row.label"
        class="lig-ansi-output-row"
      >
        <code :style="{ color: row.color.hex }">{{ row.label }}</code>
        <code
          class="lig-ansi-output-fill"
          :style="{ background: row.color.hex, color: row.color.label }"
          aria-hidden="true"
        >{{ row.label }}</code>
        <code>{{ row.message }}</code>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lig-ansi .lig-parsed-header a {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.lig-ansi-samples {
  display: grid;
  gap: 16px;
  max-width: 36rem;
  margin-top: 28px;
}

.lig-ansi-bank {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.lig-ansi-bank-name {
  color: var(--pv-muted);
  font: 11px/1.5 var(--font-meta);
}

.lig-ansi-colors {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 4px;
}

.lig-ansi-color {
  display: grid;
  gap: 8px;
  min-width: 0;
  font: 13px/1.5 var(--font-meta);
  text-align: center;
}

.lig-ansi-background {
  padding-block: 6px;
  box-shadow: inset 0 0 0 1px var(--pv-line);
  font-size: 10px;
}

.lig-ansi-output {
  display: grid;
  gap: 7px;
  margin-top: 28px;
  overflow-x: auto;
}

.lig-ansi-output-row {
  display: grid;
  grid-template-columns: 5.5rem 5.5rem minmax(0, 1fr);
  align-items: baseline;
  gap: 12px;
  min-width: 28rem;
  font: 13px/1.8 var(--font-meta);
  white-space: nowrap;
}

.lig-ansi-output-fill {
  padding-inline: 8px;
  text-align: center;
}

.lig-ansi-output:focus-visible {
  outline: 1px solid var(--pv-fg);
  outline-offset: 4px;
}

@media (max-width: 600px) {
  .lig-ansi-bank {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
</style>
