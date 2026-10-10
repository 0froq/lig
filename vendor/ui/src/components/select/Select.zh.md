---
title: Select
designStatus: ai-draft
description: 用于单选的带标签原生下拉框。
model:
  type: string
  required: true
  description: 当前选项的值。
props:
  - name: label
    type: string
    required: true
    description: 下拉框上显示的文字标签。
  - name: options
    type: ChoiceOption[]
    required: true
    description: 包含字符串值和显示文字的选项数组；禁用项会映射为原生 disabled option。
---

Select 渲染带标签的原生下拉框，每次选择一个选项。每个选项是包含 `value` 和 `label` 的对象；通过 `v-model` 绑定所选值。未声明的 `id`、`name`、`disabled`、`required`、ARIA 属性和事件监听器等会应用到内部 select；`class` 和 `style` 会应用到外层 label。该组件只支持单值选择，不支持 `multiple` 或额外的 `value` 属性；所选值请使用 `v-model` 绑定。

## 用法

```vue
<script setup lang="ts">
import { Select } from '@froq/ui'
import { ref } from 'vue'

const options = [
  { value: 'quiet', label: '安静' },
  { value: 'plain', label: '普通' },
]
const tone = ref('plain')
</script>

<template>
  <div class="ui">
    <Select
      v-model="tone"
      label="风格"
      :options="options"
    />
  </div>
</template>
```
