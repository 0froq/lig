<script setup lang="ts">
import type { LigVariant } from '../../../core'
import type { SyntaxDocument } from '../../../syntax/types'
import { Popover } from '@froq/ui'
import { resolveVariant } from '../../../core'
import { segmentSource } from '../../../syntax/model'

const props = defineProps<{ document: SyntaxDocument; variant: LigVariant }>()
const { t } = useI18n()
const resolved = computed(() => resolveVariant(props.variant))
const segments = computed(() => segmentSource(props.document))
const active = ref<number | null>(null)
const inspected = ref<number | null>(null)
const pinned = ref(false)
const code = ref<HTMLElement>()
const floatingOpen = ref(false)
const floatingMoving = ref(false)
const reference = shallowRef<HTMLElement>()
let closeTimer: ReturnType<typeof setTimeout> | undefined
let detachListeners: (() => void) | undefined
const segment = computed(() => (active.value === null ? null : segments.value[active.value]!))
const node = computed(() =>
  inspected.value === null ? null : props.document.nodes[inspected.value]!,
)
const role = computed(() => segment.value?.token ?? 'text.primary')
const color = computed(() => resolved.value.tokens[role.value]!)
const style = computed(() => ({
  '--pv-bg': resolved.value.tokens['surface.canvas'],
  '--pv-fg': resolved.value.tokens['text.primary'],
  '--pv-muted': resolved.value.tokens['text.secondary'],
  '--pv-line': resolved.value.tokens['border.default'],
  '--pv-selection': resolved.value.tokens['surface.selection'],
}))
const inspectorAttrs = computed(() => ({
  modelValue: floatingOpen.value,
  reference: reference.value,
  label: t('palette.inspect.title'),
  closeLabel: t('palette.inspect.close'),
  portalTo: 'body',
  side: 'bottom' as const,
  align: 'start' as const,
  class: [
    'lig-node-inspector lig-inspector-floating ui',
    { 'is-moving': floatingMoving.value, 'is-pinned': pinned.value },
  ],
  style: {
    ...style.value,
    '--ui-bg': style.value['--pv-bg'],
    '--ui-fg': style.value['--pv-fg'],
    '--ui-muted': style.value['--pv-muted'],
    '--ui-line': style.value['--pv-line'],
    '--ui-accent': style.value['--pv-fg'],
    '--ui-font-text': 'var(--font-meta)',
  },
}))

function keepInfo(): void {
  clearTimeout(closeTimer)
}

function interactOutside(event: Event): void {
  const target = event.target
  if (!(target instanceof HTMLElement) || !code.value?.contains(target)) return
  const segment = target.closest<HTMLElement>('[data-segment]')
  // Retarget real tokens, but let blank areas dismiss the card. Clicking a token
  // also focuses the surrounding pre, which must not dismiss it either.
  const isCodeFocus = event instanceof CustomEvent && event.detail.originalEvent.type === 'focusin'
  if (segment?.textContent?.trim() || isCodeFocus) {
    event.preventDefault()
    keepInfo()
  }
}

function clickCode(event: MouseEvent): void {
  const target =
    event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-segment]') : null
  if (target?.textContent?.trim()) selectSegment(Number(target.dataset.segment), true)
  else closeInfo()
}

function closeInfo(): void {
  clearTimeout(closeTimer)
  floatingOpen.value = false
  floatingMoving.value = false
  pinned.value = false
  active.value = null
  inspected.value = null
  if (
    document.activeElement instanceof HTMLElement &&
    document.activeElement.closest('.lig-inspector-floating')
  )
    code.value?.focus({ preventScroll: true })
}

function leaveInfo(): void {
  if (!pinned.value) closeTimer = setTimeout(closeInfo, 180)
}

function showInfo(id: number, element?: HTMLElement): void {
  const nextReference =
    element ?? code.value?.querySelector<HTMLElement>(`[data-segment="${id}"]`) ?? code.value
  // Enable motion only when retargeting an already positioned card, not on first open.
  if (floatingOpen.value && reference.value !== nextReference) floatingMoving.value = true
  reference.value = nextReference
  if (reference.value) floatingOpen.value = true
}

