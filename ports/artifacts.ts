import { existsSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'

/** Remove only obsolete files owned by the previous build, never unmanaged files. */
export function pruneArtifacts(output: string, current: Readonly<Record<string, unknown>>, check: boolean): void {
  const manifest = join(output, 'manifest.json')
  if (!existsSync(manifest))
    return
  const previous = JSON.parse(readFileSync(manifest, 'utf8')) as { files: Record<string, string> }
  const root = `${resolve(output)}${sep}`
  const obsolete = Object.keys(previous.files).filter(path => !Object.hasOwn(current, path)).map((path) => {
    const target = resolve(output, path)
    if (!target.startsWith(root))
      throw new Error(`Artifact outside output directory: ${path}`)
    return target
  })
  for (const target of obsolete) {
    if (!existsSync(target))
      continue
    if (check)
      throw new Error(`Obsolete generated artifact: ${target}. Run pnpm ports:generate.`)
    rmSync(target)
  }
}
