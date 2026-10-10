---
title: Paper
designStatus: ai-draft
description: Fibre on a light sheet, specks on a dark one. Either side can be left off.
props:
  - name: light
    type: boolean
    default: "true"
    description: Draw the fibre while the page is light.
  - name: dark
    type: boolean
    default: "true"
    description: Draw the specks while the page is dark.
slots:
  - name: default
    description: Content above the texture.
---

Paper lays a sheet texture inside whatever it wraps. Light pages get the fibre. Dark pages get the speck field. Set `light` or `dark` to `false` to leave that side flat. The texture follows the page theme (`data-theme`, or a `dark` class on the document).

## Usage

```vue
<script setup lang="ts">
import { Paper } from '@froq/ui'
</script>

<template>
  <Paper class="ui">
    <p>Held on the sheet.</p>
  </Paper>
</template>
```