onMounted(() => {
  function scroll(event: Event): void {
    if (event.target instanceof HTMLElement && event.target.closest('.lig-inspector-floating'))
      return
    closeInfo()
  }
  window.addEventListener('resize', closeInfo)
  window.addEventListener('scroll', scroll, { capture: true, passive: true })
  detachListeners = () => {
    window.removeEventListener('resize', closeInfo)
    window.removeEventListener('scroll', scroll, true)
  }
})
onBeforeUnmount(() => {
  detachListeners?.()
  clearTimeout(closeTimer)
})

function selectSegment(id: number, pin = false): void {
  active.value = id
  inspected.value = segments.value[id]!.node
  pinned.value = pin
  keepInfo()
  showInfo(id)
}

function hover(id: number, event: PointerEvent): void {
  keepInfo()
  if (pinned.value || event.pointerType === 'touch') return
  if (!segments.value[id]!.text.trim()) return
  selectSegment(id)
}

function selectNode(id: number): void {
  const selected = props.document.nodes[id]!
  inspected.value = id
  pinned.value = true
  const inside = segments.value.filter(
    item => item.startByte >= selected.startByte && item.endByte <= selected.endByte,
  )
  active.value = (inside.find(item => item.text.trim()) ?? inside[0])?.id ?? null
  if (active.value !== null) showInfo(active.value)
}

function navigate(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    active.value = null
    inspected.value = null
    pinned.value = false
    closeInfo()
  } else if (
    event.key === 'ArrowUp' &&
    node.value?.parent !== null &&
    node.value?.parent !== undefined
  ) {
    selectNode(node.value.parent)
  } else if (event.key === 'ArrowDown' && node.value?.children.length) {
    selectNode(node.value.children[0]!)
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const items = segments.value.filter(item => item.text.trim())
    const index = items.findIndex(item => item.id === active.value)
    const next =
      index < 0
        ? 0
        : Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)))
    if (items[next]) selectSegment(items[next].id, true)
  } else {
    return
  }
  event.preventDefault()
}

function inSelection(start: number, end: number): boolean {
  return !!node.value && start >= node.value.startByte && end <= node.value.endByte
}
</script>

<template>
  <section
    class="lig-parsed"
    :style="style"
    :aria-label="document.filename"
  >
    <header class="lig-parsed-header">
      <span>{{ document.filename }}</span>
    </header>
    <p
      :id="`syntax-help-${document.language}`"
      class="lig-parsed-hint"
    >
      {{ t('palette.inspect.help') }}
    </p>
    <div class="lig-parsed-body">
      <pre
        ref="code"
        class="lig-code lig-parsed-code"
        :class="{ 'is-pinned': pinned }"
        tabindex="0"
        :aria-label="t('palette.inspect.codeLabel', { file: document.filename })"
        :aria-describedby="`syntax-help-${document.language}`"
        @keydown="navigate"
        @click="clickCode"
        @pointerleave="leaveInfo"
      ><code><span
        v-for="item in segments"
        :key="item.id"
        :data-segment="item.id"
        :style="{
          color: resolved.tokens[item.token],
          fontWeight: item.decorations.bold ? 'bold' : undefined,
          fontStyle: item.decorations.italic ? 'italic' : undefined,
          textDecoration: [item.decorations.underline ? 'underline' : '', item.decorations.strikethrough ? 'line-through' : ''].filter(Boolean).join(' ') || undefined,
        }"
        :class="{ 'is-inspected': floatingOpen && inSelection(item.startByte, item.endByte) }"
        @pointerenter="hover(item.id, $event)"
      >{{ item.text }}</span></code></pre>
      <Popover
        v-if="floatingOpen"
        v-bind="inspectorAttrs"
        @update:model-value="closeInfo"
        @open-auto-focus.prevent
        @close-auto-focus.prevent
        @interact-outside="interactOutside"
        @pointerenter="keepInfo"
        @pointerleave="leaveInfo"
      >
        <div class="lig-inspector-panel">
          <div class="lig-inspector-heading">
            <span>{{ node?.type ?? t('palette.inspect.title') }}</span>
          </div>
          <div
            class="lig-inspector-content"
            role="region"
            :aria-label="t('palette.inspect.title')"
            tabindex="0"
          >
            <template v-if="node">
              <p class="lig-node-meta">
                {{ node.range[0] + 1 }}:{{ node.range[1] + 1 }} → {{ node.range[2] + 1 }}:{{
                  node.range[3] + 1
                }}
              </p>
              <p
                v-if="segment"
                class="lig-node-color"
              >
                <i :style="{ background: color }" />
                <span>{{ role }}</span>
                <span class="lig-node-hex">{{ color }}</span>
              </p>
            </template>
            <p
              v-else
              class="lig-node-placeholder"
            >
              {{ t('palette.inspect.empty') }}
            </p>
          </div>
        </div>
      </Popover>
    </div>
  </section>
