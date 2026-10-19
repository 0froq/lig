import { defineConfig } from 'void/config'
import cloudflare from './cloudflare.config'

// Keep the working cf deployment as the source of the existing Worker's policy.
const { worker } = cloudflare

export default defineConfig({
  target: 'cloudflare',
  inference: {
    appType: 'static',
    outputDir: 'dist',
    build: 'pnpm exec vp run generate',
  },
  cloudflare: {
    name: worker.name,
    compatibility_date: worker.compatibilityDate,
    observability: worker.observability,
    assets: {
      html_handling: worker.assets.htmlHandling,
      not_found_handling: worker.assets.notFoundHandling,
    },
  },
})
