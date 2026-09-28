import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { formats } from '../src/convert'
import { baseSwatches, buildVariant, cssVarName, semanticRoles, VARIANTS } from '../src/nvim-build'

const root = dirname(fileURLToPath(import.meta.url))
const outDir = join(root, '../generated')

mkdirSync(outDir, { recursive: true })

interface TokenFile {
  meta: { generated: string, variants: string[] }
  variants: Record<string, {
    base: ReturnType<typeof baseSwatches>
    semantic: ReturnType<typeof semanticRoles>
    resolved: Record<string, string>
  }>
}

const tokenFile: TokenFile = {
  meta: {
    generated: new Date().toISOString(),
    variants: [...VARIANTS],
  },
  variants: {},
}

function flattenResolved(style: typeof VARIANTS[number]): Record<string, string> {
  const built = buildVariant(style)
  const flat: Record<string, string> = {}
  for (const [k, v] of Object.entries(built)) {
    if (typeof v === 'string' && v !== 'NONE') {
      flat[k] = v
    }
    else if (Array.isArray(v) && typeof v[0] === 'string' && !k.includes('rainbow')) {
      flat[k] = v.join(',')
    }
    else if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [sk, sv] of Object.entries(v)) {
        if (typeof sv === 'string')
          flat[`${k}.${sk}`] = sv
      }
    }
  }
  return flat
}

for (const variant of VARIANTS) {
  tokenFile.variants[variant] = {
    base: baseSwatches(variant),
    semantic: semanticRoles(variant),
    resolved: flattenResolved(variant),
  }
}

writeFileSync(join(outDir, 'tokens.json'), `${JSON.stringify(tokenFile, null, 2)}\n`)

const cssLines: string[] = [':root {']
for (const variant of VARIANTS) {
  const resolved = tokenFile.variants[variant].resolved
  for (const [key, hex] of Object.entries(resolved)) {
    if (hex.includes(','))
      continue
    cssLines.push(`  ${cssVarName(variant, key)}: ${hex};`)
  }
}
cssLines.push('}', '')
writeFileSync(join(outDir, 'tokens.css'), `${cssLines.join('\n')}\n`)

const scssLines: string[] = []
for (const variant of VARIANTS) {
  scssLines.push(`// ${variant}`)
  const resolved = tokenFile.variants[variant].resolved
  for (const [key, hex] of Object.entries(resolved)) {
    if (hex.includes(','))
      continue
    scssLines.push(`$lig-${variant.replace(/-/g, '_')}-${key.replace(/[._]/g, '-')}: ${hex};`)
  }
  scssLines.push('')
}
writeFileSync(join(outDir, 'tokens.scss'), `${scssLines.join('\n')}\n`)

const tailwind: Record<string, Record<string, string>> = {}
for (const variant of VARIANTS) {
  tailwind[variant] = {}
  for (const sw of baseSwatches(variant)) {
    const f = formats(sw.hex)
    tailwind[variant][sw.name] = f.hex
  }
}
writeFileSync(join(outDir, 'tailwind-colors.json'), `${JSON.stringify(tailwind, null, 2)}\n`)

console.log('Wrote palette/generated/*')
