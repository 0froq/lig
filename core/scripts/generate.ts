import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { generatePalette } from '../../palette/scripts/generate'
import { createTokenBundle } from '../index'
import { writeArtifact } from './artifact'
import { generateIcons } from './icons'

const check = process.argv.includes('--check')
const path = fileURLToPath(new URL('../generated/tokens.json', import.meta.url))
writeArtifact(path, `${JSON.stringify(createTokenBundle(), null, 2)}\n`, check)
generatePalette(check)
generateIcons(check)
console.log(check ? 'Core and website artifacts match the spec.' : 'Generated core and website artifacts.')
