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
</style>
