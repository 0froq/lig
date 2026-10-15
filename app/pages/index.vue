<script setup lang="ts">
const { t } = useI18n()
const title = 'LiG — Less is Great.'

const pageTitle = () => title

useHead({ title, titleTemplate: '%s' })
defineOgImage('Paper', {
  title: pageTitle,
  description: () => t('palette.meta.description'),
  words: 0,
}, {
  alt: pageTitle,
})
useShareMeta({
  title: pageTitle,
  bareTitle: true,
  description: () => t('palette.meta.description'),
  image: false,
})
</script>

<template>
  <Sheet :line="true">
    <PaletteShowcase />
  </Sheet>
</template>
