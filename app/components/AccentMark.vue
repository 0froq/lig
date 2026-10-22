<script setup lang="ts">
withDefaults(defineProps<{ anchor?: 'mark' | 'final-mark' }>(), { anchor: 'mark' })
</script>

<template>
  <span
    class="l-mark"
    :data-anchor="anchor"
    ><slot
  /></span>
</template>

<style>
/* Stop.ts also renders this mark outside HeroFrame.
   Keep the base unscoped so global .has-bloom .l-mark always wins,
   including on routes that never load a hero. */
.l-mark {
  display: inline-block;
  color: var(--accent);
}
</style>
