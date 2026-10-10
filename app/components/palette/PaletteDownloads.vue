<script setup lang="ts">
import { LIGHTWEIGHT_PORTS, lightweightPath } from '../../../ports/catalog'

const { variant } = useLigVariant()

const links = [
  {
    title: 'palette.downloads.nvim',
    href: 'https://github.com/0froq/lig.nvim',
    note: 'palette.downloads.nvimNote',
  },
  {
    title: 'palette.downloads.vscode',
    href: 'https://github.com/0froq/vscode-theme-LiG',
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
      <span class="lig-port-title">{{ $t(item.title) }}</span>
      <span class="lig-port-note">{{ $t(item.note) }}</span>
    </a>
  </div>
  <p class="lig-group">
    {{ $t('palette.downloads.lightweight') }} · {{ variant }}
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
  <ul class="lig-files lig-port-downloads">
    <li
      v-for="port in LIGHTWEIGHT_PORTS"
      :key="port.id"
    >
      <a
        :href="`/ports/${lightweightPath(port, variant)}`"
        :download="lightweightPath(port, variant).split('/').pop()"
      >
        <span>{{ port.title }}</span><code>{{ lightweightPath(port, variant).split('/').pop() }}</code><span aria-hidden="true">↓</span>
      </a>
    </li>
    <li>
      <a
        href="/ports/manifest.json"
        download="lig-ports-manifest.json"
      ><span>Manifest</span><code>SHA-256</code><span aria-hidden="true">↓</span></a>
    </li>
  </ul>
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
