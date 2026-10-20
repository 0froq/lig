<script setup lang="ts">
import { CodeBlock, CopyButton } from '@froq/ui'

// Renders each fenced markdown block with the shared library CodeBlock, so docs and palette use one frame.
// Nuxt Content passes the source and fence metadata to <pre>. Declaring them keeps them off the DOM.
defineOptions({ inheritAttrs: false })
defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="lig-ui ui lig-prose-code">
    <CodeBlock :label="filename">
      <pre
        v-bind="$attrs"
        class="ui-code-block-pre"
      ><slot /></pre>
      <template #action>
        <CopyButton
          :text="code ?? ''"
          :label="t('codeblock.copy')"
          :copied-label="t('codeblock.copied')"
          :error-label="t('codeblock.copyError')"
        />
      </template>
    </CodeBlock>
  </div>
</template>

<style scoped>
/* Docs rhythm. The frame keeps the library padding and border. */
.lig-prose-code {
  margin: 1.4em 0;
}

/* The site sets code to 0.86em. Source inside a block keeps the block size. */
.lig-prose-code :deep(code) {
  font-size: inherit;
}
</style>
