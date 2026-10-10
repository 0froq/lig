<script setup lang="ts">
defineProps<{
  rows: { role: string, hex: string, baseRef: string }[]
}>()
</script>

<template>
  <div class="lig-roles">
    <PaletteSwatch
      v-for="row in rows"
      :key="row.role"
      :name="row.role"
      :hex="row.hex"
    />
  </div>
</template>
