<script setup lang="ts">
const { t } = useI18n()
const title = 'LiG — Less is Great.'

useHead({ title, titleTemplate: '%s' })
useShareMeta({
  title,
  bareTitle: true,
  description: () => t('palette.meta.description'),
})
</script>

<template>
  <Sheet :line="true">
    <PaletteShowcase />
  </Sheet>
</template>
