<script setup lang="ts">
import type { ChoiceOption } from '../../vue'
import { useControlAttrs } from '../../vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  options: ChoiceOption[]
}>()

const model = defineModel<string>({ required: true })
const { wrapperAttrs, controlAttrs } = useControlAttrs()
</script>

<template>
  <label
    v-bind="wrapperAttrs()"
    class="ui-field"
  >
    <span class="ui-field-label">{{ label }}</span>
    <select
      v-bind="controlAttrs()"
      v-model="model"
      class="ui-field-control"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
