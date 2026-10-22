<script setup lang="ts">
import { Banner } from '@froq/ui'

const { product } = useAppConfig()
const { t } = useI18n()
const { current } = useLocaleStatus()
const installed = useInstalled()
const { variant } = useLigVariant()
useHead(() => ({
  link: [
    { rel: 'icon', href: `/brand/lig-${variant.value}.svg`, type: 'image/svg+xml', key: 'favicon' },
  ],
}))

// `inert` off must be absent, not "false"
const hidden = computed(() => installed.value || undefined)
const banner = useTemplateRef('banner')
let bannerBox: ResizeObserver | undefined

function bannerRoot(): HTMLElement | undefined {
  const root = banner.value && '$el' in banner.value ? banner.value.$el : undefined
  return root instanceof HTMLElement ? root : undefined
}

function placeThemeBar(): void {
  if (!import.meta.client) return
  const height = bannerRoot()?.getBoundingClientRect().height ?? 0
  document.documentElement.style.setProperty('--banner-h', `${height}px`)
}

function observeBanner(): void {
  bannerBox?.disconnect()
  const root = bannerRoot()
  if (root) {
    bannerBox ??= new ResizeObserver(placeThemeBar)
    bannerBox.observe(root)
  }
  placeThemeBar()
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') installed.value = false
}

watch(banner, observeBanner, { flush: 'post' })

onMounted(() => {
  addEventListener('keydown', onKey)
  watch(installed, on => document.documentElement.classList.toggle('is-installed', on), {
    immediate: true,
  })
  observeBanner()
})
onBeforeUnmount(() => {
  removeEventListener('keydown', onKey)
  bannerBox?.disconnect()
  document.documentElement.style.removeProperty('--banner-h')
})
</script>

<template>
  <Paper class="l-site">
    <a
      class="l-skip"
      href="#main"
      >{{ t('site.skip') }}</a
    >
    <Banner
      v-if="current === 'wip'"
      ref="banner"
      class="lig-ui ui"
      :label="t('site.wip')"
      :inert="hidden"
    >
      {{ t('site.wipNotice') }}
    </Banner>
    <div class="l-frame">
      <SiteHeader :inert="hidden" />
      <main
        id="main"
        :inert="hidden"
      >
        <slot />
      </main>
      <SiteFooter :inert="hidden" />
    </div>
    <Installed v-if="!product.install.href" />
  </Paper>
</template>

<style scoped>
/* Content sits above the paper; each sheet is its own stacking context so the pen's
   canvas (z-index -1 inside it) draws under the type but over the paper */
.l-site {
  position: relative;
  z-index: 1;
}

.l-frame {
  position: relative;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  width: 100%;
  /* Nothing inside may widen the page. `clip` does not make a scroll container, so sticky still works. */
  overflow-x: clip;
}

.l-skip {
  position: absolute;
  top: 12px;
  left: var(--pad);
  z-index: 20;
  padding: 6px 10px;
  background: var(--bg);
  font-size: 13px;
  translate: 0 -200%;
}

.l-skip:focus {
  translate: 0;
}

/* Installed: the page returns nothing */
main {
  transition: opacity 1.2s var(--ease);
}

.is-installed main {
  opacity: 0;
  pointer-events: none;
}
</style>

<style>
/* The layout toggles this class on html, outside every component scope. */
.is-installed {
  overflow: hidden;
}
</style>
