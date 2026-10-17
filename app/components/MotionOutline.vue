<script setup lang="ts">
// Coordinates and dimensions are in the parent SVG's coordinate system.
defineProps<{
  x: number
  y: number
  width: number
  height: number
  radius?: number
  color?: string
  contrastColor?: string
  strokeWidth?: number
  nudgeX?: number
  nudgeY?: number
}>()
</script>

<template>
  <g
    class="motion-outline"
    :style="{ transform: `translate(${x}px, ${y}px)`, color }"
    aria-hidden="true"
  >
    <g :style="{ transform: `translate(${nudgeX ?? 0}px, ${nudgeY ?? 0}px)` }">
      <rect
        v-if="contrastColor"
        :stroke-width="(strokeWidth ?? 1) + 2"
        :style="{ width: `${width}px`, height: `${height}px`, rx: `${radius ?? 0}px`, stroke: contrastColor }"
      />
      <rect
        :stroke-width="strokeWidth ?? 1"
        :style="{ width: `${width}px`, height: `${height}px`, rx: `${radius ?? 0}px` }"
      />
    </g>
  </g>
</template>

<style scoped>
.motion-outline {
  pointer-events: none;
  transition:
    transform 260ms var(--ease),
    color 260ms var(--ease);
}

.motion-outline rect {
  fill: none;
  stroke: currentColor;
  transition:
    width 260ms var(--ease),
    height 260ms var(--ease),
    rx 260ms var(--ease),
    stroke 260ms var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  .motion-outline,
  .motion-outline rect {
    transition: none;
  }
}
</style>
