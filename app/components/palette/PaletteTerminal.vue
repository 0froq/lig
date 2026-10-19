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
  '--pv-prompt': tokens.value['terminal.ansi.2'],
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
    <p class="lig-ansi-command">
      <span aria-hidden="true">></span>
      <code>lig check <span>--colors</span></code>
    </p>
    <div
      class="lig-ansi-output"
      role="region"
      tabindex="0"
      :aria-label="t('palette.terminal.output')"
    >
      <div
        v-for="bank in banks"
        :key="bank.start"
        class="lig-ansi-bank"
      >
        <span class="lig-ansi-bank-name">{{ bank.start === 0 ? 'Normal' : 'Bright' }}</span>
        <div class="lig-ansi-colors">
          <div
            v-for="color in bank.colors"
            :key="color.index"
            class="lig-ansi-color"
            :aria-label="`${color.index} ${color.name}`"
          >
            <code :style="{ color: color.hex }">{{ color.name }}</code>
            <code
              class="lig-ansi-background"
              :style="{ background: color.hex, color: color.label }"
            >{{ color.name }}</code>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lig-ansi {
  font: 12px/1.6 var(--font-meta);
}

.lig-ansi code {
  font: inherit;
}

.lig-ansi .lig-parsed-header {
  align-items: baseline;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--pv-line);
  color: var(--pv-muted);
  font: inherit;
}

.lig-ansi .lig-parsed-header a {
  font-size: 11px;
  transition: color 180ms var(--ease);
}

.lig-ansi .lig-parsed-header a:hover {
  color: var(--pv-fg);
}

.lig-ansi-command {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 20px 0 12px;
}

.lig-ansi-command > span {
  color: var(--pv-prompt);
}

.lig-ansi-command code span {
  color: var(--pv-muted);
}

.lig-ansi-output {
  display: grid;
  min-width: 0;
  /* Two banks sit side by side until the card is narrower than both. */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(26ch + 36px)), 1fr));
  gap: 32px clamp(32px, 6vw, 80px);
}

.lig-ansi-bank {
  display: grid;
  min-width: 0;
  align-content: start;
  gap: 8px;
}

.lig-ansi-bank-name {
  color: var(--pv-muted);
  font-size: 11px;
}

.lig-ansi-colors {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.lig-ansi-color {
  display: grid;
  /* Name and sample stay on one row until the row is narrower than both. */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(14ch + 12px)), 1fr));
  align-items: baseline;
  gap: 4px 12px;
  min-width: 0;
}

.lig-ansi-color code {
  padding: 2px 6px;
  white-space: nowrap;
}

.lig-ansi-background {
  text-align: center;
  box-shadow: inset 0 0 0 1px var(--pv-line);
}

.lig-ansi-output:focus-visible {
  outline: 1px solid var(--pv-fg);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .lig-ansi .lig-parsed-header a {
    transition: none;
  }
}
</style>
