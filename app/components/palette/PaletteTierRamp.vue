<script setup lang="ts">
const props = defineProps<{
  family: string
  levels: { tier: string, hex: string, token: string }[]
}>()

const { format, copied, copyValue, textFor } = usePaletteClipboard()
const baseColor = computed(() => props.levels.find(level => level.tier === 'base')?.hex)
</script>

<template>
  <div
    class="lig-tier-ramp"
    role="group"
    :aria-label="family"
  >
    <div
      class="lig-tier-shapes"
      :style="{ background: baseColor }"
    >
      <button
        v-for="level in levels"
        :key="level.tier"
        type="button"
        class="lig-tier-shape"
        :class="`is-${level.tier}`"
        :style="{ background: level.hex }"
        :aria-label="`${family} ${level.tier}: ${textFor(level.hex, format)}`"
        :title="`${level.token}: ${textFor(level.hex, format)}`"
        @click="copyValue(textFor(level.hex, format), level.token)"
      />
    </div>
    <div
      class="lig-tier-captions"
      aria-hidden="true"
    >
      <span
        v-for="level in levels"
        :key="level.tier"
      >
        {{ copied === level.token ? $t('install.copied') : level.tier }}
      </span>
    </div>
    <span
      class="lig-tier-announcement"
      role="status"
    >
      {{ copied ? $t('install.copied') : '' }}
    </span>
  </div>
</template>

<style scoped>
.lig-tier-shapes {
  position: relative;
  height: clamp(56px, 6vw, 80px);
}

.lig-tier-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
}

.lig-tier-shape.is-highlight {
  clip-path: polygon(0 0, 33.333333% 0, 0 100%);
}

.lig-tier-shape.is-base {
  clip-path: polygon(33.333333% 0, 100% 0, 66.666667% 100%, 0 100%);
}

.lig-tier-shape.is-muted {
  clip-path: polygon(100% 0, 100% 100%, 66.666667% 100%);
}

.lig-tier-shapes:has(:focus-visible) {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

.lig-tier-shape:focus-visible {
  outline: none;
}

.lig-tier-captions {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 6px;
  margin-top: 10px;
  color: var(--muted);
  font: 10px/1.5 var(--font-meta);
}

.lig-tier-captions span:nth-child(2) {
  text-align: center;
}

.lig-tier-captions span:last-child {
  text-align: right;
}

.lig-tier-ramp:has(.is-highlight:hover, .is-highlight:focus-visible) .lig-tier-captions span:first-child,
.lig-tier-ramp:has(.is-base:hover, .is-base:focus-visible) .lig-tier-captions span:nth-child(2),
.lig-tier-ramp:has(.is-muted:hover, .is-muted:focus-visible) .lig-tier-captions span:last-child {
  color: var(--fg);
}

.lig-tier-ramp:has(.is-highlight:focus-visible) .lig-tier-captions span:first-child,
.lig-tier-ramp:has(.is-base:focus-visible) .lig-tier-captions span:nth-child(2),
.lig-tier-ramp:has(.is-muted:focus-visible) .lig-tier-captions span:last-child {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.lig-tier-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
