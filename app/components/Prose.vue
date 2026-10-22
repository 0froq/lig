<script setup lang="ts">
withDefaults(defineProps<{ as?: 'div' | 'p' | 'dd' }>(), { as: 'div' })
</script>

<template>
  <component
    :is="as"
    class="l-copy"
  >
    <slot />
  </component>
</template>

<style scoped>
.l-copy {
  margin: 0;
  color: var(--muted);
}

.l-copy :deep(p) {
  margin: 0;
}
</style>
