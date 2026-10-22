<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <NuxtLink
    class="l-entry"
    :to="to"
  >
    <Kicker as="span"><slot name="kicker" /></Kicker>
    <EntryTitle as="span"><slot /></EntryTitle>
  </NuxtLink>
</template>

<style scoped>
/* Keep the shared entry base before the existing pager override below. */
.l-entry {
  display: grid;
  gap: 14px;
}

.l-entry :deep(.l-copy) {
  max-width: 34rem;
}

.l-entry:hover :deep(.l-more)::after {
  translate: 4px 0;
}

a.l-entry :deep(.l-entry-title) {
  transition: color 0.3s;
}

a.l-entry:hover :deep(.l-entry-title) {
  color: var(--muted);
}

.l-entry {
  grid-column: span var(--span-body);
  display: grid;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.l-entry-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(32px, 3.6vw, 56px) * var(--title-scale));
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-wrap: balance;
  transition: color 0.3s;
}

:lang(zh) .l-entry-title {
  letter-spacing: 0;
}

.l-entry:hover .l-entry-title {
  color: var(--muted);
}

@media (max-width: 860px) {
  .l-label,
  .l-entry {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>
