<script setup lang="ts">
import type { LigVariant } from '../../../core'
import type { SyntaxDocument } from '../../../syntax/types'
import { Popover } from '@froq/ui'
import { resolveVariant } from '../../../core'
import { segmentSource } from '../../../syntax/model'

const props = defineProps<{ document: SyntaxDocument, variant: LigVariant }>()
const { t } = useI18n()
const resolved = computed(() => resolveVariant(props.variant))
const segments = computed(() => segmentSource(props.document))
const active = ref<number | null>(null)
const inspected = ref<number | null>(null)
const pinned = ref(false)
const code = ref<HTMLElement>()
const floatingOpen = ref(false)
const reference = shallowRef<HTMLElement>()
let hoverTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let detachListeners: (() => void) | undefined
const segment = computed(() => active.value === null ? null : segments.value[active.value]!)
const node = computed(() => inspected.value === null ? null : props.document.nodes[inspected.value]!)
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
  class: 'lig-node-inspector lig-inspector-floating ui',
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

function closeInfo(): void {
  clearTimeout(hoverTimer)
  clearTimeout(closeTimer)
  floatingOpen.value = false
  pinned.value = false
  if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.lig-inspector-floating'))
    code.value?.focus({ preventScroll: true })
}

function leaveInfo(): void {
  clearTimeout(hoverTimer)
  if (!pinned.value)
    closeTimer = setTimeout(closeInfo, 180)
}

function showInfo(id: number, element?: HTMLElement): void {
  reference.value = element ?? code.value?.querySelector<HTMLElement>(`[data-segment="${id}"]`) ?? code.value
  if (reference.value)
    floatingOpen.value = true
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
  clearTimeout(hoverTimer)
  clearTimeout(closeTimer)
})

function selectSegment(id: number, pin = false): void {
  active.value = id
  inspected.value = segments.value[id]!.node
  pinned.value = pin
  clearTimeout(hoverTimer)
  keepInfo()
  showInfo(id)
}

function hover(id: number, event: PointerEvent): void {
  keepInfo()
  clearTimeout(hoverTimer)
  if (pinned.value || event.pointerType === 'touch')
    return
  if (!segments.value[id]!.text.trim())
    return
  const element = event.currentTarget as HTMLElement
  hoverTimer = setTimeout(() => {
    selectSegment(id)
    showInfo(id, element)
  }, 240)
}

function selectNode(id: number): void {
  const selected = props.document.nodes[id]!
  inspected.value = id
  pinned.value = true
  const inside = segments.value.filter(item => item.startByte >= selected.startByte && item.endByte <= selected.endByte)
  active.value = (inside.find(item => item.text.trim()) ?? inside[0])?.id ?? null
  if (active.value !== null)
    showInfo(active.value)
}

function navigate(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    active.value = null
    inspected.value = null
    pinned.value = false
    closeInfo()
  }
  else if (event.key === 'ArrowUp' && node.value?.parent !== null && node.value?.parent !== undefined) {
    selectNode(node.value.parent)
  }
  else if (event.key === 'ArrowDown' && node.value?.children.length) {
    selectNode(node.value.children[0]!)
  }
  else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const items = segments.value.filter(item => item.text.trim())
    const index = items.findIndex(item => item.id === active.value)
    const next = index < 0 ? 0 : Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)))
    if (items[next])
      selectSegment(items[next].id, true)
  }
  else {
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
        tabindex="0"
        :aria-label="t('palette.inspect.codeLabel', { file: document.filename })"
        :aria-describedby="`syntax-help-${document.language}`"
        @keydown="navigate"
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
        :class="{ 'is-inspected': inSelection(item.startByte, item.endByte) }"
        @pointerenter="hover(item.id, $event)"
        @click="selectSegment(item.id, true)"
      >{{ item.text }}</span></code></pre>
      <Popover
        v-if="floatingOpen"
        v-bind="inspectorAttrs"
        @update:model-value="closeInfo"
        @open-auto-focus.prevent
        @close-auto-focus.prevent
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
                {{ node.range[0] + 1 }}:{{ node.range[1] + 1 }} → {{ node.range[2] + 1 }}:{{ node.range[3] + 1 }}
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
