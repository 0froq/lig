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

<style scoped>
/* Stop.ts also renders this mark outside HeroFrame. */
.l-mark {
  display: inline-block;
  color: var(--accent);
}

/* Layers draw the stops, the tagline and the rules themselves */
.has-bloom .l-mark {
  color: transparent;
}

/* Without washes the pen dots the last stop itself */
.has-stroke:not(.has-bloom) [data-anchor='final-mark'] {
  color: transparent;
}
</style>
