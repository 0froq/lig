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

<style>
/* useSignature owns this library canvas, prepended without a scope attribute.
   Keep the html state ancestor outside a scoped deep anchor. */
.ui-pen-layer {
  transition: opacity 1.2s var(--ease);
}

.is-installed .ui-pen-layer {
  opacity: 0;
  pointer-events: none;
}
</style>
