<script setup lang="ts">
import type { Question } from '~/types'

withDefaults(defineProps<{ items?: Question[] }>(), { items: () => [] })
</script>

<template>
  <div class="l-qa">
    <details
      v-for="(item, index) in items"
      :key="index"
    >
      <summary>
        <span>
          <Fill
            v-if="!isFilled(item.q)"
            :name="`faq.${index}.q`"
            :size="16"
          />
          <RichText
            v-else
            :text="item.q"
          />
        </span>
      </summary>
      <p>
        <Fill
          v-if="!isFilled(item.a)"
          :name="`faq.${index}.a`"
          :size="24"
        />
        <RichText
          v-else
          :text="item.a"
        />
      </p>
    </details>
  </div>
</template>

<style scoped>
.l-qa details {
  border-top: 1px solid var(--line);
}

.l-qa details:last-child {
  border-bottom: 1px solid var(--line);
}

.l-qa summary {
  display: flex;
  justify-content: space-between;
  gap: var(--gap);
  padding: 22px 0;
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-size: calc(clamp(22px, 2.2vw, 30px) * var(--title-scale));
  line-height: 1.2;
}

.l-qa summary::-webkit-details-marker {
  display: none;
}

.l-qa summary::after {
  content: '+';
  font-family: var(--font-text);
  font-size: 18px;
  color: var(--muted);
  transition: rotate 0.4s var(--ease);
}

.l-qa details[open] summary::after {
  rotate: 45deg;
}

.l-qa summary :deep(code) {
  font-size: 0.72em;
}

.l-qa p {
  max-width: 34rem;
  margin: 0;
  padding: 0 0 26px;
  color: var(--muted);
}
</style>
