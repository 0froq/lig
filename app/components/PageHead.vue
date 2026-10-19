<script setup lang="ts">
// Head of an inner page: a large title whose stop blooms, over a ruled line the pen draws
const props = withDefaults(
  defineProps<{
    kicker?: string | null
    kickerName?: string
    title?: string | null
    titleName?: string
    lede?: string | null
    ledeName?: string
    long?: boolean
    /** Section heads own their inset, typography and metadata layout. */
    variant?: 'poster' | 'section'
    /** @deprecated Use variant="section" */
    compact?: boolean
    /** Render the trailing accent stop after the title. */
    stop?: boolean
  }>(),
  {
    kicker: null,
    kickerName: 'kicker',
    title: null,
    titleName: 'title',
    lede: null,
    ledeName: 'lede',
    variant: 'poster',
    compact: false,
    stop: true,
  },
)

const section = computed(() => props.variant === 'section' || props.compact)
</script>

<template>
  <section
    class="l-page-head"
    :class="{ 'is-section': section }"
  >
    <h1
      class="l-page-title"
      :class="{ 'is-long': long }"
    >
      <Stop
        v-if="stop"
        :text="title"
        :name="titleName"
        fallback="."
        :size="long ? 12 : 5"
      />
      <Fill
        v-else
        :value="title"
        :name="titleName"
        :size="long ? 12 : 5"
      />
    </h1>
    <div
      class="l-page-foot"
      data-anchor="rule"
    >
      <p class="l-kicker">
        <slot name="kicker">
          <Fill
            :value="kicker"
            :name="kickerName"
            :size="8"
          />
        </slot>
      </p>
      <p
        v-if="lede != null"
        class="l-lede"
      >
        <Fill
          :value="lede"
          :name="ledeName"
          :size="28"
        />
      </p>
      <p
        v-if="$slots.meta"
        class="l-meta"
      >
        <slot name="meta" />
      </p>
    </div>
  </section>
</template>
