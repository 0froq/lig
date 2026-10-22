<script setup lang="ts">
// One section: a label in the margin (where the pen runs) and a body. Anything can go in the body.
withDefaults(
  defineProps<{
    id?: string
    label?: string | null
    /** Name drawn on the label block while `label` is empty. */
    labelName?: string
    /** Omit for no heading; an empty string shows a placeholder. */
    title?: string | null
    /** Name drawn on the title block while `title` is empty. */
    titleName?: string
    /** Tighter spacing with a rule, for lists of entries. */
    entry?: boolean
  }>(),
  {
    id: undefined,
    label: null,
    labelName: 'block.label',
    title: undefined,
    titleName: 'block.title',
  },
)
</script>

<template>
  <Section
    :id="id"
    :entry="entry"
  >
    <template #label>
      <Fill
        :value="label"
        :name="labelName"
        :size="6"
      />
    </template>
    <template
      v-if="title !== undefined"
      #title
    >
      <Fill
        :value="title"
        :name="titleName"
        :size="14"
      />
    </template>
    <slot />
  </Section>
</template>
