<script setup lang="ts">
import { VARIANT_OPTIONS } from '~/utils/lig-variant'
import { LIGHTWEIGHT_PORTS, lightweightArchivePath, lightweightPath } from '../../../ports/catalog'

const { variant } = useLigVariant()

const links = [
  {
    title: 'palette.downloads.nvim',
    href: 'https://github.com/0froq/lig.nvim',
    icon: 'https://avatars.githubusercontent.com/u/6471485?s=80&v=4',
    note: 'palette.downloads.nvimNote',
  },
  {
    title: 'palette.downloads.vscode',
    href: 'https://github.com/0froq/vscode-theme-LiG',
    icon: 'https://raw.githubusercontent.com/microsoft/vscode/main/resources/linux/code.png',
    note: 'palette.downloads.vscodeNote',
  },
]
</script>

<template>
  <div class="lig-ports">
    <a
      v-for="item in links"
      :key="item.href"
      class="lig-port"
      :href="item.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="lig-port-title">
        <img
          class="lig-project-icon"
          :src="item.icon"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        >
        <span>{{ $t(item.title) }}</span>
      </span>
      <span class="lig-port-note">{{ $t(item.note) }}</span>
    </a>
    <section
      class="lig-port lig-port-zed"
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
        >zed-theme-LiG (Zed) ↗</a>
      </h3>
      <p class="lig-port-note">
        {{ $t('palette.downloads.zedNote') }}
      </p>
      <div
        class="lig-port-variants"
        role="group"
        aria-labelledby="port-zed"
      >
        <DownloadLink
          v-for="option in VARIANT_OPTIONS"
          :key="option.id"
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
      </div>
      <a
        class="lig-port-install"
        href="https://github.com/0froq/zed-theme-LiG#install"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('palette.downloads.install') }} ↗
      </a>
    </section>
  </div>
  <p class="lig-group">
    {{ $t('palette.downloads.lightweight') }}
  </p>
  <p class="lig-aside">
    {{ $t('palette.downloads.lightweightNote') }}
    <a
      href="/ports/README.md"
      target="_blank"
      rel="noopener noreferrer"
      class="lig-oklch-note-link"
    >{{ $t('palette.downloads.install') }} ↗</a>
  </p>
  <ul class="lig-port-downloads">
    <li
      v-for="port in LIGHTWEIGHT_PORTS"
      :key="port.id"
    >
      <h3 :id="`port-${port.id}`">
        {{ port.title }}
      </h3>
      <div
        class="lig-port-variants"
        role="group"
        :aria-labelledby="`port-${port.id}`"
      >
        <DownloadLink
          v-for="option in VARIANT_OPTIONS"
          :key="option.id"
          :href="`/ports/${lightweightPath(port, option.id)}`"
          :download="lightweightPath(port, option.id).split('/').pop()"
          :title="lightweightPath(port, option.id).split('/').pop()"
          :class="{ 'is-current': variant === option.id }"
          :aria-current="variant === option.id ? 'true' : undefined"
        >
          {{ $t(option.label) }}
        </DownloadLink>
        <DownloadLink
          class="lig-port-all"
          :href="`/ports/${lightweightArchivePath(port)}`"
          :download="lightweightArchivePath(port).split('/').pop()"
        >
          {{ $t('palette.downloads.all') }}
        </DownloadLink>
      </div>
    </li>
  </ul>
  <p class="lig-port-manifest">
    <DownloadLink
      href="/ports/manifest.json"
      download="lig-ports-manifest.json"
    >
      Manifest · SHA-256
    </DownloadLink>
  </p>
  <PaletteAgentSetup />
</template>