</template>

<style scoped>
.lig-code {
  margin: 0;
  overflow-x: auto;
  font-family: var(--font-meta);
  font-size: 13px;
  line-height: 1.65;
}

.lig-parsed {
  --scrollbar-thumb: color-mix(in oklab, var(--pv-fg) 35%, transparent);
  isolation: isolate;
  min-width: 0;
  padding: 24px;
  color: var(--pv-fg);
  background: var(--pv-bg);
  border: 1px solid var(--pv-line);
}

.lig-parsed-hint {
  margin: 12px 0 24px;
  font: 11px/1.7 var(--font-meta);
}

.lig-parsed-body {
  min-width: 0;
}

.lig-parsed-code {
  min-width: 0;
  padding: 6px 0 16px;
  tab-size: 2;
}

.lig-parsed-code .is-inspected {
  background: var(--pv-selection);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--pv-muted);
  text-underline-offset: 4px;
}

.lig-parsed-code.is-pinned .is-inspected {
  text-decoration-style: solid;
  text-decoration-color: var(--pv-fg);
}

.lig-inspector-panel {
  display: grid;
}

.lig-inspector-heading {
  min-height: 30px;
  background: var(--pv-bg);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--pv-line);
}

.lig-inspector-content {
  min-height: 0;
  padding-inline: 4px;
  overflow-anchor: none;
  background: var(--pv-bg);
}

.lig-node-meta,
.lig-node-color {
  margin: 5px 0;
}

.lig-node-color {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lig-node-color i {
  width: 12px;
  height: 12px;
  flex: none;
  border: 1px solid var(--pv-muted);
}

@media (prefers-reduced-motion: no-preference) {
  .lig-parsed-code .is-inspected {
    transition: text-decoration-color 180ms ease;
  }
}

@media (max-width: 600px) {
  .lig-parsed {
    padding: 16px;
  }
}
</style>

<style>
/* Popover forwards its classes to an internal, body-portaled element, not its
   scoped root. Keep these rules and their mixed groups unscoped so the card,
   library close button and Reka wrapper remain reachable with the original specificity. */
.lig-parsed-header,
.lig-inspector-heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  font: 12px/1.5 var(--font-meta);
}

.lig-parsed-hint,
.lig-node-meta,
.lig-node-placeholder,
.lig-node-hex {
  color: var(--pv-muted);
}

.lig-parsed-code:focus-visible,
.lig-inspector-content:focus-visible,
.lig-node-inspector button:focus-visible,
.lig-node-inspector select:focus-visible {
  outline: 1px solid var(--pv-fg);
  outline-offset: 4px;
}

.lig-node-inspector {
  min-width: 0;
  background: var(--pv-bg);
  overflow-wrap: anywhere;
  font: 11px/1.65 var(--font-meta);
}

.lig-node-inspector button {
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.lig-inspector-floating {
  box-shadow: none;
  width: min(20rem, calc(100vw - 24px));
  max-height: calc(100dvh - 24px);
  padding: 12px 40px 12px 12px;
}

.lig-inspector-floating.is-pinned {
  border-color: var(--pv-muted);
}

/* Reka positions the outer wrapper; animating the card itself would not move its anchor. */
@media (prefers-reduced-motion: no-preference) {
  .lig-inspector-floating {
    transition: border-color 180ms ease;
  }

  [data-reka-popper-content-wrapper]:has(> .lig-inspector-floating.is-moving) {
    transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}
</style>
