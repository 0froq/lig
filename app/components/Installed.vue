<script setup lang="ts">
const { t } = useI18n()
const copy = useCopy()
const installed = useInstalled()
const back = ref<HTMLButtonElement>()

watch(installed, on => {
  if (on) setTimeout(() => back.value?.focus({ preventScroll: true }), 900)
})
</script>

<template>
  <div
    class="l-installed"
    aria-live="polite"
  >
    <p class="l-installed-title">
      <Fill
        :value="copy('install.done')"
        name="install.done"
        :size="8"
      />
    </p>
    <button
      ref="back"
      class="l-back"
      type="button"
      @click="installed = false"
    >
      {{ t('install.back') }}
    </button>
  </div>
</template>

<style scoped>
.l-installed {
  position: fixed;
  top: 24svh;
  left: var(--pad);
  z-index: 30;
  display: grid;
  justify-items: start;
  gap: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s var(--ease);
}

/* Vue scopes the final compound only, so the html state remains global. */
.is-installed .l-installed {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0.9s;
}

.l-installed-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: calc(clamp(56px, 7vw, 112px) * var(--display-scale));
  line-height: 1;
  letter-spacing: -0.03em;
}

.l-back {
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s;
}

.l-back::before {
  content: '← ';
}

.l-back:hover {
  color: var(--fg);
}
</style>
