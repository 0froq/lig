<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

provide('changelog-open', props.open)
</script>

<template>
  <slot />
</template>
