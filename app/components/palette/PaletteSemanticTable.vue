<script setup lang="ts">
defineProps<{
  rows: { role: string; hex: string; baseRef: string }[]
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

<style scoped>
.lig-roles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 32px;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .lig-roles {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
