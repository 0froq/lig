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

<style scoped>
.lig-more {
  margin-top: 28px;
}

/* Keep closed sections compact, but leave space after an open section's content. */
.lig-more:not(.is-open) + .lig-more {
  margin-top: 0;
}

.lig-more:not(.is-open) + .lig-more > :deep(.ui-collapsible-trigger) {
  padding-top: 8px;
}

/* Pinned titles sit under the notice bar when there is one. */
.ui-collapsible.lig-more.is-open > :deep(.ui-collapsible-trigger) {
  top: var(--banner-h, 0px);
}
</style>
