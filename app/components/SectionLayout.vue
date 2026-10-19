<script setup lang="ts">
withDefaults(defineProps<{
  /** Open the banner. Closing it collapses the height so the body does not jump. */
  banner?: boolean
}>(), {
  banner: true,
})
const slots = useSlots()
</script>

<template>
  <div
    class="l-section-layout lig-ui ui"
    :class="{ 'is-single': !slots.nav }"
  >
    <div
      v-if="slots.nav"
      class="l-section-nav"
    >
      <slot name="nav" />
    </div>
    <div
      class="l-section-main"
      :class="{ 'is-plain': !banner }"
    >
      <div
        class="l-banner"
        :class="{ 'is-open': banner }"
      >
        <div
          class="l-banner-clip"
          :inert="banner ? undefined : true"
        >
          <slot name="banner" />
        </div>
      </div>
      <div class="l-section-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-section-layout {
  display: grid;
  grid-template-columns: clamp(10.5rem, 16vw, 12rem) minmax(0, 1fr);
  align-items: start;
  gap: clamp(24px, 4vw, 56px);
  min-height: 100dvh;
  padding-inline: var(--pad);
}

/* Without a margin the column centres, so the page keeps its weight in the middle. */
.l-section-layout.is-single {
  grid-template-columns: minmax(0, 1fr);
  box-sizing: content-box;
  max-width: 42rem;
  margin-inline: auto;
}

.l-section-nav {
  position: sticky;
  top: 0;
  min-width: 0;
  /* As tall as its contents, so it stays pinned until the column below it ends. */
  max-height: 100dvh;
  padding: 112px 0 24px;
  overflow: auto;
}

.l-section-main {
  min-width: 0;
  transition: padding-top 0.35s var(--ease);
}

.l-section-main.is-plain {
  padding-top: 112px;
}

.l-section-body {
  padding-top: clamp(48px, 8vh, 96px);
  transition: padding-top 0.35s var(--ease);
}

.l-section-main.is-plain .l-section-body {
  padding-top: 0;
}

.l-banner {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease);
}

.l-banner.is-open {
  grid-template-rows: 1fr;
}

.l-banner-clip {
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 860px) {
  .l-section-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--gap);
  }

  .l-section-nav {
    position: static;
    width: 100%;
    height: auto;
    overflow: visible;
  }
}
</style>
