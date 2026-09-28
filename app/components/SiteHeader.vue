<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const link = useKitLink()
const { sections, current, pinned } = usePageSections()
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
    <SectionNav
      v-if="sections.length"
      :sections="sections"
      :current="current"
    />
    <nav class="l-nav">
      <NuxtLink
        v-for="item in product.nav"
        :key="item.to"
        :to="link(item.to)"
      >
        {{ t(item.label) }}
      </NuxtLink>
    </nav>
    <Transition name="section-bar">
      <div
        v-if="pinned && sections.length"
        class="l-section-bar"
      >
        <SectionNav
          :sections="sections"
          :current="current"
        />
      </div>
    </Transition>
  </header>
</template>
