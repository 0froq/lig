<script setup lang="ts">
import { Collapsible } from '@froq/ui'

defineProps<{ label: string }>()
const open = defineModel<boolean>({ default: false })
</script>

<template>
  <Collapsible
    v-model="open"
    :label="label"
    class="lig-more lig-animated-details lig-ui ui"
    :class="{ 'is-open': open }"
  >
    <div class="lig-details-clip">
      <div class="lig-details-body">
        <slot />
      </div>
    </div>
  </Collapsible>
</template>

<style scoped>
.lig-animated-details :deep(.ui-collapsible-trigger) {
  color: var(--muted);
  font: 12px/1.5 var(--font-meta);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Keep the panel measurable for the closing transition. Collapsible still
   controls inert/aria-hidden and returns focus to its trigger before closing. */
.lig-animated-details :deep(.ui-collapsible-panel),
.lig-animated-details :deep(.ui-collapsible-panel[hidden]) {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0;
  opacity: 0;
  transition:
    grid-template-rows 320ms var(--ease),
    opacity 180ms var(--ease);
}

.lig-animated-details.is-open :deep(.ui-collapsible-panel) {
  grid-template-rows: 1fr;
  opacity: 1;
}

.lig-details-clip {
  min-height: 0;
  overflow: hidden;
}

.lig-details-body {
  padding-block: 16px 8px;
}

@media (prefers-reduced-motion: reduce) {
  .lig-animated-details :deep(.ui-collapsible-panel),
  .lig-animated-details :deep(.ui-collapsible-panel[hidden]) {
    transition: none;
  }
}
</style>
