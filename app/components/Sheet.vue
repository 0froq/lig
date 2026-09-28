<script setup lang="ts">
const props = defineProps<{ line?: boolean }>()

const root = ref<HTMLElement>()
useSignature(root, props)
</script>

<template>
  <div
    ref="root"
    class="l-sheet"
  >
    <slot />
  </div>
</template>
