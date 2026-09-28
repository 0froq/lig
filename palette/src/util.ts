/** Blend helpers — ported from lig.nvim `lua/lig/util.lua` / vscode-theme-LiG `scripts/util.ts`. */

const blendContext = {
  bg: '#000000',
  fg: '#ffffff',
}

export function setBlendContext(next: { bg: string, fg: string }): void {
  blendContext.bg = next.bg
  blendContext.fg = next.fg
}

export function rgb(color: string): [number, number, number] {
  const c = color.toLowerCase()
  return [
    Number.parseInt(c.slice(1, 3), 16),
    Number.parseInt(c.slice(3, 5), 16),
    Number.parseInt(c.slice(5, 7), 16),
  ]
}

export function blend(foreground: string, alpha: number, background: string): string {
  const bgRgb = rgb(background)
  const fgRgb = rgb(foreground)
  const blendChannel = (i: 0 | 1 | 2): number => {
    const result = alpha * fgRgb[i] + (1 - alpha) * bgRgb[i]
    return Math.floor(Math.min(Math.max(0, result), 255) + 0.5)
  }
  return `#${blendChannel(0).toString(16).padStart(2, '0')}${blendChannel(1).toString(16).padStart(2, '0')}${blendChannel(2).toString(16).padStart(2, '0')}`
}

export function blendBg(hex: string, amount: number, background?: string): string {
  return blend(hex, amount, background ?? blendContext.bg)
}

export function blendFg(hex: string, amount: number, foreground?: string): string {
  return blend(hex, amount, foreground ?? blendContext.fg)
}
