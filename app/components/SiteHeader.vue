<script setup lang="ts">
import type { MenuItem } from '@froq/ui/vue'
import { Menu, Select } from '@froq/ui'

const { product } = useAppConfig()
const { t, locale, locales } = useI18n()
const { status } = useLocaleStatus()
const switchLocalePath = useSwitchLocalePath()
const languageOptions = computed(() =>
  locales.value.map(item => {
    const name = item.name ?? item.code
    return {
      value: item.code,
      label: status(item.code) === 'wip' ? t('site.wipLanguage', { language: name }) : name,
    }
  }),
)
const language = computed({
  get: () => locale.value,
  set: (value: string) => {
    void changeLanguage(value)
  },
})
const link = useKitLink()
const route = useRoute()
const pinned = ref(false)
const menuItems = computed<MenuItem[]>(() =>
  product.nav.map(item => ({ value: item.to, label: t(item.label) })),
)
const menuOpen = ref(false)

function here(to: string): boolean {
  const path = link(to)
  return route.path === path || route.path.startsWith(`${path}/`)
}

function openPage(item: MenuItem): void {
  void navigateTo(link(item.value))
}

async function changeLanguage(value: string): Promise<void> {
  const language = locales.value.find(l => l.code === value)
  if (!language || language.code === locale.value) return
  const path = switchLocalePath(language.code)
  if (path) await navigateTo(path)
}

function onScroll(): void {
  // Shown once the head is gone, and put away again at the foot of the page so it never covers the footer
  const { scrollY, innerHeight } = window
  pinned.value =
    scrollY > 220 && scrollY + innerHeight < document.documentElement.scrollHeight - 160
}

onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="l-top">
    <NuxtLink
      class="l-brand"
      :to="link('/')"
    >
      <Fill
        :value="product.name"
        name="product.name"
        :size="4"
      /><span class="l-dot">{{ product.mark }}</span>
    </NuxtLink>
    <PaletteThemeSwitch />
    <div class="l-header-actions">
      <nav class="l-nav">
        <NuxtLink
          v-for="item in product.nav"
          :key="item.to"
          :to="link(item.to)"
        >
          {{ t(item.label) }}
        </NuxtLink>
      </nav>
      <div class="l-controls lig-ui ui">
        <Menu
          v-model="menuOpen"
          class="l-menu-list"
          :label="t('site.menu')"
          :items="menuItems"
          :modal="false"
          align="end"
          @select="openPage"
        >
          <template #item="{ item }">
            <span :aria-current="here(item.value) ? 'page' : undefined">{{ item.label }}</span>
          </template>
          <template #trigger>
            <button
              type="button"
              class="l-menu"
            >
              {{ t('site.menu') }}
              <svg
                viewBox="0 0 12 8"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m1 1 5 5 5-5" />
              </svg>
            </button>
          </template>
        </Menu>
        <Select
          v-model="language"
          :label="t('site.language')"
          :options="languageOptions"
          :native="false"
          hide-label
          align="end"
          class="l-language-select"
        >
          <template #option="{ option }">
            <span :lang="locales.find(l => l.code === option.value)?.language">{{
              option.label
            }}</span>
          </template>
        </Select>
      </div>
    </div>
    <Transition name="theme-bar">
      <div
        v-if="pinned"
        class="l-theme-bar"
      >
        <PaletteThemeSwitch />
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* Header */
.l-top {
  position: absolute;
  inset: 0 0 auto;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 72px;
  padding: 0 var(--pad);
  font-size: 14px;
}

.l-brand {
  grid-column: 1;
  font-family: var(--font-display);
  font-size: calc(24px * var(--title-scale));
  letter-spacing: -0.01em;
}

.l-dot {
  color: var(--accent);
}

.l-nav {
  display: flex;
  gap: 22px;
  font: 11px/1.3 var(--font-meta);
  color: var(--muted);
}

.l-header-actions {
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 28px;
}

/* Header controls speak like the nav: muted meta type, no frame, firmer on hover or open. */
.l-menu,
.l-language-select :deep(.ui-select-trigger) {
  gap: 8px;
  padding: 4px 0;
  color: var(--ui-muted);
  font: 11px/1.3 var(--ui-font-meta);
}

.l-menu:hover,
.l-menu[data-state='open'],
.l-language-select :deep(.ui-select-trigger:hover),
.l-language-select :deep(.ui-select-trigger[data-state='open']) {
  color: var(--ui-fg);
}

