<script setup lang="ts">
import { VARIANT_OPTIONS } from '~/utils/lig-variant'
import { LIGHTWEIGHT_PORTS, lightweightArchivePath, lightweightPath } from '../../../ports/catalog'

const { variant } = useLigVariant()

// GitHub project avatars; individual-owned repositories use their owner's avatar.
const portIcons = {
  ghostty: '169223740',
  fzf: '700826',
  zellij: '73778475',
  tmux: '12054114',
  starship: '49654870',
  bat: '4209276',
  eza: '141388427',
}

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

const files = [
  'tokens.json',
  'tokens.css',
  'tokens.scss',
  'tailwind-colors.json',
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
        <img
          class="lig-project-icon"
          :src="`https://avatars.githubusercontent.com/u/${portIcons[port.id]}?s=80&v=4`"
          alt=""
          width="24"
          height="24"
          loading="lazy"
          decoding="async"
        >
        {{ port.title }}
      </h3>
      <div
        class="lig-port-variants"
        role="group"
        :aria-labelledby="`port-${port.id}`"
      >
        <a
          v-for="option in VARIANT_OPTIONS"
          :key="option.id"
          :href="`/ports/${lightweightPath(port, option.id)}`"
          :download="lightweightPath(port, option.id).split('/').pop()"
          :title="lightweightPath(port, option.id).split('/').pop()"
          :class="{ 'is-current': variant === option.id }"
          :aria-current="variant === option.id ? 'true' : undefined"
        >{{ $t(option.label) }} <span aria-hidden="true">↓</span></a>
        <a
          class="lig-port-all"
          :href="`/ports/${lightweightArchivePath(port)}`"
          :download="lightweightArchivePath(port).split('/').pop()"
        >{{ $t('palette.downloads.all') }} <span aria-hidden="true">↓</span></a>
      </div>
    </li>
  </ul>
  <p class="lig-port-manifest">
    <a
      href="/ports/manifest.json"
      download="lig-ports-manifest.json"
    >Manifest · SHA-256 <span aria-hidden="true">↓</span></a>
  </p>
  <PaletteAgentSetup />
  <p class="lig-group">
    {{ $t('palette.downloads.tokens') }}
  </p>
  <ul class="lig-files">
    <li
      v-for="file in files"
      :key="file"
    >
      <code>palette/generated/{{ file }}</code>
    </li>
  </ul>
</template>
