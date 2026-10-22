<script setup lang="ts">
import { CodeBlock, CopyButton } from '@froq/ui'
import { VARIANT_OPTIONS } from '~/utils/lig-variant'
import { resolveVariant } from '../../../core'
import { PACKAGE_VERSION } from '../../../ports/constants'
import { highlightSource } from '../../utils/highlight-code'

const { t } = useI18n()
const { variant } = useLigVariant()
const resolved = computed(() => resolveVariant(variant.value))
const codeStyle = computed(() => ({
  '--ui-bg': resolved.value.tokens['surface.canvas'],
  '--ui-fg': resolved.value.tokens['text.primary'],
  '--ui-muted': resolved.value.tokens['text.secondary'],
  '--ui-line': resolved.value.tokens['border.default'],
  '--ui-accent': resolved.value.tokens['accent.primary'],
}))

const nvimSetup = computed(
  () => `{
  "0froq/lig.nvim",
  lazy = false,
  priority = 1000,
  opts = { style = "${variant.value}" },
  config = function(_, opts)
    require("lig").setup(opts)
    vim.cmd.colorscheme("lig")
  end,
}`,
)
const nvimSpans = computed(() => highlightSource(nvimSetup.value, 'lua', variant.value))
</script>

<template>
  <div class="lig-ports lig-ui ui">
    <section
      class="lig-port"
      aria-labelledby="port-nvim"
    >
      <h3
        id="port-nvim"
        class="lig-port-title"
      >
        <img
          class="lig-project-icon"
          src="https://avatars.githubusercontent.com/u/6471485?s=80&v=4"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        />
        <a
          href="https://github.com/0froq/lig.nvim"
          target="_blank"
          rel="noopener noreferrer"
          >lig.nvim for Neovim</a
        >
      </h3>
      <CodeBlock
        label="init.lua"
        :style="codeStyle"
        :spans="nvimSpans"
      >
        <template #action>
          <CopyButton
            :text="nvimSetup"
            :label="t('palette.downloads.copySetup')"
            :copied-label="t('install.copied')"
            :error-label="t('palette.downloads.agentCopyError')"
            :pending-label="t('palette.downloads.agentCopyPending')"
          />
        </template>
      </CodeBlock>
    </section>
    <section
      class="lig-port"
      aria-labelledby="port-vscode"
    >
      <h3
        id="port-vscode"
        class="lig-port-title"
      >
        <img
          class="lig-project-icon is-mark"
          src="https://code.visualstudio.com/assets/branding/code-stable.png"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        />
        <a
          href="https://github.com/0froq/vscode-theme-LiG"
          target="_blank"
          rel="noopener noreferrer"
          >LiG Theme for Code</a
        >
      </h3>
      <p class="lig-port-actions">
        <a
          class="lig-install-link"
          href="https://marketplace.visualstudio.com/items?itemName=froQ.theme-lig"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t('palette.downloads.vscodeMarket') }} ↗</a
        >
        <a
          class="lig-install-link"
          :href="`https://github.com/0froq/vscode-theme-LiG/releases/tag/v${PACKAGE_VERSION}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t('palette.downloads.vscodeVsix') }} ↗</a
        >
      </p>
    </section>
    <section
      class="lig-port"
      aria-labelledby="port-zed"
    >
      <h3
        id="port-zed"
        class="lig-port-title"
      >
        <img
          class="lig-project-icon"
          src="https://avatars.githubusercontent.com/u/79345384?s=80&v=4"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        />
        <a
          href="https://github.com/0froq/zed-theme-LiG"
          target="_blank"
          rel="noopener noreferrer"
          >LiG for Zed</a
        >
      </h3>
      <SlidingUnderline
        class="lig-port-variants"
        role="group"
        :active="variant"
        aria-labelledby="port-zed"
      >
        <DownloadLink
          v-for="option in VARIANT_OPTIONS"
          :key="option.id"
          :data-slide="option.id"
          :href="`/ports/zed/lig-${option.id}.json`"
          :download="`lig-${option.id}.json`"
          :class="{ 'is-current': variant === option.id }"
          :aria-current="variant === option.id ? 'true' : undefined"
        >
          {{ $t(option.label) }}
        </DownloadLink>
        <DownloadLink
          class="lig-port-all"
          href="/ports/zed/lig-zed-all.zip"
          download="lig-zed-all.zip"
        >
          {{ $t('palette.downloads.all') }}
        </DownloadLink>
      </SlidingUnderline>
      <a
        class="lig-install-link"
        href="https://github.com/0froq/zed-theme-LiG#install"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('palette.downloads.install') }} ↗
      </a>
    </section>
  </div>
  <section
    class="lig-lightweight"
    aria-labelledby="lightweight-title"
  >
    <h3
      id="lightweight-title"
      class="lig-group"
    >
      {{ $t('palette.downloads.lightweight') }}
    </h3>
    <a
      class="lig-install-link"
      href="/ports/README.md"
      target="_blank"
      rel="noopener noreferrer"
      >{{ $t('palette.downloads.install') }} ↗</a
    >
    <PaletteLightweight />
    <p class="lig-port-manifest">
      <DownloadLink
        href="/ports/manifest.json"
        download="lig-ports-manifest.json"
      >
        Manifest · SHA-256
      </DownloadLink>
    </p>
  </section>
  <PaletteAgentSetup />
