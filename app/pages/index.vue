<script setup lang="ts">
const { t } = useI18n()

useHead({ title: t('palette.meta.title') })
useShareMeta({
  title: () => t('palette.meta.title'),
  description: () => t('palette.meta.description'),
})
</script>

<template>
  <Sheet :line="true">
    <PaletteShowcase />
  </Sheet>
</template>
