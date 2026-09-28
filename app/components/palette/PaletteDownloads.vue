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
