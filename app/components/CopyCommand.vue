<script setup lang="ts">
const props = defineProps<{ code: string }>()
const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy(): Promise<void> {
  await navigator.clipboard?.writeText(props.code)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1600)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="l-command">
    <code>{{ code }}</code>
    <button
      type="button"
      @click="copy"
    >
      {{ copied ? t('install.copied') : t('install.copy') }}
    </button>
  </div>
</template>
