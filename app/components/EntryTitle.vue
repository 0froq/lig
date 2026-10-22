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
/* Callers still own scoped margin overrides, notably changelog's 14px top margin.
   Keep this base weaker regardless of lazy chunk order. */
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

<style scoped>
:lang(zh) .l-entry-title {
  letter-spacing: 0;
}
</style>
