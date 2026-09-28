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
