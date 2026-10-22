<script setup lang="ts">
import type { Component } from 'vue'
import { NuxtLink } from '#components'

withDefaults(defineProps<{ as?: Component | 'a' | 'button' }>(), { as: () => NuxtLink })
</script>

<template>
  <component
    :is="as"
    class="l-cta"
  >
    <slot />
  </component>
</template>

<style scoped>
.l-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  white-space: nowrap;
}

.l-cta::after {
  content: '→';
  transition: translate 0.4s var(--ease);
}

.l-cta:hover::after {
  translate: 4px 0;
}

.l-cta::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: currentColor;
  transform-origin: right;
  transform: scaleX(0.999);
  transition: transform 0.6s var(--ease);
}

.l-cta:hover::before {
  transform-origin: left;
  animation: l-underline 0.8s var(--ease);
}

@keyframes l-underline {
  0% {
    transform: scaleX(1);
    transform-origin: right;
  }

  45% {
    transform: scaleX(0);
    transform-origin: right;
  }

  46% {
    transform: scaleX(0);
    transform-origin: left;
  }

  100% {
    transform: scaleX(1);
    transform-origin: left;
  }
}

button.l-cta {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 15px;
  cursor: pointer;
}
</style>
