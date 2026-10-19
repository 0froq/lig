import { defineConfig } from 'cf/config'
import voidConfig from './void.config.ts'

// Native branch previews and the production fallback until Void cutover is accepted.
const { cloudflare } = voidConfig

export default defineConfig({
  worker: {
    name: cloudflare.name,
    compatibilityDate: cloudflare.compatibility_date,
    observability: cloudflare.observability,
    assets: {
      htmlHandling: cloudflare.assets.html_handling,
      notFoundHandling: cloudflare.assets.not_found_handling,
    },
  },
})
