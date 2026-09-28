import { rgb } from './util'

export interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
}

export function normalizeHex(hex: string): string {
  const h = hex.toLowerCase()
  if (h === 'none')
    return h
  return h.startsWith('#') ? h : `#${h}`
}

export function hexToRgbString(hex: string): string {
  if (hex.toLowerCase() === 'none')
    return 'transparent'
  const [r, g, b] = rgb(normalizeHex(hex))
  return `rgb(${r}, ${g}, ${b})`
}

export function hexToHslString(hex: string): string {
  if (hex.toLowerCase() === 'none')
    return 'transparent'
  const [ri, gi, bi] = rgb(normalizeHex(hex))
  const r = ri / 255
  const g = gi / 255
  const b = bi / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min)
    return `hsl(0, 0%, ${Math.round(l * 100)}%)`
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0)
      break
    case g:
      h = (b - r) / d + 2
      break
    default:
      h = (r - g) / d + 4
  }
  h /= 6
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export function formats(hex: string): ColorFormats {
  const normalized = normalizeHex(hex)
  return {
    hex: normalized,
    rgb: hexToRgbString(normalized),
    hsl: hexToHslString(normalized),
  }
}
