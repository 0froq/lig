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
