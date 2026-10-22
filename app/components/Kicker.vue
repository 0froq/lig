<script setup lang="ts">
withDefaults(defineProps<{ as?: 'p' | 'span' }>(), { as: 'p' })
</script>

<template>
  <component
    :is="as"
    class="l-kicker"
  >
    <slot />
  </component>
</template>

<style scoped>
.l-kicker {
  margin: 0;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-kicker :deep(a) {
  transition: color 0.3s;
}

.l-kicker :deep(a:hover) {
  color: var(--fg);
}
</style>
