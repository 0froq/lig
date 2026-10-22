<script setup lang="ts">
// A numbered step with a command to copy; the pen underlines the numbers like any other label
withDefaults(
  defineProps<{
    label?: string | null
    title?: string | null
    code?: string
  }>(),
  { label: null, title: null, code: undefined },
)
</script>

<template>
  <Block
    :label="label"
    label-name="step.label"
    entry
  >
    <EntryTitle>
      <Fill
        :value="title"
        name="step.title"
        :size="12"
      />
    </EntryTitle>
    <Fill
      v-if="code != null && !isFilled(code)"
      name="step.code"
      :size="18"
    />
    <CopyCommand
      v-else-if="code"
      :code="code"
    />
    <Prose>
      <slot />
    </Prose>
  </Block>
</template>
