<script setup lang="ts">
import type { Fact } from '~/types'

// The pen circles the amount
withDefaults(
  defineProps<{
    price?: string | null
    period?: string
    lede?: string
    facts?: Fact[]
  }>(),
  { price: null, period: undefined, lede: undefined, facts: () => [] },
)
</script>

<template>
  <div class="l-price">
    <p class="l-amount">
      <span data-anchor="price"
        ><Fill
          :value="price"
          name="price.price"
          :size="2" /></span
      ><small v-if="period != null"
        >/<Fill
          :value="period"
          name="price.period"
          :size="6"
      /></small>
    </p>
    <div>
      <Prose
        v-if="lede != null"
        as="p"
      >
        <Fill
          v-if="!isFilled(lede)"
          name="price.lede"
          :size="24"
        />
        <RichText
          v-else
          :text="lede"
        />
      </Prose>
      <dl
        v-if="facts.length"
        class="l-facts"
      >
        <div
          v-for="(fact, index) in facts"
          :key="index"
        >
          <dt>
            <Fill
              :value="fact.label"
              :name="`price.facts.${index}.label`"
              :size="6"
            />
          </dt>
          <dd>
            <Fill
              :value="fact.value"
              :name="`price.facts.${index}.value`"
              :size="8"
            />
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.l-amount small {
  font-size: 0.16em;
  letter-spacing: 0;
  color: var(--muted);
}

.l-facts {
  margin: 28px 0 0;
}

.l-facts div {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid var(--line);
  font-size: 14px;
}

.l-facts dt {
  color: var(--muted);
}

.l-facts dd {
  margin: 0;
}

@media (max-width: 860px) {
  /* Preserve the mixed global groups and their precedence over the base grid. */
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
}
</style>

<style>
/* Keep the global narrow mixed groups able to override these grid declarations. */
.l-price {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: var(--gap);
  align-items: end;
}

.l-amount {
  grid-column: 1 / span 5;
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(clamp(120px, 16vw, 260px) * var(--display-scale));
  line-height: 0.78;
  letter-spacing: -0.04em;
}

.l-price > div {
  grid-column: 6 / span 4;
}
</style>
