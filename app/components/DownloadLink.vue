<script setup lang="ts">
const props = defineProps<{
  href: string
  download?: string
  title?: string
}>()

const { statusFor, start } = useDownloads()
const status = computed(() => statusFor(props.href))
const filename = computed(() => props.download || props.href.split('/').pop() || 'download')
const symbol = computed(() => ({ idle: '↓', pending: '…', started: '✓', error: '↻' })[status.value])

function onClick(event: MouseEvent): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  event.preventDefault()
  void start(props.href, filename.value)
}
</script>

<template>
  <a
    class="lig-download-link"
    :href="href"
    :download="filename"
    :title="status === 'error' ? $t('download.error') : title"
    :data-status="status"
    :aria-busy="status === 'pending'"
    :aria-disabled="status === 'pending' || undefined"
    @click="onClick"
  >
    <slot :status="status" />
    <span
      class="lig-download-symbol"
      aria-hidden="true"
    >
      <slot
        name="icon"
        :status="status"
        >{{ symbol }}</slot
      >
    </span>
    <span
      class="lig-download-announcement"
      role="status"
    >
      {{ status === 'idle' ? '' : $t(`download.${status}`) }}
    </span>
  </a>
</template>

<style scoped>
.lig-download-symbol {
  display: inline-block;
  min-width: 1em;
  margin-inline-start: 0.25em;
  text-align: center;
}

.lig-download-link[aria-disabled='true'] {
  cursor: progress;
}

.lig-download-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
