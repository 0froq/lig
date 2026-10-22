<script setup lang="ts">
defineProps<{ id?: string; entry?: boolean }>()
</script>

<template>
  <section
    :id="id"
    class="l-section"
    :class="{ 'is-entry': entry }"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      <slot name="label" />
    </p>
    <div class="l-body">
      <h2
        v-if="$slots.title"
        class="l-title"
      >
        <slot name="title" />
      </h2>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.l-label {
  grid-column: span var(--span-margin);
  margin: 0;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.l-body {
  min-width: 0;
  grid-column: span var(--span-body);
}

.l-section.is-entry {
  padding-top: calc(var(--section-tight) * var(--section-scale));
}

.l-section.is-entry .l-body {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.l-section.is-entry .l-label {
  padding-top: 18px;
}

.l-section.is-entry :deep(.l-kicker + .l-entry-title) {
  margin-top: 14px;
}

.l-section.is-prose {
  padding-top: calc(var(--section-tight) * var(--section-scale));
}

.l-section.is-pager {
  align-items: baseline;
  padding-top: clamp(96px, 18svh, 200px);
  padding-bottom: clamp(96px, 16svh, 180px);
}

.l-section.is-pager .l-label :deep(a) {
  transition: color 0.3s;
}

.l-section.is-pager .l-label :deep(a:hover) {
  color: var(--fg);
}

.l-section.is-pager :deep(.l-entry) {
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

@media (max-width: 860px) {
  /* Keep mixed global groups intact. Only this component's elements get its scope. */
  .l-hero-foot,
  .l-page-foot,
  .l-section,
  .l-price {
    grid-template-columns: minmax(0, 1fr);
  }

  .l-tagline,
  .l-release,
  .l-hero-foot .l-lede,
  .l-hero-foot .l-cta,
  .l-page-foot > *,
  .l-label,
  .l-body,
  .l-amount,
  .l-price > div {
    grid-column: 1 / -1;
  }

  .l-tagline,
  .l-hero-foot .l-cta,
  .l-page-foot .l-meta,
  .l-label,
  .l-amount {
    justify-self: start;
  }

  .l-section.is-entry .l-label {
    padding-top: 0;
  }
}

/* Plain markdown inside a block */
.l-body > :deep(p:not([class])) {
  max-width: 34rem;
  margin: 24px 0 0;
  color: var(--muted);
}

.l-body > :deep(p:not([class]):first-child) {
  margin-top: 0;
}

.lig-section-quiet {
  padding-top: clamp(64px, 8svh, 96px);
}

/* The last section is the way out: more air above it than between the others. */
#downloads.lig-section-quiet {
  padding-top: clamp(104px, 16svh, 176px);
}
</style>

<style>
/* Unscoped until the cross-component sibling rules are retired.
   Adding a scope attribute would tie .lig-hero ~ .l-section and make padding
   and gap depend on stylesheet loading order.
   l-title also keeps its specificity so the global Chinese typography group wins. */
/* Sections */
.l-section {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--gap);
  padding: calc(var(--section) * var(--section-scale)) var(--pad) 0;
  scroll-margin-top: 64px;
}

.l-title {
  max-width: 18ch;
  text-wrap: balance;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(40px, 5.2vw, 76px) * var(--title-scale));
  line-height: 1;
  letter-spacing: -0.02em;
}
</style>
