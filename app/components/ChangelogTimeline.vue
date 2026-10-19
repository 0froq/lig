<script setup lang="ts">
// Anchors on one page, not pages: a rail of releases whose marker follows the reading position
const props = defineProps<{
  items: { id: string, version: string, date: string }[]
  label: string
}>()

const active = ref(0)
let frame = 0

function measure(): void {
  frame = 0
  // A release becomes current once its heading passes the upper third of the viewport.
  const line = innerHeight * 0.33
  let index = 0
  props.items.forEach((item, i) => {
    const top = document.getElementById(item.id)?.getBoundingClientRect().top
    if (top != null && top <= line)
      index = i
  })
  active.value = index
}

function schedule(): void {
  if (!frame)
    frame = requestAnimationFrame(measure)
}

onMounted(() => {
  measure()
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  removeEventListener('scroll', schedule)
  removeEventListener('resize', schedule)
})
watch(() => props.items, schedule, { flush: 'post' })
</script>

<template>
  <nav
    class="l-timeline"
    :aria-label="label"
    :style="{ '--active': active, '--count': items.length }"
  >
    <span
      class="l-timeline-rail"
      aria-hidden="true"
    />
    <span
      class="l-timeline-progress"
      aria-hidden="true"
    />
    <span
      class="l-timeline-marker"
      aria-hidden="true"
    />
    <ol>
      <li
        v-for="(item, index) in items"
        :key="item.id"
      >
        <a
          :href="`#${item.id}`"
          :aria-current="index === active ? 'location' : undefined"
        >
          <span class="l-timeline-version">{{ item.version }}</span>
          <span class="l-timeline-date">{{ item.date }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.l-timeline {
  --row: 64px;
  --dot: 7px;
  /* Centre of the version line; dots and rail hang from it. */
  --y: 8px;
  position: relative;
  padding-inline-start: 24px;
}

.l-timeline ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

.l-timeline li {
  position: relative;
  height: var(--row);
}

.l-timeline li:last-child {
  height: auto;
}

.l-timeline li::before {
  content: '';
  position: absolute;
  inset-inline-start: -24px;
  top: calc(var(--y) - var(--dot) / 2);
  box-sizing: border-box;
  width: var(--dot);
  height: var(--dot);
  border: 1px solid var(--muted);
  border-radius: 50%;
  background: var(--bg);
}

.l-timeline-rail,
.l-timeline-progress {
  position: absolute;
  inset-inline-start: calc(var(--dot) / 2 - 0.5px);
  top: var(--y);
  width: 1px;
}

.l-timeline-rail {
  height: calc((var(--count) - 1) * var(--row));
  background: var(--line);
}

.l-timeline-progress {
  z-index: 1;
  height: calc(var(--active) * var(--row));
  background: var(--accent);
  transition: height 0.45s var(--ease);
}

.l-timeline-marker {
  position: absolute;
  z-index: 2;
  inset-inline-start: 0;
  top: calc(var(--y) - var(--dot) / 2);
  width: var(--dot);
  height: var(--dot);
  border-radius: 50%;
  background: var(--accent);
  translate: 0 calc(var(--active) * var(--row));
  transition: translate 0.45s var(--ease);
}

.l-timeline a {
  display: grid;
  gap: 4px;
  font-family: var(--font-meta);
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.l-timeline-version {
  font-size: 13px;
  line-height: 16px;
}

.l-timeline-date {
  font-size: 10.5px;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

.l-timeline a:hover,
.l-timeline a[aria-current] {
  color: var(--fg);
}

.l-timeline a:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .l-timeline-progress,
  .l-timeline-marker,
  .l-timeline a {
    transition: none;
  }
}
</style>
