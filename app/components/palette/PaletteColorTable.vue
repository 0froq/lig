<script setup lang="ts">
import type { CSSProperties } from 'vue'

defineProps<{
  label: string
  tableStyle?: CSSProperties
}>()
</script>

<template>
  <div
    class="lig-color-table-scroll"
    role="region"
    tabindex="0"
    :aria-label="label"
  >
    <table
      class="lig-color-table"
      v-bind="tableStyle ? { style: tableStyle } : {}"
    >
      <thead>
        <tr>
          <slot name="columns" />
        </tr>
      </thead>
      <slot />
    </table>
    <slot name="after" />
  </div>
</template>

<style scoped>
.lig-color-table-scroll {
  overflow-x: auto;
}

.lig-color-table-scroll:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: -1px;
}

.lig-color-table {
  --pin-1: 4ch;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  white-space: nowrap;
  font: 11px/1.6 var(--font-meta);
  font-variant-numeric: tabular-nums;
  text-align: left;
}

/* Cells, pinned columns and copy controls are supplied by the caller's slots. */
.lig-color-table :deep(th),
.lig-color-table :deep(td) {
  padding: 6px 16px 6px 0;
  font-weight: 400;
}

.lig-color-table :deep(th[rowspan]) {
  vertical-align: top;
}

.lig-color-table thead {
  color: var(--muted);
}

.lig-color-table :deep(tbody tr:first-child > *) {
  border-top: 1px solid var(--line);
}

/* The first columns stay put while the rest scrolls. The last pinned one fades into the data
   once the table has moved. Separate borders keep the rules visible under pinned cells. */
:deep(.lig-pin-1),
:deep(.lig-pin-2) {
  position: sticky;
  z-index: 1;
  background: var(--bg);
}

:deep(.lig-pin-1) {
  left: 0;
  min-width: var(--pin-1);
}

:deep(.lig-pin-2) {
  left: calc(var(--pin-1) + 16px);
}

:deep(.lig-pin-end)::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 100%;
  width: 20px;
  background: linear-gradient(to right, var(--bg), transparent);
  pointer-events: none;
}

@supports (animation-timeline: scroll()) {
  :deep(.lig-pin-end)::after {
    opacity: 0;
    animation: lig-pin-fade linear both;
    animation-timeline: scroll(nearest inline);
    animation-range: 0 24px;
  }
}

/* At rest the pinned columns are clear so the paper shows through. They fill in as the table scrolls. */
@supports (animation-timeline: scroll()) {
  :deep(.lig-pin-1),
  :deep(.lig-pin-2) {
    background-color: transparent;
    animation: lig-pin-fill linear both;
    animation-timeline: scroll(nearest inline);
    animation-range: 0 24px;
  }
}

@keyframes lig-pin-fill {
  to {
    background-color: var(--bg);
  }
}

@keyframes lig-pin-fade {
  to {
    opacity: 1;
  }
}

:deep(.lig-color-key) {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  vertical-align: -2px;
  box-shadow: inset 0 0 0 1px var(--line);
}

:deep(.lig-color-copy) {
  min-width: 8ch;
  padding: 0;
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  color: var(--fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

:deep(.lig-color-copy):hover,
:deep(.lig-color-copy):focus-visible {
  border-bottom-color: var(--copy-color);
}

:deep(.lig-color-copy.is-copied) {
  color: var(--copy-color);
}

:deep(.lig-color-announcement) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
