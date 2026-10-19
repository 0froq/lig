<script setup lang="ts">
import { Collapsible } from '@froq/ui'

defineProps<{
  label: string
  rule?: 'dash'
}>()
const open = defineModel<boolean>({ default: false })
</script>

<template>
  <Collapsible
    v-model="open"
    :label="label"
    class="lig-more lig-animated-details lig-ui ui"
    :class="{ 'is-open': open, 'is-rule-dash': rule === 'dash' }"
  >
    <div class="lig-details-clip">
      <div class="lig-details-body">
        <slot />
      </div>
    </div>
  </Collapsible>
</template>

<style>
@property --rule-end {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}
</style>

<style scoped>
.lig-animated-details :deep(.ui-collapsible-trigger) {
  justify-content: flex-start;
  gap: 16px;
  padding-block: 22px 18px;
  border-bottom: 0;
  color: var(--muted);
  font: 15px/1.3 var(--font-text);
  letter-spacing: 0;
  text-transform: none;
  transition: color 0.4s var(--ease);
}

.lig-animated-details :deep(.ui-collapsible-trigger)::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  background-repeat: no-repeat;
  background-position: left center;
  transition: background-size 0.55s var(--ease);
}

.lig-animated-details :deep(.ui-collapsible-trigger:hover:not(:disabled)),
.lig-animated-details.is-open :deep(.ui-collapsible-trigger) {
  color: var(--fg);
}

/* Full-width dashes. Hover lengthens them; open and focus close them into one accent line. */
.lig-animated-details.is-rule-dash :deep(.ui-collapsible-trigger)::after {
  background-image: linear-gradient(90deg, var(--line) 0 3px, transparent 3px 8px);
  background-size: 8px 1px;
  background-repeat: repeat-x;
}

.lig-animated-details.is-rule-dash :deep(.ui-collapsible-trigger:hover)::after {
  background-image: linear-gradient(90deg, var(--fg) 0 6px, transparent 6px 9px);
  background-size: 9px 1px;
}

.lig-animated-details.is-rule-dash.is-open :deep(.ui-collapsible-trigger)::after,
.lig-animated-details.is-rule-dash :deep(.ui-collapsible-trigger:focus-visible)::after {
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.lig-animated-details:not(.is-rule-dash) :deep(.ui-collapsible-trigger)::after {
  --rule-end: transparent;
  background-image:
    linear-gradient(90deg, var(--accent), var(--rule-end)),
    linear-gradient(90deg, var(--line) 0%, transparent 100%);
  background-size:
    0% 1px,
    100% 1px;
  background-repeat: no-repeat;
  background-position: left center;
  transition:
    background-size 0.55s var(--ease),
    --rule-end 0.55s var(--ease);
}

.lig-animated-details:not(.is-rule-dash) :deep(.ui-collapsible-trigger:hover)::after {
  background-size:
    100% 1px,
    100% 1px;
}

.lig-animated-details:not(.is-rule-dash).is-open :deep(.ui-collapsible-trigger)::after,
.lig-animated-details:not(.is-rule-dash) :deep(.ui-collapsible-trigger:focus-visible)::after {
  --rule-end: var(--accent);
  background-size:
    100% 1px,
    100% 1px;
}

.lig-animated-details :deep(.ui-collapsible-trigger:focus-visible) {
  outline: none;
}

.lig-animated-details :deep(.ui-collapsible-chevron) {
  width: 7px;
  height: 7px;
  margin-inline-end: 2px;
  opacity: 0.55;
  transition:
    transform 0.45s var(--ease),
    opacity 0.45s var(--ease);
}

.lig-animated-details :deep(.ui-collapsible-trigger:hover .ui-collapsible-chevron),
.lig-animated-details.is-open :deep(.ui-collapsible-chevron) {
  opacity: 1;
}

/* Keep the panel measurable for the closing transition. Collapsible still
   controls inert/aria-hidden and returns focus to its trigger before closing. */
.lig-animated-details :deep(.ui-collapsible-panel),
.lig-animated-details :deep(.ui-collapsible-panel[hidden]) {
  display: grid;
  grid-template-rows: 0fr;
  /*padding: 0;*/
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
  .lig-animated-details :deep(.ui-collapsible-trigger)::after,
  .lig-animated-details :deep(.ui-collapsible-panel),
  .lig-animated-details :deep(.ui-collapsible-panel[hidden]) {
    transition: none;
  }
}
</style>
