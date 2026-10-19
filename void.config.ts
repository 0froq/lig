import { defineConfig } from 'void/config'

export default defineConfig({
  target: 'cloudflare',
  inference: {
    appType: 'static',
    outputDir: 'dist',
    build: 'pnpm exec vp run generate',
  },
  cloudflare: {
    name: 'lig',
    routes: [{ pattern: 'lig.froq.me', custom_domain: true }],
    workers_dev: true,
    preview_urls: true,
    compatibility_date: '2026-10-12',
    observability: {
      enabled: true,
      traces: { enabled: true },
    },
    assets: {
      html_handling: 'drop-trailing-slash',
      not_found_handling: '404-page',
    },
  },
})
