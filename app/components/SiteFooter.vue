<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const home = computed(() => {
  const path = localePath('/')
  return route.path === path || route.path === `${path}/`
})
</script>

<template>
  <footer
    class="l-foot"
    :class="{ 'is-measure': home }"
  >
    <div class="l-foot-row">
      <p class="l-foot-line">
        <Copy
          k="site.footer"
          :size="16"
        />
      </p>
      <nav class="l-foot-links">
        <a
          href="https://github.com/0froq/lig/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >{{ $t('site.license') }}</a>
        <a
          href="https://github.com/0froq/lig"
          target="_blank"
          rel="noopener noreferrer"
        >{{ $t('site.source') }}</a>
      </nav>
    </div>
  </footer>
</template>
