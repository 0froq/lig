<script setup lang="ts">
import type { LigVariant, ResolvedVariant } from '../../../core'
import { resolveVariant } from '../../../core'

const props = defineProps<{ variant: LigVariant, preview?: ResolvedVariant }>()
const { t } = useI18n()
const route = useRoute()
const resolved = computed(() => props.preview ?? resolveVariant(props.variant))
const tokens = computed(() => resolved.value.tokens)
const style = computed(() => ({
  '--pv-bg': tokens.value['terminal.background'],
  '--pv-fg': tokens.value['terminal.foreground'],
  '--pv-muted': tokens.value['text.secondary'],
  '--pv-line': tokens.value['border.default'],
}))
const banks = computed(() => terminalColors(tokens.value))
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
      <pre><code><span :style="{ color: tokens['terminal.ansi.2'] }">❯</span> lig check --colors
<span :style="{ color: tokens['terminal.ansi.4'] }">info</span>    loading theme tokens
<span :style="{ color: tokens['terminal.ansi.6'] }">fetch</span>   origin/codex/lig-core-tokens
<span :style="{ color: tokens['terminal.ansi.2'] }">pass</span>    palette resolved
<span :style="{ color: tokens['terminal.ansi.3'] }">warning</span> dependency deprecated
<span :style="{ color: tokens['terminal.ansi.11'] }">warning</span> retrying connection
<span :style="{ color: tokens['terminal.ansi.1'] }">error</span>   example diagnostic
<span :style="{ color: tokens['terminal.ansi.5'] }">branch</span>  preview/hue-calibration
<span :style="{ color: tokens['terminal.ansi.8'] }">quiet</span>   dimmed terminal output
<span :style="{ color: tokens['terminal.ansi.15'] }">ready</span>   theme loaded</code></pre>
    </div>
    <p class="lig-ansi-fill-example">
      <code :style="{ background: tokens['accent.yellow.fill'], color: tokens['text.on.yellow'] }">WARN</code>
      2 warnings
    </p>
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
  margin-top: 28px;
  overflow-x: auto;
}

.lig-ansi-output pre {
  margin: 0;
  font: 13px/1.8 var(--font-meta);
}

.lig-ansi-output:focus-visible {
  outline: 1px solid var(--pv-fg);
  outline-offset: 4px;
}

.lig-ansi-fill-example {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin: 16px 0 0;
  font: 11px/1.7 var(--font-meta);
}

.lig-ansi-fill-example code {
  padding: 2px 8px;
}

@media (max-width: 600px) {
  .lig-ansi-bank {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
</style>
