<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'

const props = defineProps<{ variant: LigVariant }>()
const { t } = useI18n()

const built = computed(() => buildVariant(props.variant) as Record<string, unknown>)

function color(key: string): string {
  const value = built.value[key]
  return typeof value === 'string' ? value : ''
}

function diag(key: 'ok' | 'error'): string {
  const value = built.value.diag
  if (value && typeof value === 'object' && key in value)
    return (value as Record<string, string>)[key] ?? ''
  return color('special')
}

const style = computed(() => ({
  '--pv-bg': color('bg'),
  '--pv-fg': color('fg'),
  '--pv-muted': color('fg_muted'),
  '--pv-type': color('type'),
  '--pv-number': color('number'),
  '--pv-func': color('func'),
  '--pv-special': color('special'),
  '--pv-status': color('bg_statusline'),
  '--pv-rev-bg': color('bg_reversed'),
  '--pv-rev-fg': color('fg_reversed'),
}))
</script>

<template>
  <div
    class="lig-stage-wrap"
    :style="style"
  >
    <div class="lig-stage lig-stage-syntax">
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
    <slot name="foot" />
  </div>
</template>
