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
    { label: '❯', index: 2, message: 'lig check', highlight: '--colors' },
    { label: 'info', index: 4, message: 'loading', highlight: 'theme tokens' },
    { label: 'fetch', index: 6, message: 'palette.json', highlight: 'cached' },
    { label: 'pass', index: 2, message: 'palette', highlight: 'resolved' },
    { label: 'warning', index: 3, message: 'dependency', highlight: 'deprecated' },
    { label: 'error', index: 1, message: 'sample.ts', highlight: 'missing export' },
    { label: 'branch', index: 5, message: 'on', highlight: 'preview' },
    { label: 'quiet', index: 8, message: 'output', highlight: 'dimmed' },
    { label: 'ready', index: 15, message: 'theme', highlight: 'loaded' },
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
        <code class="lig-ansi-output-message">
          {{ row.message }} <span
            class="lig-ansi-output-fill"
            :style="{ background: row.color.hex, color: row.color.label }"
          >{{ row.highlight }}</span>
        </code>
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
  gap: 8px;
  margin-top: 32px;
  overflow-x: auto;
}

.lig-ansi-output-row {
  display: grid;
  grid-template-columns: 7ch minmax(0, 1fr);
  align-items: baseline;
  gap: 18px;
  min-width: 0;
  font: 13px/1.8 var(--font-meta);
}

.lig-ansi-output-row:first-child {
  margin-bottom: 9px;
}

.lig-ansi-output-message {
  min-width: 0;
  overflow-wrap: anywhere;
}

.lig-ansi-output-fill {
  padding: 1px 5px;
  box-decoration-break: clone;
  white-space: nowrap;
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
