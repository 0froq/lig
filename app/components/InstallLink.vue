<script setup lang="ts">
const props = defineProps<{ label?: string }>()
const { product } = useAppConfig()
const link = useKitLink()
const installed = useInstalled()
const copy = useCopy()

const text = computed(() => props.label ?? copy('install.label'))
</script>

<template>
  <NuxtLink
    v-if="product.install.href"
    :to="link(product.install.href)"
  >
    <Fill
      :value="text"
      name="install.label"
      :size="7"
    />
  </NuxtLink>
  <a
    v-else
    href="#"
    @click.prevent="installed = true"
  >
    <Fill
      :value="text"
      name="install.label"
      :size="7"
    />
  </a>
</template>