</template>

<style scoped>
.lig-group {
  margin: 48px 0 0;
  font-family: var(--font-meta);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.lig-ports {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
  margin-top: 40px;
}

.lig-port {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 10px;
  padding-inline-start: 16px;
  border-inline-start: 4px solid var(--line);
}

.lig-port-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  line-height: 1;
}

.lig-project-icon {
  flex: none;
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 3px;
}

.lig-project-icon.is-mark {
  border-radius: 0;
}

.lig-port-title a:hover {
  color: var(--accent);
}

.lig-port :deep(h3),
.lig-port :deep(p) {
  margin: 0;
}

.lig-port :deep(.ui-code-block) {
  margin-top: 6px;
}

.lig-port-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.lig-port-actions .lig-install-link {
  margin-top: 4px;
}

.lig-port .lig-port-variants {
  margin-top: 10px;
  font: 12px/1.6 var(--font-meta);
}

.lig-install-link {
  align-self: flex-start;
  width: max-content;
  margin-top: 14px;
  color: var(--muted);
  font: 12px/1.5 var(--font-meta);
  text-decoration: none;
  border-bottom: 1px solid var(--line);
  transition:
    color 0.35s var(--ease),
    border-color 0.35s var(--ease);
}

.lig-install-link:hover {
  color: var(--fg);
  border-bottom-color: currentColor;
}

.lig-port-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.lig-port-variants :deep(a) {
  color: var(--muted);
  transition: color 0.3s var(--ease);
}

.lig-port-variants :deep(a.is-current) {
  color: var(--fg);
}

.lig-port-variants :deep(.lig-download-symbol) {
  color: var(--muted);
  font-size: 0.85em;
}

.lig-port-variants :deep(.lig-port-all) {
  margin-left: auto;
  color: var(--fg);
}

.lig-port :deep(a:hover),
.lig-port-manifest :deep(a:hover) {
  color: var(--accent);
}

.lig-port :deep(a:focus-visible),
.lig-port-manifest :deep(a:focus-visible) {
  outline: 1px solid var(--accent);
  outline-offset: 4px;
}

.lig-lightweight {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  margin-top: 48px;
  padding-inline-start: 16px;
  border-inline-start: 4px solid var(--line);
}

.lig-lightweight .lig-group {
  margin: 0;
  font-weight: 400;
}

.lig-port-manifest {
  margin: 12px 0 0;
  color: var(--muted);
  font: 11px/1.5 var(--font-meta);
}

@media (max-width: 860px) {
  .lig-port-variants :deep(.lig-port-all) {
    margin-left: 0;
  }
}
</style>
