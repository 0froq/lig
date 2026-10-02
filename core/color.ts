export function rgb(color: string): [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(color))
    throw new Error(`Invalid color: ${color}`)
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ]
}

/** Retain the historical LiG blend convention: encoded sRGB, nearest integer. */
export function blend(first: string, weight: number, second: string): string {
  if (!Number.isFinite(weight) || weight < 0 || weight > 1)
    throw new Error(`Invalid mix weight: ${weight}`)
  const a = rgb(first)
  const b = rgb(second)
  return `#${a.map((channel, i) => Math.round(weight * channel + (1 - weight) * b[i]!).toString(16).padStart(2, '0')).join('')}`
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

export function contrast(first: string, second: string): number {
  const a = luminance(first)
  const b = luminance(second)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
