import type { Buffer } from 'node:buffer'
import type { BuildMetadata, ThemeIR } from '../types'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { distributionTools, storeFiles } from '../distribution'
import { zedFamily } from './emit'
import { zedReadme } from './readme'

export const ZED_REPOSITORY = 'https://github.com/0froq/zed-theme-LiG'
export const ZED_VERSION = '0.1.3'
export const ZED_SOURCE_REF = 'codex/zed-inherit-font-weight'

/** Native repository payload; authoring and palette remain in the LiG compiler. */
export function zedDistribution(themes: ThemeIR[], metadata: BuildMetadata): Record<string, string | Buffer> {
  const files: Record<string, string | Buffer> = {
    ...distributionTools(),
    ...storeFiles('zed'),
    'extension.toml': `id = "lig-theme"\nname = "LiG"\nversion = "${ZED_VERSION}"\nschema_version = 1\nauthors = ["0froq"]\ndescription = "LiG editor themes: Light, Dark, Light Paper and Dark Paper"\nrepository = "${ZED_REPOSITORY}"\n`,
    'README.md': zedReadme({ ...metadata, sourceRef: ZED_SOURCE_REF }),
    'LICENSE': readFileSync(new URL('../licenses/Apache-2.0.txt', import.meta.url), 'utf8'),
  }
  for (const theme of themes)
    files[`themes/lig-${theme.variant}.json`] = `${JSON.stringify(zedFamily([theme]), null, 2)}\n`
  files['lig-build.json'] = `${JSON.stringify({
    ...metadata,
    sourceRef: ZED_SOURCE_REF,
    port: 'zed',
    packageVersion: ZED_VERSION,
    distributionRepository: ZED_REPOSITORY,
    files: Object.fromEntries(Object.entries(files).map(([path, content]) => [path, createHash('sha256').update(content).digest('hex')])),
  }, null, 2)}\n`
  return files
}
