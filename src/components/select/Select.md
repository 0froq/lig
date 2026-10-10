---
title: Select
designStatus: ai-draft
description: A labeled native select for choosing one option.
model:
  type: string
  required: true
  description: The value of the selected option.
props:
  - name: label
    type: string
    required: true
    description: Visible text label for the select.
  - name: options
    type: ChoiceOption[]
    required: true
    description: Options with a string value and display label; disabled options map to native disabled options.
---

Select renders a labeled native select with one option selected at a time. Pass each option as an object with `value` and `label`, and bind the selected value with `v-model`. Undeclared attributes such as `id`, `name`, `disabled`, `required`, ARIA attributes, and event listeners are applied to the inner select. `class` and `style` are applied to the outer label. This is a single-value select: it does not support `multiple` or an additional `value` attribute; use `v-model` for the selected value.

## Usage

```vue
<script setup lang="ts">
import { Select } from '@froq/ui'
import { ref } from 'vue'

const options = [
  { value: 'quiet', label: 'Quiet' },
  { value: 'plain', label: 'Plain' },
]
const tone = ref('plain')
</script>

<template>
  <div class="ui">
    <Select
      v-model="tone"
      label="Tone"
      :options="options"
    />
  </div>
</template>
```
