<script setup lang="ts">
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
  'palette/generated/tokens.json',
  'palette/generated/tokens.css',
  'palette/generated/tokens.scss',
  'palette/generated/tailwind-colors.json',
]
</script>

<template>
  <ul class="lig-downloads">
    <li
      v-for="item in links"
      :key="item.href"
    >
      <a
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
      >{{ $t(item.title) }}</a>
      <span class="lig-download-note">{{ $t(item.note) }}</span>
    </li>
  </ul>
  <p class="lig-download-files-title">
    {{ $t('palette.downloads.tokens') }}
  </p>
  <ul class="lig-download-files">
    <li
      v-for="file in files"
      :key="file"
    >
      <code>{{ file }}</code>
    </li>
  </ul>
</template>
