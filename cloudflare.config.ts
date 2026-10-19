import { defineConfig } from 'cf/config'
import voidConfig from './void.config.ts'

// Only used by native branch previews. Production is deployed by Void.
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
