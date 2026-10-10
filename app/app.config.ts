import type { ProductConfig } from './types'
import { resolveVariant } from '../core'

export default defineAppConfig({
  product: {
    name: 'LiG',
    mark: '.',
    theme: {
      light: {
        bg: resolveVariant('light-paper').tokens['surface.canvas']!,
        fg: '#1a1917',
        muted: '#85837c',
        faint: '#cfccc3',
        line: 'rgba(26, 25, 23, 0.12)',
        accent: resolveVariant('light').tokens['accent.primary']!,
      },
      dark: {
        bg: resolveVariant('dark-paper').tokens['surface.canvas']!,
        fg: '#f2f0ea',
        muted: '#918f88',
        faint: '#32312d',
        line: 'rgba(242, 240, 234, 0.1)',
        accent: resolveVariant('dark').tokens['accent.primary']!,
      },
    },
    signature: { paper: true, line: true, hand: true, bloom: true, pointer: { dwell: false, click: false, dwellAfter: 1.2 } },
    install: { href: '/#downloads' },
    nav: [],
  } satisfies ProductConfig,
})
