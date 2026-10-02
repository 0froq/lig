import type { LigVariant } from '../../core'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spec } from '../../core'
import { writeArtifact } from '../../core/scripts/artifact'
import { formats } from '../src/convert'
import { baseSwatches, buildVariant, cssVarName, semanticRoles, VARIANTS } from '../src/nvim-build'

const root = dirname(fileURLToPath(import.meta.url))
const outDir = join(root, '../generated')

interface TokenFile {
  meta: { coreVersion: string, variants: string[] }
  variants: Record<LigVariant, {
    base: ReturnType<typeof baseSwatches>
    semantic: ReturnType<typeof semanticRoles>
    resolved: Record<string, string>
  }>
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
  // Swatch copy names must also exist in the generated CSS/SCSS exports.
  for (const swatch of baseSwatches(style))
    flat[swatch.name] = swatch.hex
  return flat
}

export function generatePalette(check: boolean): void {
  const tokenFile: TokenFile = {
    meta: {
      coreVersion: spec.version,
      variants: [...VARIANTS],
    },
    variants: Object.fromEntries(VARIANTS.map(variant => [variant, {
      base: baseSwatches(variant),
      semantic: semanticRoles(variant),
      resolved: flattenResolved(variant),
    }])) as TokenFile['variants'],
  }

  writeArtifact(join(outDir, 'tokens.json'), `${JSON.stringify(tokenFile, null, 2)}\n`, check)

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
  writeArtifact(join(outDir, 'tokens.css'), `${cssLines.join('\n')}\n`, check)

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
  writeArtifact(join(outDir, 'tokens.scss'), `${scssLines.join('\n')}\n`, check)

  const tailwind: Record<string, Record<string, string>> = {}
  for (const variant of VARIANTS) {
    tailwind[variant] = {}
    for (const sw of baseSwatches(variant)) {
      const f = formats(sw.hex)
      tailwind[variant][sw.name] = f.hex
    }
  }
  writeArtifact(join(outDir, 'tailwind-colors.json'), `${JSON.stringify(tailwind, null, 2)}\n`, check)
}
