<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { ResolvedVariant } from '../../../core'
import type { SyntaxDocument } from '../../../syntax/types'
import examples from '../../../syntax/generated/examples.json'

defineProps<{ variant: LigVariant, preview?: ResolvedVariant }>()
const documents = examples.documents as SyntaxDocument[]
</script>

<template>
  <div class="lig-parsed-stage">
    <template
      v-for="document in documents"
      :key="document.language"
    >
      <PaletteParsedCode
        :document="document"
        :variant="variant"
        :preview="preview"
        :neovim="examples.neovim"
      />
      <PaletteTerminal
        v-if="document === documents[0]"
        :variant="variant"
        :preview="preview"
      />
    </template>
    <slot name="foot" />
  </div>
</template>
