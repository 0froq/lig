<script setup lang="ts">
import type { Figure } from '~/types'

const props = withDefaults(defineProps<{ items?: Figure[] }>(), { items: () => [] })
const cols = computed(() => Math.min(4, Math.max(1, props.items.length)))
</script>

<template>
  <dl
    class="l-specs"
    :style="{ '--cols': cols }"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      class="l-spec"
    >
      <dt>
        <Fill
          :value="item.label"
          :name="`figures.${index}.label`"
          :size="6"
        />
      </dt>
      <dd
        class="l-figure"
        data-anchor="figure"
      >
        <Fill
          :value="item.value"
          :name="`figures.${index}.value`"
          :size="1"
        /><small v-if="item.unit != null"
          ><Fill
            :value="item.unit"
            :name="`figures.${index}.unit`"
            :size="2"
        /></small>
      </dd>
      <Prose
        v-if="item.copy != null"
        as="dd"
      >
        <Fill
          v-if="!isFilled(item.copy)"
          :name="`figures.${index}.copy`"
          :size="18"
        />
        <RichText
          v-else
          :text="item.copy"
        />
      </Prose>
    </div>
  </dl>
</template>

<style scoped>
.l-spec .l-copy {
  max-width: 16rem;
  font-size: 14px;
}

.l-specs {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
  gap: var(--gap);
  margin: 72px 0 0;
}

.l-spec {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.l-spec dt {
  font-size: 14px;
}

.l-spec dd {
  margin: 0;
}

.l-figure {
  margin: 36px 0 12px !important;
  font-family: var(--font-display);
  font-size: calc(clamp(72px, 8vw, 128px) * var(--poster-scale));
  line-height: 0.8;
  letter-spacing: -0.03em;
}

.l-figure small {
  margin-left: 6px;
  font-family: var(--font-text);
  font-size: 14px;
  letter-spacing: 0;
  color: var(--muted);
}

@media (max-width: 860px) {
  .l-specs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
