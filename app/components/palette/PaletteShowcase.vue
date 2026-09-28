<script setup lang="ts">
const { t } = useI18n()
const { variant, swatches, semantics } = useLigVariant()
</script>

<template>
  <section class="l-hero lig-hero">
    <h1
      class="l-word"
      :style="{ '--len': 3 }"
      aria-label="LiG"
    >
      <span data-anchor="word">LiG</span><span
        class="l-mark"
        data-anchor="mark"
      >.</span>
    </h1>
    <div
      class="l-hero-foot"
      data-anchor="rule"
    >
      <p
        class="l-tagline"
        data-anchor="tagline"
        lang="en"
      >
        {{ t('palette.hero.tagline') }}
      </p>
      <p class="lig-hero-lede">
        {{ t('palette.hero.lede') }}
      </p>
    </div>
  </section>

  <section
    id="variants"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.variants') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.variantsTitle') }}
      </h2>
      <PaletteVariantTabs v-model:variant="variant" />
      <p class="lig-note">
        {{ t('palette.variantHint') }}
      </p>
    </div>
  </section>

  <section
    id="swatches"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.swatches') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.swatchesTitle') }}
      </h2>
      <div class="lig-swatch-grid">
        <PaletteSwatch
          v-for="sw in swatches"
          :key="sw.name"
          :name="sw.name"
          :hex="sw.hex"
          :variant="variant"
        />
      </div>
    </div>
  </section>

  <section
    id="semantic"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.semantic') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.semanticTitle') }}
      </h2>
      <PaletteSemanticTable
        :variant="variant"
        :rows="semantics"
      />
    </div>
  </section>

  <section
    id="previews"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.previews') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.previewsTitle') }}
      </h2>
      <PalettePreviews :variant="variant" />
    </div>
  </section>

  <section
    id="downloads"
    class="l-section"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      {{ t('palette.sections.downloads') }}
    </p>
    <div class="l-body">
      <h2 class="l-title">
        {{ t('palette.sections.downloadsTitle') }}
      </h2>
      <PaletteDownloads />
    </div>
  </section>
</template>
