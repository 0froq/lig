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
    />
    <PaletteTerminal :variant="variant" />
    <slot name="foot" />
  </div>
</template>

<style scoped>
/* Parsed source and its node inspector use the selected token variant. */
.lig-parsed-stage {
  display: grid;
  gap: 32px;
  width: 100%;
  max-width: 48rem;
}

@media (max-width: 600px) {
  .lig-parsed-stage {
    width: 100%;
  }
}
</style>
