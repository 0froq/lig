<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const link = useKitLink()
const pinned = ref(false)

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
    <PaletteThemeSwitch />
    <nav class="l-nav">
      <NuxtLink
        v-for="item in product.nav"
        :key="item.to"
        :to="link(item.to)"
      >
        {{ t(item.label) }}
      </NuxtLink>
    </nav>
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
