<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'

const variant = defineModel<LigVariant>('variant', { required: true })

const { format, copied, copyValue, textFor } = usePaletteClipboard()
const { t } = useI18n()

const built = computed(() => buildVariant(variant.value))

function color(key: string): string {
  const value = (built.value as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

function diag(key: 'ok' | 'error'): string {
  const value = (built.value as Record<string, unknown>).diag
  if (value && typeof value === 'object' && key in value)
    return (value as Record<string, string>)[key] ?? ''
  return color('special')
}

const ink = computed(() => [
  { id: 'text', hex: color('fg'), roles: 'keyword' },
  { id: 'quiet', hex: color('fg_muted'), roles: 'string' },
  { id: 'type', hex: color('type'), roles: 'type' },
  { id: 'value', hex: color('number'), roles: 'number' },
  { id: 'call', hex: color('func'), roles: 'func' },
  { id: 'special', hex: color('special'), roles: 'special' },
])

const stageStyle = computed(() => ({
  '--pv-bg': color('bg'),
  '--pv-fg': color('fg'),
  '--pv-muted': color('fg_muted'),
  '--pv-type': color('type'),
  '--pv-number': color('number'),
  '--pv-func': color('func'),
  '--pv-special': color('special'),
}))
</script>

<template>
  <p class="lig-syntax-lede">
    {{ t('palette.syntax.lede') }}
  </p>
  <div class="lig-inks">
    <button
      v-for="inkItem in ink"
      :key="inkItem.id"
      type="button"
      class="lig-ink"
      :class="{ 'is-copied': copied === inkItem.id }"
      @click="copyValue(textFor(inkItem.hex, format, variant, inkItem.roles), inkItem.id)"
    >
      <span
        class="lig-ink-fill"
        :style="{ background: inkItem.hex }"
      />
      <span class="lig-ink-name">{{ t(`palette.syntax.ink.${inkItem.id}`) }}</span>
      <span class="lig-ink-value">{{ copied === inkItem.id ? t('install.copied') : textFor(inkItem.hex, format, variant, inkItem.roles) }}</span>
    </button>
  </div>
  <p class="lig-aside">
    {{ t('palette.syntax.aside') }}
  </p>
  <PaletteVariantTabs v-model:variant="variant" />
  <div
    class="lig-stage lig-stage-syntax"
    :style="stageStyle"
  >
    <div class="lig-editor">
      <p class="lig-file">
        theme.ts
      </p>
      <pre class="lig-code"><code><span class="kw">export function</span> <span class="fn">loadTheme</span><span class="muted">(</span><span class="ty">name</span><span class="muted">:</span> <span class="ty">string</span><span class="muted">)</span> <span class="muted">{</span>
  <span class="kw">const</span> count <span class="muted">=</span> <span class="num">6</span>
  <span class="cm">// {{ t('palette.syntax.comment') }}</span>
  <span class="kw">return</span> <span class="fn">read</span><span class="muted">(</span><span class="str">"lig"</span><span class="muted">,</span> <span class="sp">"\n"</span><span class="muted">)</span>
<span class="muted">}</span></code></pre>
    </div>
    <div class="lig-terminal">
      <p><span class="fn">lig</span> git status</p>
      <p :style="{ color: diag('ok') }">
        modified: tokens.json
      </p>
      <p :style="{ color: diag('error') }">
        untracked: 占位
      </p>
    </div>
  </div>
</template>
