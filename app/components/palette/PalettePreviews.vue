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
    '--pv-accent': c.accent1 as string,
    '--pv-error': diag?.error ?? (c.special as string),
    '--pv-ok': diag?.ok ?? (c.accent1 as string),
  }
})
</script>

<template>
  <div
    class="lig-stage"
    :style="previewStyle"
  >
    <div class="lig-editor">
      <p class="lig-file"> theme.ts </p>
      <pre
        class="lig-code"
      ><code><span class="kw">export</span> <span class="kw">async function</span> <span class="fn">loadTheme</span><span class="muted">(</span><span class="ty">variant</span><span class="muted">:</span> <span class="ty">LiGVariant</span><span class="muted">)</span> <span class="muted">{</span>
  <span class="kw">const</span> palette <span class="muted">=</span> <span class="kw">await</span> <span class="fn">fetch</span><span class="muted">(</span><span class="str">'/tokens.json'</span><span class="muted">)</span>
  <span class="cm">// 占位</span>
  <span class="kw">return</span> palette<span class="muted">.</span><span class="fn">variants</span><span class="muted">[</span>variant<span class="muted">]</span>
<span class="muted">}</span></code></pre>
      <p class="lig-file"> theme.py </p>
      <pre
        class="lig-code"
      ><code><span class="kw">def</span> <span class="fn">accent</span><span class="muted">(</span><span class="ty">name</span><span class="muted">:</span> <span class="ty">str</span><span class="muted">)</span> <span class="muted">-&gt;</span> <span class="ty">str</span><span class="muted">:</span>
    <span class="str">"""占位"""</span>
    <span class="kw">return</span> <span class="fn">lookup</span><span class="muted">(</span>name<span class="muted">)</span></code></pre>
    </div>
    <div class="lig-side">
      <div class="lig-terminal">
        <p class="lig-file">
          {{ $t('palette.preview.terminal') }}
        </p>
        <p><span class="prompt">lig</span> <span class="cmd">git status</span></p>
        <p class="ok"> modified: tokens.json </p>
        <p class="warn"> untracked: 占位 </p>
        <p><span class="prompt">lig</span> <span class="muted">█</span></p>
      </div>
      <div class="lig-paper-card">
        <p class="lig-file">
          {{ $t('palette.preview.paper') }}
        </p>
        <p class="lig-paper-title"> LiG<span class="dot">.</span> </p>
        <p class="lig-paper-lede">
          {{ $t('palette.preview.paperLede') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lig-editor,
.lig-terminal,
.lig-paper-card {
  min-width: 0;
  padding: 28px;
}

.lig-paper-card {
  border-top: 1px solid color-mix(in srgb, var(--pv-fg) 14%, transparent);
}

/* Pane titles follow the CodeBlock title row: a rule under the label, then the source. */
.lig-file {
  margin: 0 0 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--pv-line);
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pv-muted);
}

.lig-editor .lig-file + .lig-code + .lig-file {
  margin-top: 28px;
}

.lig-code {
  margin: 0;
  overflow-x: auto;
  font-family: var(--font-meta);
  font-size: 13px;
  line-height: 1.65;
}

.lig-code .kw {
  color: var(--pv-keyword);
}

.lig-code .fn {
  color: var(--pv-func);
}

.lig-code .ty {
  color: var(--pv-type);
}

.lig-code .str {
  color: var(--pv-string);
}

.lig-code .cm {
  color: var(--pv-comment);
}

.lig-code .muted {
  color: var(--pv-muted);
}

.lig-code .num {
  color: var(--pv-number);
}

.lig-code .sp {
  color: var(--pv-special);
}

.lig-code .op {
  color: var(--pv-operator);
}

.lig-terminal {
  font-family: var(--font-meta);
  font-size: 13px;
  line-height: 1.6;
}

.lig-terminal p {
  margin: 0;
}

.lig-terminal .prompt {
  color: var(--pv-accent);
}

.lig-terminal .ok {
  color: var(--pv-ok);
}

.lig-terminal .warn {
  color: var(--pv-error);
}

.lig-terminal .muted {
  color: var(--pv-muted);
}

.lig-paper-title {
  margin: 8px 0 0;
  font-family: var(--font-display);
  font-size: 40px;
  line-height: 0.9;
}

.lig-paper-title .dot {
  color: var(--pv-accent);
}

.lig-paper-lede {
  max-width: 22ch;
  margin: 12px 0 0;
  color: var(--pv-muted);
  font-size: 14px;
}
/* Stage and editor bases now share scope with their narrow-screen overrides.
   The removed choice studies and syntax-stage context no longer override them. */
.lig-stage {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  margin-top: 40px;
  background: var(--pv-bg);
  color: var(--pv-fg);
}

.lig-editor {
  border-right: 1px solid color-mix(in srgb, var(--pv-fg) 14%, transparent);
}

@media (max-width: 860px) {
  .lig-stage {
    grid-template-columns: 1fr;
  }

  .lig-editor {
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--pv-fg) 14%, transparent);
  }
}
</style>
