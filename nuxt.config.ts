import { readdirSync, readFileSync, realpathSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { countCardWords } from '@froq/og-covers-layer/card-words'
import { VARIANTS } from './core/resolve'
import { documentationThemes } from './shared/documentation-themes'
import { keepEmptyTitle } from './shared/empty-title'
import { markFinalStop } from './shared/final-mark'
import { listPublicShareImages } from './shared/public-files'
import { IMAGE_ORIGIN, SITE_ORIGIN } from './shared/site'
import { themePreferenceScript } from './shared/theme-preference'

const requireUI = createRequire(
  realpathSync(fileURLToPath(new URL('./node_modules/@froq/ui/package.json', import.meta.url))),
)

// `status` lives on the locale file. The client message compiler drops keys that
// `t()` never touches, so the browser must not read it from the message catalog.
function localeStatus(): Record<string, string> {
  const dir = fileURLToPath(new URL('./i18n/locales', import.meta.url))
  const status: Record<string, string> = {}
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.json')) continue
    const file = JSON.parse(readFileSync(join(dir, name), 'utf8')) as { status?: unknown }
    if (typeof file.status === 'string') status[name.slice(0, -'.json'.length)] = file.status
  }
  return status
}

export default defineNuxtConfig({
  extends: ['@froq/og-covers-layer'],

  compatibilityDate: '2026-09-19',

  alias: {
    '#palette': fileURLToPath(new URL('./palette/src', import.meta.url)),
    // The vendored library is editable source, not an immutable node_modules dependency.
    '@froq/ui/core': fileURLToPath(new URL('./vendor/ui/src/core/index.ts', import.meta.url)),
    '@froq/ui/vue': fileURLToPath(new URL('./vendor/ui/src/vue/index.ts', import.meta.url)),
    '@froq/ui/style.css': fileURLToPath(new URL('./vendor/ui/src/style.css', import.meta.url)),
    '@froq/ui/tokens.css': fileURLToPath(new URL('./vendor/ui/src/tokens.css', import.meta.url)),
    '@froq/ui': fileURLToPath(new URL('./vendor/ui/src/index.ts', import.meta.url)),
    // Resolve the library's own dependencies from its installed package under pnpm.
    'reka-ui': dirname(dirname(requireUI.resolve('reka-ui'))),
    '@internationalized/date': dirname(dirname(requireUI.resolve('@internationalized/date'))),
  },

  hooks: {
    // Notes and docs have no `::final`; the stop that ends the text blooms instead.
    // An explicit `title: ''` must stay empty: Content otherwise names the page after the file.
    'content:file:afterParse': ({ file, content, collection }) => {
      keepEmptyTitle(content, file.body)
      if (typeof file.body === 'string')
        (content as { words?: number }).words = countCardWords(file.body)
      if (collection.name === 'notes' || collection.name === 'docs') markFinalStop(content.body)
    },
  },

  runtimeConfig: {
    public: {
      publicFiles: listPublicShareImages(),
      localeStatus: localeStatus(),
    },
  },

  // DevTools hosts the OG Image tab (template hot reload). The host package is not a module.
  devtools: { enabled: true },

  // `og:image` is absolute on this origin. `og:url` stays on lig.froq.me via useShareMeta.
  // X does not fetch images from froq.me.
  site: {
    url: IMAGE_ORIGIN,
    name: 'lig',
  },

  modules: ['@nuxt/content', '@nuxtjs/i18n'],

  css: [
    '@froq/ui/style.css',
    '@fontsource-variable/geist/index.css',
    '@fontsource-variable/geist-mono/index.css',
    '@fontsource/instrument-serif/400.css',
    '@fontsource/instrument-serif/400-italic.css',
    '~/assets/css/kit.css',
    '~/assets/css/ui.css',
    '~/assets/css/palette.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml', key: 'favicon' },
        { rel: 'icon', href: '/favicon.png', type: 'image/png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [{ name: 'color-scheme', content: 'light dark' }],
      // Picks the theme before first paint so the paper never flashes the wrong stock
      script: [
        {
          tagPosition: 'head',
          innerHTML: themePreferenceScript(VARIANTS),
        },
      ],
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: documentationThemes(),
          langs: ['ts', 'js', 'vue', 'bash', 'json', 'yaml', 'md'],
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    // Image generation uses the Worker origin; app.vue normalizes document SEO URLs.
    baseUrl: IMAGE_ORIGIN,
  },

  nitro: {
    // Workers Builds sets WORKERS_CI=1, which makes Nitro pick a Cloudflare
    // preset, emit `/* /404.html 404` in `_redirects`, and 404 the home page.
    preset: 'static',
    output: {
      publicDir: 'dist',
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/zh',
        '/notes',
        '/zh/notes',
        '/docs',
        '/zh/docs',
        '/install',
        '/zh/install',
        '/changelog',
        '/zh/changelog',
        '/lab',
        '/zh/lab',
      ],
    },
    hooks: {
      'prerender:generate': function (route) {
        // Nuxt emits these as client shells, so app/error.vue does not supply their head.
        if (route.route === '/404.html' || route.route === '/200.html') {
          route.contents = route.contents
            ?.replace('<html>', '<html lang="en-US" dir="ltr">')
            .replace(
              '</head>',
              `<title>${route.route === '/404.html' ? '404 — LiG' : 'LiG'}</title><meta name="robots" content="noindex, follow"></head>`,
            )
        }
      },
      'prerender:done': async function ({ prerenderedRoutes }) {
        // Use emitted canonical URLs so redirects, errors and noindex pages stay out.
        const urls = new Set<string>()
        for (const route of prerenderedRoutes) {
          if (!route.fileName?.endsWith('.html') || route.error || route.skip) continue
          const html = await readFile(join('dist', route.fileName), 'utf8')
          if (/<meta\b[^>]+name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue
          const canonical = html.match(/<link\b[^>]+rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
          if (canonical === SITE_ORIGIN || canonical?.startsWith(`${SITE_ORIGIN}/`))
            urls.add(canonical)
        }
        const entries = [...urls]
          .sort()
          .map(url => `  <url><loc>${url}</loc></url>`)
          .join('\n')
        await writeFile(
          'dist/sitemap.xml',
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
        )
        await writeFile(
          'dist/robots.txt',
          `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
        )
      },
    },
  },

  typescript: { strict: true },

  build: { transpile: ['@froq/ui'] },
})
