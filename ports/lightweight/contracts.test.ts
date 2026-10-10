// @env node
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { VARIANTS } from '../../core/resolve'
import { LIGHTWEIGHT_PORTS, lightweightPath } from '../catalog'
import { compileTheme } from '../styles'
import { rgb } from './common'
import { lightweightArtifacts } from './index'

const root = fileURLToPath(new URL('../../dist/ports/lightweight/', import.meta.url))

describe('lightweight tool distributions', () => {
  const outputs = lightweightArtifacts(VARIANTS.map(compileTheme))

  it('ships each tool and variant once, without authoring another palette', () => {
    assert.deepEqual(LIGHTWEIGHT_PORTS.map(port => port.id), ['ghostty', 'fzf', 'zellij', 'tmux', 'starship', 'bat', 'eza'])
    assert.equal(Object.keys(outputs).length, LIGHTWEIGHT_PORTS.length * VARIANTS.length)
    for (const variant of VARIANTS) {
      const theme = compileTheme(variant)
      const allowed = new Set(Object.values(theme.tokens))
      for (const port of LIGHTWEIGHT_PORTS) {
        const path = lightweightPath(port, variant)
        const content = outputs[path]!
        assert.ok(content.endsWith('\n'), `${path}: text file`)
        for (const hex of content.match(/#[a-f0-9]{6}\b/g) ?? [])
          assert.ok(allowed.has(hex), `${path}: color ${hex} must come from the selected core`)
        assert.equal(readFileSync(join(root, path), 'utf8'), content)
      }
    }
  })

  for (const variant of VARIANTS) {
    it(`${variant}: preserves terminal slots and color-only config boundaries`, () => {
      const theme = compileTheme(variant)
      const ghostty = outputs[`ghostty/lig-${variant}`]!
      const pairs = Object.fromEntries(ghostty.split('\n').filter(line => line.startsWith('palette = ')).map(line => line.slice(10).split('=')))
      assert.equal(Object.keys(pairs).length, 16)
      for (let index = 0; index < 16; index++)
        assert.equal(pairs[index], theme.tokens[`terminal.ansi.${index}`])
      for (const key of ['background', 'foreground'])
        assert.ok(ghostty.includes(`${key} = ${theme.tokens[`terminal.${key}`]}\n`))
      assert.doesNotMatch(ghostty, /^(?:font|keybind|window|command|theme|config-file)/m)
      const fzf = outputs[`fzf/lig-${variant}.fzfrc`]!
      assert.match(fzf, new RegExp(`^--color=${theme.mode},`))
      assert.equal(fzf.trim().split('\n').length, 1)
      assert.ok(fzf.includes(`fg:${theme.tokens['text.primary']}`))
      assert.ok(fzf.includes(`bg+:${theme.tokens['surface.selection']}`))
      const tmux = outputs[`tmux/lig-${variant}.conf`]!
      assert.doesNotMatch(tmux, /(?:bind-key|status-left|status-right|status-format|run-shell|source-file)/)
      const starship = outputs[`starship/lig-${variant}.toml`]!
      assert.equal((starship.match(/^\[/gm) ?? []).length, 1)
      assert.ok(starship.includes(`green = "${theme.tokens['terminal.ansi.2']}"`))
      assert.ok(starship.includes(`purple = "${theme.tokens['accent.magenta.base']}"`))
      const zellij = outputs[`zellij/lig-${variant}.kdl`]!
      assert.equal((zellij.match(/player_\d+ /g) ?? []).length, 10)
      const triples = new Set(Object.values(theme.tokens).map(rgb))
      for (const match of zellij.matchAll(/(?:base|background|emphasis_\d|player_\d+) (\d+ \d+ \d+)/g))
        assert.ok(triples.has(match[1]!), `Zellij RGB must resolve from ${variant}`)
      const bat = outputs[`bat/LiG-${variant}.tmTheme`]!
      for (const token of ['syntax.variable', 'syntax.keyword'])
        assert.ok(bat.includes(`<key>foreground</key><string>${theme.tokens[token]}</string>`))
      assert.notEqual(theme.tokens['syntax.variable'], theme.tokens['syntax.keyword'])
      assert.ok(bat.includes('<key>scope</key>'))
    })
  }

  it('serves exactly the checksummed distribution bytes', () => {
    const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8')) as { files: Record<string, string> }
    const publicRoot = fileURLToPath(new URL('../../public/ports/', import.meta.url))
    for (const [path, checksum] of Object.entries(manifest.files)) {
      const bytes = readFileSync(join(root, path))
      assert.equal(createHash('sha256').update(bytes).digest('hex'), checksum)
      assert.deepEqual(readFileSync(join(publicRoot, path)), bytes)
    }
    assert.deepEqual(readFileSync(join(publicRoot, 'manifest.json')), readFileSync(join(root, 'manifest.json')))
  })
})
