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

<style scoped>
/* Install page */
.l-command {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  max-width: 34rem;
  margin: 22px 0 14px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  font-size: 14px;
}

.l-command code {
  overflow-x: auto;
  white-space: nowrap;
}

.l-command button {
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.3s;
}

.l-command button:hover {
  color: var(--fg);
}
</style>
