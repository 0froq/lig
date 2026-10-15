<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const link = useKitLink()
</script>

<template>
  <footer class="l-foot">
    <span><Copy
      k="site.footer"
      :size="24"
    /></span>
    <nav class="l-nav">
      <NuxtLink
        v-for="item in product.nav"
        :key="item.to"
        :to="link(item.to)"
      >
        {{ t(item.label) }}
      </NuxtLink>
    </nav>
  </footer>
</template>
