<script setup lang="ts">
import type { Quote } from '~/types'

const props = withDefaults(defineProps<{ items?: Quote[] }>(), { items: () => [] })
const cols = computed(() => Math.min(3, Math.max(1, props.items.length)))
</script>

<template>
  <div
    class="l-quotes"
    :style="{ '--cols': cols }"
  >
    <figure
      v-for="(item, index) in items"
      :key="index"
      class="l-quote"
    >
      <blockquote>
        <Fill
          :value="item.quote"
          :name="`quotes.${index}.quote`"
          :size="24"
        />
      </blockquote>
      <figcaption v-if="item.by != null">
        <Fill
          :value="item.by"
          :name="`quotes.${index}.by`"
          :size="12"
        />
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.l-quotes {
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
  gap: var(--gap);
}

.l-quote {
  margin: 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.l-quote blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(24px * var(--title-scale));
  line-height: 1.2;
}

.l-quote figcaption {
  margin-top: 20px;
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 860px) {
  .l-quotes {
    grid-template-columns: 1fr;
  }
}
</style>
