<script setup lang="ts">
import type { LigVariant, ResolvedVariant } from '../../../core'
import { apcaContrast, contrast, resolveVariant } from '../../../core'

const props = defineProps<{ variant: LigVariant, preview?: ResolvedVariant }>()
const { t } = useI18n()
const resolved = computed(() => props.preview ?? resolveVariant(props.variant))
const tokens = computed(() => resolved.value.tokens)
const names = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'] as const
const style = computed(() => ({
  '--pv-bg': tokens.value['terminal.background'],
  '--pv-fg': tokens.value['terminal.foreground'],
  '--pv-muted': tokens.value['text.secondary'],
  '--pv-line': tokens.value['border.default'],
}))
const banks = computed(() => [0, 8].map(start => ({
  start,
  colors: names.map((name, offset) => {
    const index = start + offset
    const hex = tokens.value[`terminal.ansi.${index}`]!
    const background = tokens.value['terminal.background']!
    const strong = tokens.value['text.strong']!
    const inverse = tokens.value['text.inverse']!
    return {
      index,
      name,
      hex,
      foregroundCode: (start === 0 ? 30 : 90) + offset,
      backgroundCode: (start === 0 ? 40 : 100) + offset,
      label: contrast(strong, hex) >= contrast(inverse, hex) ? strong : inverse,
      wcag: contrast(hex, background).toFixed(2),
      apca: apcaContrast(hex, background),
    }
  }),
})))
</script>

<template>
  <section
    id="terminal"
    class="lig-parsed lig-ansi"
    :style="style"
    :aria-label="t('palette.terminal.title')"
  >
    <header class="lig-parsed-header">
      <span>terminal · ANSI 16</span>
      <span>{{ t('palette.terminal.title') }}</span>
    </header>
    <p class="lig-parsed-hint">
      {{ t('palette.terminal.note') }}
    </p>
    <div
      v-for="bank in banks"
      :key="bank.start"
      class="lig-ansi-bank"
    >
      <h3>{{ t(bank.start === 0 ? 'palette.terminal.normal' : 'palette.terminal.bright') }}</h3>
      <div class="lig-ansi-colors">
        <div
          v-for="color in bank.colors"
          :key="color.index"
          class="lig-ansi-color"
        >
          <span class="lig-ansi-name">{{ color.index }} · {{ color.name }}</span>
          <code
            class="lig-ansi-foreground"
            :style="{ color: color.hex }"
          >Aa 0123</code>
          <code
            class="lig-ansi-background"
            :style="{ color: color.label, background: color.hex }"
          >Aa 0123</code>
          <span>{{ color.hex }}</span>
          <span>SGR {{ color.foregroundCode }} / {{ color.backgroundCode }}</span>
          <span>WCAG 2.2 {{ color.wcag }}:1</span>
          <span>APCA {{ color.apca > 0 ? '+' : '' }}{{ color.apca.toFixed(0) }} Lc</span>
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
<span :style="{ color: tokens['terminal.ansi.3'] }">warning</span> yellow foreground · ANSI 3
<span :style="{ color: tokens['terminal.ansi.11'] }">warning</span> emphasized yellow · ANSI 11
<span :style="{ color: tokens['terminal.ansi.1'] }">error</span>   example diagnostic
<span :style="{ color: tokens['terminal.ansi.5'] }">branch</span>  preview/hue-calibration
<span :style="{ color: tokens['terminal.ansi.8'] }">quiet</span>   dimmed terminal output
<span :style="{ color: tokens['terminal.ansi.15'] }">ready</span>   compare all four themes</code></pre>
    </div>
    <p class="lig-ansi-fill-example">
      <code :style="{ background: tokens['accent.yellow.fill'], color: tokens['text.on.yellow'] }">WARN</code>
      {{ t('palette.terminal.fill') }}
    </p>
  </section>
</template>

<style scoped>
.lig-ansi-bank + .lig-ansi-bank {
  margin-top: 24px;
}

.lig-ansi-bank h3 {
  margin: 0 0 12px;
  font: 12px/1.5 var(--font-meta);
}

.lig-ansi-colors {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 16px 12px;
}

.lig-ansi-color {
  display: grid;
  min-width: 0;
  gap: 4px;
  font: 10px/1.5 var(--font-meta);
  color: var(--pv-muted);
}

.lig-ansi-name {
  color: var(--pv-fg);
}

.lig-ansi-foreground,
.lig-ansi-background {
  padding: 6px 4px;
  font: 13px/1.5 var(--font-meta);
}

.lig-ansi-background {
  border: 1px solid var(--pv-line);
}

.lig-ansi-output {
  margin-top: 24px;
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
  margin: 20px 0 0;
  font: 11px/1.7 var(--font-meta);
}

.lig-ansi-fill-example code {
  padding: 2px 8px;
}

@media (max-width: 1000px) {
  .lig-ansi-colors {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .lig-ansi-colors {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
