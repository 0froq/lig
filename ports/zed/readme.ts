import type { BuildMetadata } from '../types'
import { readFileSync } from 'node:fs'
import { ZED_VERSION } from './distribution'

export function zedReadme(metadata: BuildMetadata): string {
  return readFileSync(new URL('./README.md', import.meta.url), 'utf8')
    .replaceAll('{{VERSION}}', ZED_VERSION)
    .replaceAll('{{SOURCE_REF}}', metadata.sourceRef)
}
