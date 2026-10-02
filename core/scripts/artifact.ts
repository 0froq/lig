import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export function writeArtifact(path: string, content: string, check: boolean): void {
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content)
      throw new Error(`Stale generated artifact: ${path}. Run pnpm tokens:generate.`)
    return
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}
