<script setup lang="ts">
// Head of an inner page: a large title whose stop blooms, over a ruled line the pen draws
const props = withDefaults(
  defineProps<{
    kicker?: string | null
    kickerName?: string
    title?: string | null
    titleName?: string
    lede?: string | null
    ledeName?: string
    long?: boolean
    /** Section heads own their inset, typography and metadata layout. */
    variant?: 'poster' | 'section'
    /** @deprecated Use variant="section" */
    compact?: boolean
    /** Render the trailing accent stop after the title. */
    stop?: boolean
  }>(),
  {
    kicker: null,
    kickerName: 'kicker',
    title: null,
    titleName: 'title',
    lede: null,
    ledeName: 'lede',
    variant: 'poster',
    compact: false,
    stop: true,
  },
)

const section = computed(() => props.variant === 'section' || props.compact)
</script>

<template>
  <section
    class="l-page-head"
    :class="{ 'is-section': section }"
  >
    <h1
      class="l-page-title"
      :class="{ 'is-long': long }"
    >
      <Stop
        v-if="stop"
        :text="title"
        :name="titleName"
        fallback="."
        :size="long ? 12 : 5"
      />
      <Fill
        v-else
        :value="title"
        :name="titleName"
        :size="long ? 12 : 5"
      />
    </h1>
    <div
      class="l-page-foot"
      data-anchor="rule"
    >
      <Kicker>
        <slot name="kicker">
          <Fill
            :value="kicker"
            :name="kickerName"
            :size="8"
          />
        </slot>
      </Kicker>
      <p
        v-if="lede != null"
        class="l-lede"
      >
        <Fill
          :value="lede"
          :name="ledeName"
          :size="28"
        />
      </p>
      <p
        v-if="$slots.meta"
        class="l-meta"
      >
        <slot name="meta" />
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Inner pages */
.l-page-head {
  display: grid;
  align-content: end;
  min-height: 78svh;
  padding: 0 var(--pad) clamp(32px, 6svh, 64px);
}

.l-page-head.is-section {
  min-height: 0;
  padding: 112px 0 28px;
}

.is-section .l-page-title.is-long {
  font-size: clamp(44px, 6vw, 80px);
}

.is-section .l-page-foot {
  grid-template-columns: minmax(0, 1fr) auto;
}

.is-section .l-page-foot > * {
  grid-column: auto;
}

/* After the equally specific section reset so the kicker keeps its original span. */
.l-page-foot .l-kicker {
  grid-column: span var(--span-margin);
}

.l-page-title {
  margin: 0 0 0 -0.04em;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(96px, 17vw, 280px) * var(--display-scale));
  line-height: 0.82;
  letter-spacing: -0.04em;
}

/* The original long-title base wins this equal-specificity letter-spacing tie.
   Keep Chinese tracking before .is-long, while its line-height override stays after. */
:lang(zh) .l-page-title {
  letter-spacing: 0;
}

.l-page-title.is-long {
  max-width: 14ch;
  margin-left: 0;
  font-size: calc(clamp(56px, 8vw, 128px) * var(--display-scale));
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.l-page-foot {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--gap);
  align-items: baseline;
  margin-top: clamp(28px, 5svh, 56px);
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.l-page-foot .l-lede {
  grid-column: calc(var(--span-margin) + 1) / span 6;
  margin: 0;
}

.l-page-foot .l-meta {
  grid-column: 10 / span 3;
  justify-self: end;
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.has-stroke [data-anchor='rule'] {
  border-top-color: transparent;
}

/* Narrow handwriting stops at the tagline, so the foot keeps its own rule. */
@media (max-width: 860px) {
  .has-hand.has-stroke [data-anchor='rule'] {
    border-top-color: var(--line);
  }
}

:lang(zh) .l-page-title.is-long {
  line-height: 1.15;
}

.l-lede {
  max-width: 30rem;
  color: var(--muted);
}

@media (max-width: 860px) {
  /* The more specific section, kicker and lede rules still beat these resets. */
  .l-page-foot {
    grid-template-columns: minmax(0, 1fr);
  }

  .l-page-foot > * {
    grid-column: 1 / -1;
  }

  .l-page-foot .l-meta {
    justify-self: start;
  }
}
</style>
