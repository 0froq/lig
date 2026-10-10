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
  tools: ['Neovim', 'VS Code', ...LIGHTWEIGHT_PORTS.map(port => port.title)].join(', '),
}))
</script>

<template>
  <section
    class="lig-agent-setup lig-ui ui"
    :aria-label="t('palette.downloads.agentTitle')"
  >
    <header>
      <h3>{{ t('palette.downloads.agentTitle') }}</h3>
      <CopyButton
        :text="instruction"
        :label="t('palette.downloads.agentCopy')"
        :copied-label="t('install.copied')"
        :error-label="t('palette.downloads.agentCopyError')"
        :pending-label="t('palette.downloads.agentCopyPending')"
      />
    </header>
    <p>{{ instruction }}</p>
  </section>
</template>

<style scoped>
.lig-agent-setup {
  margin-top: 28px;
  padding-block: 20px;
  border-block: 1px solid var(--line);
}

.lig-agent-setup header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px 20px;
}

.lig-agent-setup h3 {
  margin: 0;
  color: var(--fg);
  font: 12px/1.5 var(--font-meta);
}

.lig-agent-setup p {
  max-width: 64ch;
  margin: 16px 0 0;
  color: var(--muted);
  font: 12px/1.8 var(--font-meta);
  overflow-wrap: anywhere;
}
</style>
