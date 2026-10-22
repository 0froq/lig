<script setup lang="ts">
withDefaults(defineProps<{ lines?: string[] }>(), { lines: () => [] })
</script>

<template>
  <p
    class="l-statement"
    data-anchor="statement"
  >
    <template v-if="lines.length">
      <template
        v-for="(line, index) in lines"
        :key="index"
      >
        <br v-if="index" /><Fill
          v-if="!isFilled(line)"
          :name="`statement.${index}`"
          :size="16"
        /><RichText
          v-else
          :text="line"
        />
      </template>
    </template>
    <slot
      v-else
      mdc-unwrap="p"
    />
  </p>
</template>

<style scoped>
.l-statement {
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(clamp(44px, 6.4vw, 104px) * var(--poster-scale));
  line-height: 1;
  letter-spacing: -0.025em;
}

:lang(zh) .l-statement {
  letter-spacing: 0;
}

:lang(zh) .l-statement {
  line-height: 1.15;
}
</style>
