import type { Oklch } from './types'

type Triple = [number, number, number]
const ACHROMATIC = 1e-7
const GAMUT_EPSILON = 1e-7

export function rgb(color: string): Triple {
  if (!/^#[0-9a-f]{6}$/i.test(color))
    throw new Error(`Invalid color: ${color}`)
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ]
}

export function validateOklch(color: Oklch): void {
  if (!color || !Number.isFinite(color.l) || color.l < 0 || color.l > 1
    || !Number.isFinite(color.c) || color.c < 0
    || (color.h === null ? color.c !== 0 : !Number.isFinite(color.h) || color.h < 0 || color.h >= 360)) {
    throw new Error(`Invalid OKLCH color: ${JSON.stringify(color)}`)
  }
}

function unit(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1)
    throw new Error(`Invalid ${name}: ${value}`)
}

function decode(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function encode(channel: number): number {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055
}

function toLab({ l, c, h }: Oklch): Triple {
  const angle = (h ?? 0) * Math.PI / 180
  return [l, c * Math.cos(angle), c * Math.sin(angle)]
}

function fromLab([l, a, b]: Triple): Oklch {
  const c = Math.hypot(a, b)
  return { l: Math.max(0, Math.min(1, l)), c: c < ACHROMATIC ? 0 : c, h: c < ACHROMATIC ? null : (Math.atan2(b, a) * 180 / Math.PI + 360) % 360 }
}

// Direct sRGB/OKLab matrices from Björn Ottosson's public-domain reference:
// https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab
export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = rgb(hex).map(channel => decode(channel / 255)) as Triple
  const x = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const y = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const z = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return fromLab([
    0.2104542553 * x + 0.7936177850 * y - 0.0040720468 * z,
    1.9779984951 * x - 2.4285922050 * y + 0.4505937099 * z,
    0.0259040371 * x + 0.7827717662 * y - 0.8086757660 * z,
  ])
}

function linearRgb(color: Oklch): Triple {
  const [l, a, b] = toLab(color)
  const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const z = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3
  return [
    4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
    -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
    -0.0041960863 * x - 0.7034186147 * y + 1.7076147010 * z,
  ]
}

function inGamut(color: Oklch): boolean {
  return linearRgb(color).every(channel => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON)
}

/** Strict sRGB boundary, constant L/H, binary chroma reduction. Not CSS local-MINDE. */
export function mapToSrgb(color: Oklch): Oklch {
  validateOklch(color)
  if (color.l === 0 || color.l === 1)
    return { l: color.l, c: 0, h: null }
  if (inGamut(color))
    return color
  let low = 0
  let high = color.c
  for (let i = 0; i < 32; i++) {
    const c = (low + high) / 2
    if (inGamut({ ...color, c }))
      low = c
    else
      high = c
  }
  return { ...color, c: low }
}

export function oklchToHex(color: Oklch): string {
  const channels = linearRgb(mapToSrgb(color))
  return `#${channels.map(channel => Math.round(encode(Math.max(0, Math.min(1, channel))) * 255).toString(16).padStart(2, '0')).join('')}`
}

export function mixOklab(first: Oklch, weight: number, second: Oklch): Oklch {
  validateOklch(first)
  validateOklch(second)
  unit(weight, 'mix weight')
  if (weight === 1)
    return first
  if (weight === 0)
    return second
  const a = toLab(first)
  const b = toLab(second)
  return fromLab(a.map((channel, i) => weight * channel + (1 - weight) * b[i]!) as Triple)
}

/** Change L/C while keeping the source hue; a neutral target cannot tint an accent. */
export function rampOklch(source: Oklch, target: Oklch, lightness: number, chroma: number): Oklch {
  validateOklch(source)
  validateOklch(target)
  unit(lightness, 'ramp lightness')
  unit(chroma, 'ramp chroma')
  const c = source.c * chroma
  return { l: source.l + (target.l - source.l) * lightness, c, h: c === 0 ? null : source.h }
}

/** Fixed perceptual steps, independent of the distance to foreground/background. */
export function offsetOklch(source: Oklch, lightness: number, chroma: number): Oklch {
  validateOklch(source)
  if (!Number.isFinite(lightness) || !Number.isFinite(chroma))
    throw new Error('Invalid OKLCH offset')
  const c = source.c + chroma
  const color = { l: source.l + lightness, c, h: c === 0 ? null : source.h }
  validateOklch(color)
  return color
}

/** Hex compatibility boundary for runtime consumers; interpolation is now OKLab. */
export function blend(first: string, weight: number, second: string): string {
  return oklchToHex(mixOklab(hexToOklch(first), weight, hexToOklch(second)))
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map(channel => decode(channel / 255)) as Triple
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(first: string, second: string): number {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/**
 * APCA Lc contrast, using the 0.0.98G-4g constants from apca-w3.
 * The first color is text and the second color is its background; positive
 * values are dark text on a light background and negative values are light
 * text on a dark background.
 */
export function apcaContrast(text: string, background: string): number {
  const textY = apcaLuminance(text)
  const backgroundY = apcaLuminance(background)
  const deltaY = backgroundY - textY
  if (Math.abs(deltaY) < 0.0005)
    return 0

  if (backgroundY > textY) {
    const sapc = (backgroundY ** 0.56 - textY ** 0.57) * 1.14
    return sapc < 0.1 ? 0 : (sapc - 0.027) * 100
  }

  const sapc = (backgroundY ** 0.65 - textY ** 0.62) * 1.14
  return sapc > -0.1 ? 0 : (sapc + 0.027) * 100
}

function apcaLuminance(color: string): number {
  const [r, g, b] = rgb(color).map(channel => channel / 255) as Triple
  let luminance = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.0721750 * b ** 2.4
  if (luminance < 0.022)
    luminance += (0.022 - luminance) ** 1.414
  return luminance
}
