<script setup lang="ts">
import { Select } from '@froq/ui'

const { product } = useAppConfig()
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const languageOptions = computed(() => locales.value.map(l => ({ value: l.code, label: l.name ?? l.code })))
const language = computed({
  get: () => locale.value,
  set: (value: string) => {
    void changeLanguage(value)
  },
})
const link = useKitLink()
const route = useRoute()
const isNotes = computed(() => /^\/(?:zh\/)?notes(?:\/|$)/.test(route.path))
const pinned = ref(false)

async function changeLanguage(value: string): Promise<void> {
  const language = locales.value.find(l => l.code === value)
  if (!language || language.code === locale.value)
    return
  const path = switchLocalePath(language.code)
  if (path)
    await navigateTo(path)
}

function onScroll(): void {
  pinned.value = window.scrollY > 220
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
    <PaletteThemeSwitch :tone-only="isNotes" />
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
        v-if="pinned && !isNotes"
        class="l-theme-bar"
      >
        <PaletteThemeSwitch />
      </div>
    </Transition>
  </header>
</template>
