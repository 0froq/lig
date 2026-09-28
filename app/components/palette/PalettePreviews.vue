<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import { buildVariant } from '#palette/nvim-build'

const props = defineProps<{ variant: LigVariant }>()

const scheme = computed(() => buildVariant(props.variant) as Record<string, unknown>)

const previewStyle = computed(() => {
  const c = scheme.value
  const diag = c.diag as Record<string, string>
  return {
    '--pv-bg': c.bg as string,
    '--pv-bg-alt': c.bg_alt as string,
    '--pv-fg': c.fg as string,
    '--pv-muted': c.fg_muted as string,
    '--pv-border': c.border as string,
    '--pv-keyword': c.keyword as string,
    '--pv-string': c.string as string,
    '--pv-func': c.func as string,
    '--pv-type': c.type as string,
    '--pv-comment': c.comment as string,
    '--pv-number': c.number as string,
    '--pv-special': c.special as string,
    '--pv-accent': c.accent1 as string,
    '--pv-error': diag?.error ?? (c.special as string),
    '--pv-ok': diag?.ok ?? (c.accent1 as string),
  }
})
</script>

<template>
  <div
    class="lig-previews"
    :style="previewStyle"
  >
    <div class="lig-preview lig-preview-code">
      <p class="lig-preview-label">
        TypeScript
      </p>
      <pre class="lig-code"><code><span class="kw">export</span> <span class="kw">async function</span> <span class="fn">loadTheme</span><span class="muted">(</span><span class="ty">variant</span><span class="muted">:</span> <span class="ty">LiGVariant</span><span class="muted">)</span> <span class="muted">{</span>
  <span class="kw">const</span> palette <span class="muted">=</span> <span class="kw">await</span> <span class="fn">fetch</span><span class="muted">(</span><span class="str">'/tokens.json'</span><span class="muted">)</span>
  <span class="cm">// froQ · 占位：示例文案</span>
  <span class="kw">return</span> palette<span class="muted">.</span><span class="fn">variants</span><span class="muted">[</span><span class="num">variant</span><span class="muted">]</span>
<span class="muted">}</span></code></pre>
    </div>
    <div class="lig-preview lig-preview-code">
      <p class="lig-preview-label">
        Python
      </p>
      <pre class="lig-code"><code><span class="kw">def</span> <span class="fn">accent</span><span class="muted">(</span><span class="ty">name</span><span class="muted">:</span> <span class="ty">str</span><span class="muted">)</span> <span class="muted">-&gt;</span> <span class="ty">str</span><span class="muted">:</span>
    <span class="str">"""占位：演示 syntax 角色"""</span>
    <span class="kw">return</span> <span class="fn">lookup</span><span class="muted">(</span><span class="ty">name</span><span class="muted">)</span>

<span class="kw">if</span> <span class="ty">__name__</span> <span class="muted">==</span> <span class="str">"__main__"</span><span class="muted">:</span>
    <span class="fn">print</span><span class="muted">(</span><span class="fn">accent</span><span class="muted">(</span><span class="str">"green"</span><span class="muted">))</span></code></pre>
    </div>
    <div class="lig-preview lig-preview-terminal">
      <p class="lig-preview-label">
        {{ $t('palette.preview.terminal') }}
      </p>
      <div class="lig-terminal">
        <p><span class="prompt">lig</span> <span class="cmd">git status</span></p>
        <p class="ok">
          modified: palette/generated/tokens.json
        </p>
        <p class="warn">
          untracked: 占位
        </p>
        <p><span class="prompt">lig</span> <span class="muted">█</span></p>
      </div>
    </div>
    <div class="lig-preview lig-preview-paper">
      <p class="lig-preview-label">
        {{ $t('palette.preview.paper') }}
      </p>
      <div class="lig-paper-card">
        <p class="lig-paper-title">
          LiG<span class="dot">.</span>
        </p>
        <p class="lig-paper-lede">
          {{ $t('palette.preview.paperLede') }}
        </p>
        <button
          type="button"
          class="lig-paper-cta"
        >
          {{ $t('palette.preview.paperCta') }}
        </button>
      </div>
    </div>
  </div>
</template>
