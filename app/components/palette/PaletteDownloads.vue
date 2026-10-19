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

const nvimSetup = computed(() => `{
  "0froq/lig.nvim",
  lazy = false,
  priority = 1000,
  opts = { style = "${variant.value}" },
  config = function(_, opts)
    require("lig").setup(opts)
    vim.cmd.colorscheme("lig")
  end,
}`)
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
        >
        <a
          href="https://github.com/0froq/lig.nvim"
          target="_blank"
          rel="noopener noreferrer"
        >lig.nvim for Neovim</a>
      </h3>
      <CodeBlock
        label="init.lua"
        :style="codeStyle"
        :spans="nvimSpans"
      >
        <template #action>
          <CopyButton
            class="lig-copy-action"
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
        >
        <a
          href="https://github.com/0froq/vscode-theme-LiG"
          target="_blank"
          rel="noopener noreferrer"
        >LiG Theme for Code</a>
      </h3>
      <p class="lig-port-actions">
        <a
          class="lig-install-link"
          href="https://marketplace.visualstudio.com/items?itemName=froQ.theme-lig"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t('palette.downloads.vscodeMarket') }} ↗</a>
        <a
          class="lig-install-link"
          :href="`https://github.com/0froq/vscode-theme-LiG/releases/tag/v${PACKAGE_VERSION}`"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t('palette.downloads.vscodeVsix') }} ↗</a>
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
        >
        <a
          href="https://github.com/0froq/zed-theme-LiG"
          target="_blank"
          rel="noopener noreferrer"
        >LiG for Zed</a>
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
    >{{ $t('palette.downloads.install') }} ↗</a>
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
