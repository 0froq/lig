---
title: Paper
designStatus: ai-draft
description: 浅色是纤维，深色是颗粒。每一档都可以关掉。
props:
  - name: light
    type: boolean
    default: "true"
    description: 页面为浅色时画纤维。
  - name: dark
    type: boolean
    default: "true"
    description: 页面为深色时画颗粒。
slots:
  - name: default
    description: 纹理上面的内容。
---

Paper 把纸面纹理铺在它所包住的容器里。浅色是纤维，深色是颗粒。`light` 或 `dark` 设为 `false` 就卸掉那一档。纹理跟着页面主题走（文档上的 `data-theme`，或 `dark` 类）。

## 用法

```vue
<script setup lang="ts">
import { Paper } from '@froq/ui'
</script>

<template>
  <Paper class="ui">
    <p>落在这张纸上。</p>
  </Paper>
</template>
```
