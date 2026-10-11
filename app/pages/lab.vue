<script setup lang="ts">
const route = useRoute()
const link = useKitLink()
await navigateTo({ path: link('/'), query: route.query, hash: '#syntax' }, { replace: true })
</script>

<template>
  <span />
</template>
