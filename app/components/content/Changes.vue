<script setup lang="ts">
import { Collapsible } from '@froq/ui'

const props = defineProps<{
  type: 'breaking' | 'feat' | 'fix'
}>()

const { t } = useI18n()
const open = ref(inject<boolean>('changelog-open', true))
</script>

<template>
  <Collapsible
    v-model="open"
    class="lig-more l-changes"
    :label="t(`changelog.types.${props.type}`)"
  >
    <slot />
  </Collapsible>
</template>
