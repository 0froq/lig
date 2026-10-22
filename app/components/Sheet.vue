<script setup lang="ts">
const props = defineProps<{ line?: boolean }>()

const root = ref<HTMLElement>()
useSignature(root, props)
useMeasureMotion(root)
</script>

<template>
  <div
    ref="root"
    class="l-sheet"
  >
    <slot />
  </div>
</template>

<style scoped>
.l-sheet {
  position: relative;
  z-index: 0;
}
</style>
