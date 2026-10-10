<script setup lang="ts">
import type { LigVariant } from '#palette/nvim-build'
import type { SyntaxDocument } from '../../../syntax/types'
import examples from '../../../syntax/generated/examples.json'

defineProps<{ variant: LigVariant }>()
const documents = examples.documents as SyntaxDocument[]
</script>

<template>
  <div class="lig-parsed-stage">
    <PaletteParsedCode
      v-for="document in documents"
      :key="document.language"
      :document="document"
      :variant="variant"
      :neovim="examples.neovim"
    />
    <PaletteTerminal :variant="variant" />
    <slot name="foot" />
  </div>
</template>
