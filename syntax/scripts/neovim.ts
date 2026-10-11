import type { SyntaxDocument } from '../types'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import manifest from '../manifest.json'

export type Language = keyof typeof manifest.languages
const root = fileURLToPath(new URL('../', import.meta.url))

export function parseSources(sources: { language: Language, filename: string, source: string }[]) {
  const installation = process.env.NVIM_TREESITTER_DIR || join(homedir(), '.local/share/nvim/lazy/nvim-treesitter')
  const temporary = mkdtempSync(join(tmpdir(), 'lig-syntax-'))
  try {
    const documents = sources.map((sample) => {
      const language = manifest.languages[sample.language]
      const revision = readFileSync(join(installation, 'parser-info', `${sample.language}.revision`), 'utf8').trim()
      if (revision !== language.parserRevision)
        throw new Error(`${sample.language} parser revision mismatch: expected ${language.parserRevision}, got ${revision}`)
      return {
        ...sample,
        parser: join(installation, 'parser', `${sample.language}.so`),
        query: language.queries.map(name => readFileSync(join(root, 'queries', name, 'highlights.scm'), 'utf8')).join('\n'),
      }
    })
    const output = join(temporary, 'output.json')
    const input = join(temporary, 'input.json')
    writeFileSync(input, JSON.stringify({ documents, output }))
    execFileSync(process.env.NVIM_BIN || 'nvim', ['--clean', '--headless', '-l', join(root, 'scripts/parse.lua'), input], { timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] })
    const result = JSON.parse(readFileSync(output, 'utf8')) as { neovim: string, documents: SyntaxDocument[] }
    if (result.neovim !== manifest.neovim)
      throw new Error(`Neovim version mismatch: expected ${manifest.neovim}, got ${result.neovim}`)
    return {
      schemaVersion: 1,
      ...result,
      provenance: {
        queryRepository: manifest.queryRepository,
        queryRevision: manifest.queryRevision,
        languages: Object.fromEntries(Object.entries(manifest.languages).map(([name, language]) => [name, {
          parserRepository: language.parserRepository,
          parserRevision: language.parserRevision,
          queries: language.queries.map(query => ({
            name: query,
            sha256: createHash('sha256').update(readFileSync(join(root, 'queries', query, 'highlights.scm'))).digest('hex'),
          })),
        }])),
      },
    }
  }
  finally {
    rmSync(temporary, { recursive: true, force: true })
  }
}