/* Below the wide layout the three pages fold into one menu beside the language select. */
.l-menu {
  display: none;
  align-items: center;
  min-height: 28px;
  border: 0;
  cursor: pointer;
  transition: color var(--ui-dur) var(--ui-ease);
}

.l-menu svg {
  width: 10px;
  height: 7px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.25;
}

.l-menu:focus-visible {
  outline-offset: 2px;
}

/* Menu portals into the local .ui controls, Select into its own local portal.
   Both remain below this header's scope. Library-generated elements need deep selectors. */
/* One list for both: hairline frame, no radius or shadow, plain rows. */
:deep(.l-menu-list.ui-menu-content),
.l-language-select :deep(.ui-select-content) {
  min-width: 9.5rem;
  padding: 4px 0;
  border-color: var(--ui-line);
  border-radius: 0;
  box-shadow: none;
  font: 11px/1.3 var(--ui-font-meta);
}

:deep(.l-menu-list .ui-menu-item),
.l-language-select :deep(.ui-select-item) {
  position: relative;
  padding: 8px 16px 8px 36px;
  border-radius: 0;
}

/* Rows stay plain: hover and keyboard focus get an underline, not a fill. */
:deep(.l-menu-list .ui-menu-item[data-highlighted]),
.l-language-select :deep(.ui-select-item[data-highlighted]) {
  background: none;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

/* The current row keeps ink text and an accent dot in the left gutter: the checked value, or the current page. */
.l-language-select :deep(.ui-select-item[data-state='checked']) {
  background: none;
  color: var(--ui-fg);
}

:deep(.l-menu-list [aria-current='page'])::before {
  content: '';
}

.l-language-select :deep(.ui-select-item > [aria-hidden='true']),
:deep(.l-menu-list [aria-current='page'])::before {
  position: absolute;
  top: 50%;
  left: 16px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ui-accent);
  transform: translateY(-50%);
}

.l-nav a.router-link-active {
  color: var(--fg);
}

/* The three pages sit beside the centred variant switch; when the two would touch they fold into the menu. */
@media (max-width: 1100px) {
  .l-header-actions > .l-nav {
    display: none;
  }

  .l-menu {
    display: inline-flex;
  }
}

.l-top > :deep(.l-sections) {
  grid-column: 2;
  justify-self: center;
}

/* Preserve the shared selector group here and in SectionNav without a global rule. */
.l-sections :deep(a[aria-current='true']),
.l-nav a:hover,
.l-sections :deep(a:hover) {
  color: var(--fg);
}

.l-top > :deep(.lig-theme-switch) {
  grid-column: 2;
  justify-self: center;
}

.l-controls {
  display: flex;
  gap: 20px;
  justify-self: end;
}

@media (max-width: 860px) {
  .l-header-actions > .l-nav,
  .l-top > :deep(.l-sections) {
    display: none;
  }

  .l-menu {
    display: inline-flex;
  }

  .l-top {
    grid-template-columns: 1fr auto;
    height: auto;
    min-height: 72px;
    gap: 12px;
    padding-block: 16px;
  }

  .l-top > :deep(.lig-theme-switch) {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .l-header-actions {
    grid-column: 2;
    grid-row: 1;
  }
}
/* Transition adds classes to this component's own div. Base and states share
   the same scope and specificity, with enter/leave translate after the base. */
/* The variant switch rests at the bottom edge once the head has scrolled away; the top edge belongs
   to the pinned titles of open sections. */
.l-theme-bar {
  position: fixed;
  bottom: max(16px, env(safe-area-inset-bottom));
  left: 50%;
  z-index: 20;
  translate: -50% 0;
  max-width: calc(100vw - 24px);
  padding: 4px 8px;
  background: var(--bg);
  border: 1px solid var(--line);
}

.theme-bar-enter-active,
.theme-bar-leave-active {
  transition:
    translate 0.6s var(--ease),
    opacity 0.6s var(--ease);
}

.theme-bar-enter-from,
.theme-bar-leave-to {
  opacity: 0;
  translate: -50% calc(100% + 32px);
}

/* Installed: the page returns nothing */
.l-top {
  transition: opacity 1.2s var(--ease);
}

.is-installed .l-top {
  opacity: 0;
  pointer-events: none;
}
</style>
