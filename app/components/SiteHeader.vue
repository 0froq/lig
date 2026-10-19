<script setup lang="ts">
import type { MenuItem } from '@froq/ui/vue'
import { DropdownMenu, Select } from '@froq/ui'

const { product } = useAppConfig()
const { t, locale, locales } = useI18n()
const { status } = useLocaleStatus()
const switchLocalePath = useSwitchLocalePath()
const languageOptions = computed(() => locales.value.map((item) => {
  const name = item.name ?? item.code
  return {
    value: item.code,
    label: status(item.code) === 'wip' ? t('site.wipLanguage', { language: name }) : name,
  }
}))
const language = computed({
  get: () => locale.value,
  set: (value: string) => {
    void changeLanguage(value)
  },
})
const link = useKitLink()
const route = useRoute()
const pinned = ref(false)
const menuItems = computed<MenuItem[]>(() => product.nav.map(item => ({ value: item.to, label: t(item.label) })))
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
  if (!language || language.code === locale.value)
    return
  const path = switchLocalePath(language.code)
  if (path)
    await navigateTo(path)
}

function onScroll(): void {
  // Shown once the head is gone, and put away again at the foot of the page so it never covers the footer
  const { scrollY, innerHeight } = window
  pinned.value = scrollY > 220 && scrollY + innerHeight < document.documentElement.scrollHeight - 160
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
        <DropdownMenu
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
        </DropdownMenu>
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
            <span :lang="locales.find(l => l.code === option.value)?.language">{{ option.label }}</span>
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
