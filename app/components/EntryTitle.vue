<script setup lang="ts">
withDefaults(defineProps<{ as?: 'h2' | 'span' }>(), { as: 'h2' })
</script>

<template>
  <component
    :is="as"
    class="l-entry-title"
  >
    <slot />
  </component>
</template>

<style>
/* The global Chinese typography group and the callers' scoped variants
   (notably the changelog's margin) must keep winning in either load order. */
.l-entry-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(32px, 3.6vw, 56px) * var(--title-scale));
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
</style>
