<script setup lang="ts" generic="TRow extends object, TColumn extends object">
withDefaults(defineProps<{
  label: string
  rows: readonly TRow[]
  rowKey: (row: TRow) => string | number
  columns: readonly TColumn[]
  columnKey: (column: TColumn) => string | number
  current?: string | number
  rowHeight?: string
  columnWidth?: string
}>(), {
  rowHeight: '48px',
  columnWidth: '7rem',
})
defineSlots<{
  header?: () => unknown
  'row-header'?: (scope: { row: TRow }) => unknown
  cell?: (scope: { row: TRow, column: TColumn }) => unknown
}>()
</script>

<template>
  <div
    class="ui-grid-table"
    role="group"
    :aria-label="label"
    :style="{
      gridTemplateColumns: `max-content repeat(${Math.max(1, columns.length)}, minmax(${columnWidth}, 1fr))`,
      '--ui-grid-table-row-height': rowHeight,
    }"
  >
    <span
      class="ui-grid-table-corner"
      aria-hidden="true"
    />
    <div class="ui-grid-table-header">
      <slot name="header" />
    </div>
    <template
      v-for="row in rows"
      :key="rowKey(row)"
    >
      <div class="ui-grid-table-row-header">
        <slot
          name="row-header"
          :row="row"
        />
      </div>
      <div
        v-for="column in columns"
        :key="columnKey(column)"
        class="ui-grid-table-cell"
        :class="{ 'is-current': columnKey(column) === current }"
      >
        <slot
          name="cell"
          :row="row"
          :column="column"
        />
      </div>
    </template>
  </div>
</template>
