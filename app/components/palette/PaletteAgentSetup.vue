<script setup lang="ts">
import { CopyButton } from '@froq/ui'
import { LIGHTWEIGHT_PORTS } from '../../../ports/catalog'

const { t } = useI18n()
const { variant } = useLigVariant()
const origin = ref('https://codex-lig-core-tokens.lig-6ki.pages.dev')

onMounted(() => {
  origin.value = window.location.origin
})

const instruction = computed(() => t('palette.downloads.agentInstruction', {
  page: `${origin.value}/?variant=${variant.value}#downloads`,
  manifest: `${origin.value}/ports/manifest.json`,
  notes: `${origin.value}/ports/README.md`,
  variant: variant.value,
  tools: ['Neovim', 'VS Code', 'Zed', ...LIGHTWEIGHT_PORTS.map(port => port.title)].join(', '),
}))
</script>

<template>
  <section
    class="lig-agent-setup lig-ui ui"
    :aria-label="t('palette.downloads.agentTitle')"
  >
    <h3>{{ t('palette.downloads.agentTitle') }}</h3>
    <p>{{ t('palette.downloads.agentNote') }}</p>
    <CopyButton
      class="lig-agent-copy"
      :text="instruction"
      :label="t('palette.downloads.agentCopy')"
      :copied-label="t('install.copied')"
      :error-label="t('palette.downloads.agentCopyError')"
      :pending-label="t('palette.downloads.agentCopyPending')"
    />
    <AnimatedDetails
      class="lig-agent-instruction"
      :label="t('palette.downloads.agentRead')"
    >
      <p>{{ instruction }}</p>
    </AnimatedDetails>
    <p class="lig-close">
      {{ t('site.footer') }}
    </p>
  </section>
</template>

<style scoped>
.lig-agent-setup {
  margin-top: 40px;
  padding-block: 24px 0;
  border-top: 1px solid var(--line);
}

.lig-agent-instruction {
  margin-top: 8px;
}

.lig-agent-setup h3 {
  margin: 0;
  color: var(--fg);
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
}

.lig-agent-copy {
  position: relative;
  align-self: flex-start;
  margin-top: 22px;
  padding: 0 0 6px;
  border: 0;
  background: none;
  color: var(--muted);
  font: 13px/1.4 var(--font-meta);
}

.lig-agent-copy::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0.28);
  transform-origin: left center;
  transition: transform 0.55s var(--ease);
}

.lig-agent-copy:hover:not(:disabled),
.lig-agent-copy:focus-visible {
  color: var(--fg);
}

.lig-agent-copy:hover::after,
.lig-agent-copy:focus-visible::after,
.lig-agent-copy:has(:deep(.ui-copy-label:nth-child(3).is-visible))::after {
  transform: scaleX(1);
}

.lig-agent-copy:has(:deep(.ui-copy-label:nth-child(3).is-visible)) {
  color: var(--fg);
}

.lig-agent-copy:has(:deep(.ui-copy-label:nth-child(3).is-visible))::after {
  background: var(--accent);
}

.lig-agent-copy:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

.lig-agent-copy :deep(.ui-copy-label) {
  visibility: visible;
  opacity: 0;
  translate: 0 0.35em;
  transition:
    opacity 0.45s var(--ease),
    translate 0.45s var(--ease);
}

.lig-agent-copy :deep(.ui-copy-label.is-visible) {
  opacity: 1;
  translate: 0 0;
}

.lig-agent-setup > p:not(.lig-close),
.lig-agent-instruction p {
  max-width: 64ch;
  margin: 16px 0 0;
  color: var(--muted);
  font: 12px/1.8 var(--font-meta);
  overflow-wrap: anywhere;
}

.lig-agent-instruction p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lig-agent-copy::after,
  .lig-agent-copy :deep(.ui-copy-label) {
    transition: none;
  }
}

.lig-close {
  margin: clamp(132px, 20svh, 220px) 0 clamp(48px, 8svh, 88px);
  color: var(--fg);
  font-family: var(--font-display);
  font-size: calc(clamp(44px, 5.6vw, 72px) * var(--title-scale));
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.95;
}
</style>
