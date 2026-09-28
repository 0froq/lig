<script setup lang="ts">
const { t } = useI18n()

useHead({ title: t('palette.meta.title') })
useSeoMeta({ description: () => t('palette.meta.description') })
</script>

<template>
  <Sheet :line="true">
    <PaletteShowcase />
  </Sheet>
</template>
