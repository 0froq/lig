<script setup lang="ts">
const { t } = useI18n()

const pageTitle = () => t('palette.meta.title')

useHead({ title: pageTitle() })
defineOgImage('Paper', {
  title: pageTitle,
  words: 0,
}, {
  alt: pageTitle,
})
useShareMeta({
  title: pageTitle,
  description: () => t('palette.meta.description'),
  image: false,
})
</script>

<template>
  <Sheet :line="true">
    <PaletteShowcase />
  </Sheet>
</template>
