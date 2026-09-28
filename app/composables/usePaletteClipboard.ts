import type { LigVariant } from '#palette/nvim-build'
import { formats, normalizeHex } from '#palette/convert'
import { cssVarName } from '#palette/nvim-build'

export type CopyFormat = 'hex' | 'rgb' | 'hsl' | 'css'

export function usePaletteClipboard() {
  const { t } = useI18n()
  const format = useState<CopyFormat>('lig-copy-format', () => 'hex')
  const copied = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copyValue(text: string, token?: string): Promise<void> {
    if (!import.meta.client)
      return
    await navigator.clipboard?.writeText(text)
    copied.value = token ?? text
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = null), 1600)
  }

  function labelFor(format: CopyFormat): string {
    return t(`palette.copy.${format}`)
  }

  function textFor(hex: string, format: CopyFormat, variant: LigVariant, token?: string): string {
    const f = formats(hex)
    switch (format) {
      case 'hex':
        return f.hex
      case 'rgb':
        return f.rgb
      case 'hsl':
        return f.hsl
      case 'css':
        return token ? `var(${cssVarName(variant, token)})` : `var(--lig-${normalizeHex(hex).slice(1)})`
      default: {
        const _exhaustive: never = format
        return _exhaustive
      }
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { format, copied, copyValue, labelFor, textFor }
}
