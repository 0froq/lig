<script setup lang="ts">
import { CodeBlock, CopyButton } from '@froq/ui'
import { LIGHTWEIGHT_PORTS } from '../../../ports/catalog'

const { t } = useI18n()
const { variant } = useLigVariant()
const origin = ref('https://codex-lig-core-tokens.lig-6ki.pages.dev')

onMounted(() => {
  origin.value = window.location.origin
})

const instruction = computed(() =>
  t('palette.downloads.agentInstruction', {
    page: `${origin.value}/?variant=${variant.value}#downloads`,
    manifest: `${origin.value}/ports/manifest.json`,
    notes: `${origin.value}/ports/README.md`,
    variant: variant.value,
    tools: ['Neovim', 'VS Code', 'Zed', ...LIGHTWEIGHT_PORTS.map(port => port.title)].join(', '),
  }),
)
</script>

<template>
  <section
    class="lig-agent-setup lig-ui ui"
    :aria-label="t('palette.downloads.agentTitle')"
  >
    <h3>{{ t('palette.downloads.agentTitle') }}</h3>
    <CodeBlock
      collapsible
      class="lig-agent-instruction"
      :label="t('palette.downloads.agentRead')"
      :code="instruction"
    >
      <template #action>
        <CopyButton
          :text="instruction"
          :label="t('palette.downloads.agentCopy')"
          :copied-label="t('install.copied')"
          :error-label="t('palette.downloads.agentCopyError')"
          :pending-label="t('palette.downloads.agentCopyPending')"
        />
      </template>
    </CodeBlock>
  </section>
</template>

<style scoped>
.lig-agent-setup {
  margin-top: 40px;
  padding-block: 24px 0;
  border-top: 1px solid var(--line);
}

.lig-agent-instruction {
  margin-top: 16px;
}

.lig-agent-instruction :deep(.ui-code-block-pre) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
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
</style>
