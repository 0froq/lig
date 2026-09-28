import type { ProductConfig } from './types'

export default defineAppConfig({
  product: {
    name: 'LiG',
    mark: '.',
    theme: {
      light: {
        bg: '#f4f2ec',
        fg: '#1a1917',
        muted: '#85837c',
        faint: '#cfccc3',
        line: 'rgba(26, 25, 23, 0.12)',
        accent: '#6aca9a',
      },
      dark: {
        bg: '#111113',
        fg: '#f2f0ea',
        muted: '#918f88',
        faint: '#32312d',
        line: 'rgba(242, 240, 234, 0.1)',
        accent: '#6aca9a',
      },
    },
    signature: { paper: true, line: true, hand: true, bloom: true, pointer: { dwell: 'wash', click: 'wash', dwellAfter: 1.2 } },
    install: { href: '/#downloads' },
    nav: [
      { label: 'nav.syntax', to: '/#syntax' },
      { label: 'nav.palette', to: '/#palette' },
      { label: 'nav.downloads', to: '/#downloads' },
    ],
  } satisfies ProductConfig,
})
