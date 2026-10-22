<script setup lang="ts">
import InstallLink from '../InstallLink.vue'

// The closing line. Its full stop is where the pen ends and the last colour lands.
withDefaults(
  defineProps<{
    id?: string
    title?: string | null
    /** Name drawn on the title block while `title` is empty. */
    titleName?: string
    lede?: string
    cta?: boolean
    /** A quieter sign-off for inner pages: smaller, no call to action. */
    end?: boolean
  }>(),
  { id: undefined, title: null, titleName: 'final.title', lede: undefined, cta: true },
)
</script>

<template>
  <section
    :id="id"
    class="l-final"
    :class="{ 'is-end': end }"
  >
    <h2
      class="l-final-title"
      data-anchor="final"
    >
      <Stop
        :text="title"
        :name="titleName"
        anchor="final-mark"
        :size="8"
      />
    </h2>
    <p
      v-if="lede != null"
      class="l-lede"
    >
      <Fill
        v-if="!isFilled(lede)"
        name="final.lede"
        :size="24"
      />
      <RichText
        v-else
        :text="lede"
      />
    </p>
    <slot />
    <CtaLink
      v-if="cta && !end"
      :as="InstallLink"
    />
  </section>
</template>

<style scoped>
.l-final {
  display: grid;
  justify-items: center;
  gap: 20px;
  padding: clamp(180px, 34svh, 360px) var(--pad);
  text-align: center;
}

.l-final .l-lede {
  margin: 0 0 16px;
}

.l-final.is-end {
  padding: clamp(160px, 30svh, 320px) var(--pad);
}

.l-final.is-end .l-final-title {
  font-size: calc(clamp(48px, 6.4vw, 104px) * var(--display-scale));
}
</style>

<style>
/* Keep the global Chinese typography group more specific than this base rule. */
.l-final-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: calc(clamp(64px, 10vw, 168px) * var(--display-scale));
  line-height: 0.9;
  letter-spacing: -0.035em;
}
</style>
