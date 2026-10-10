import { Buffer } from 'node:buffer'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'
import { resolveVariant, VARIANTS } from '../index'
import { writeArtifact } from './artifact'

// Row-major 3 × 3: 1 struct, 4 ref, 7 mono (the elbow), 8 action.
const pixels = [
  { x: 0, y: 0, family: 'struct' },
  { x: 0, y: 1, family: 'ref' },
  { x: 0, y: 2, family: 'mono' },
  { x: 1, y: 2, family: 'action' },
] as const

function colorsFor(variant: typeof VARIANTS[number]) {
  const { tokens } = resolveVariant(variant)
  return pixels.map(pixel => tokens[`family.${pixel.family}.base`]!)
}

function svg(colors: string[], dark?: string[]): string {
  const style = dark
    ? `<style>@media(prefers-color-scheme:dark){${pixels.map((_, i) => `.p${i}{fill:${dark[i]}}`).join('')}}</style>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 3" shape-rendering="crispEdges"><title>LiG</title>${style}${pixels.map((pixel, i) => `<rect class="p${i}" x="${pixel.x}" y="${pixel.y}" width="1" height="1" fill="${colors[i]}"/>`).join('')}</svg>\n`
}

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type), data])
  const size = Buffer.alloc(4)
  size.writeUInt32BE(data.length)
  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(body))
  return Buffer.concat([size, body, checksum])
}

/** Render the four integer cells directly into transparent RGBA, without a raster dependency. */
function png(colors: string[], size: number): Buffer {
  const stride = 1 + size * 4
  const scanlines = Buffer.alloc(stride * size)
  const rgb = colors.map(hex => [1, 3, 5].map(start => Number.parseInt(hex.slice(start, start + 2), 16)))
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = pixels.findIndex(pixel => pixel.x === Math.floor(x * 3 / size) && pixel.y === Math.floor(y * 3 / size))
      if (cell < 0)
        continue
      const offset = y * stride + 1 + x * 4
      scanlines.set([...rgb[cell]!, 255], offset)
    }
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(scanlines)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

export function generateIcons(check: boolean): void {
  const output = (name: string, content: string | Uint8Array) => writeArtifact(fileURLToPath(new URL(`../../public/${name}`, import.meta.url)), content, check)
  for (const variant of VARIANTS) {
    const colors = colorsFor(variant)
    output(`brand/lig-${variant}.svg`, svg(colors))
    output(`brand/lig-${variant}.png`, png(colors, 512))
  }
  const light = colorsFor('light')
  output('brand/lig.svg', svg(light, colorsFor('dark')))
  output('brand/lig.png', png(light, 512))
  output('favicon.svg', svg(light, colorsFor('dark')))
  output('favicon.png', png(light, 32))
  output('apple-touch-icon.png', png(light, 180))
  output('icon-192.png', png(light, 192))
  output('icon-512.png', png(light, 512))
}
