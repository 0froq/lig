import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Every file lives under a locale folder (`en/`, `zh/`), so paths start with `/en`, `/zh`.
export default defineContentConfig({
  collections: {
    // Free-form pages built from MDC blocks: the landing (`index.md`), install, anything else
    pages: defineCollection({
      type: 'page',
      source: {
        include: '*/**/*.md',
        exclude: ['*/notes/**', '*/changelog/**', '*/docs/**'],
      },
      schema: z.object({
        kicker: z.string().optional(),
        // Page head with a big title and ruled lede; the landing turns it off and uses `::hero`
        head: z.boolean().default(true),
        // Whether the pen runs through this page
        line: z.boolean().default(true),
      }),
    }),
    notes: defineCollection({
      type: 'page',
      source: '*/notes/*.md',
      schema: z.object({
        date: z.string(),
      }),
    }),
    changelog: defineCollection({
      type: 'page',
      source: '*/changelog/*.md',
      schema: z.object({
        version: z.string(),
        date: z.string(),
      }),
    }),
    // Numeric prefixes (`1.install.md`) order the sidebar and are dropped from the path
    docs: defineCollection({
      type: 'page',
      source: '*/docs/**/*.md',
    }),
  },
})
