<script setup lang="ts">
defineProps<{
  length: number
  wordClass?: string
  wordLabel?: string
}>()
</script>

<template>
  <section class="l-hero">
    <h1
      :class="['l-word', wordClass]"
      :style="{ '--len': length }"
      :aria-label="wordLabel"
    >
      <slot name="word" />
    </h1>
    <div
      class="l-hero-foot"
      data-anchor="rule"
    >
      <p
        class="l-tagline"
        data-anchor="tagline"
        lang="en"
      >
        <slot name="tagline" />
      </p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* Hero */
.l-hero {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 100svh;
  padding: 0 var(--pad) clamp(32px, 6svh, 64px);
}

.l-word {
  --word-fit: calc(108vw / var(--len));
  /* Long names shrink so the word always fits the width */
  --word-px: clamp(88px, min(27vw, var(--word-fit)), 440px);
  margin: 0 0 0 -0.05em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(var(--word-px) * var(--display-scale));
  line-height: 0.78;
  letter-spacing: -0.045em;
}

.l-hero-foot :deep(.l-lede) {
  grid-column: calc(var(--span-margin) + 2) / span 5;
  margin: 0;
}

.l-hero-foot :deep(.l-cta) {
  grid-column: 11 / span 2;
  justify-self: end;
}

@media (max-width: 860px) {
  /* Preserve mixed selector groups. Slot content needs deep selectors. */
  .l-hero-foot,
  .l-page-foot,
  .l-section,
  .l-price {
    grid-template-columns: minmax(0, 1fr);
  }

  .l-tagline,
  .l-release,
  .l-hero-foot :deep(.l-lede),
  .l-hero-foot :deep(.l-cta),
  .l-page-foot > *,
  .l-label,
  .l-body,
  .l-amount,
  .l-price > div {
    grid-column: 1 / -1;
  }

  .l-tagline,
  .l-hero-foot :deep(.l-cta),
  .l-page-foot .l-meta,
  .l-label,
  .l-amount {
    justify-self: start;
  }
}

.lig-hero-title {
  display: flex;
  align-items: baseline;
  gap: 0.08em;
  margin-left: 0;
}

/* The tagline is the whole foot now. */
.lig-hero .l-tagline {
  grid-column: 1 / -1;
}

@media (max-width: 860px) {
  .lig-hero .l-hero-foot {
    width: auto;
    margin-inline: max(0px, calc(var(--edge) - var(--pad)));
  }
}

/* Sections are numbered in the margin like the leaves of a book. */
.lig-hero {
  counter-reset: lig-leaf;
}
</style>

<style>
/* These base rules deliberately keep their original specificity.
   Global has-hand / has-stroke rules and the shared palette measure
   must win regardless of when an asynchronously loaded component's CSS arrives. */
.l-hero-foot {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--gap);
  align-items: end;
  margin-top: clamp(28px, 5svh, 56px);
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.l-tagline {
  grid-column: span var(--span-margin);
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(24px * var(--title-scale));
  line-height: 1.1;
}
</style>
