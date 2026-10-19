// @env node
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vite-plus/test'
import { VARIANTS } from '../../core/resolve'
import { LIGHTWEIGHT_PORTS, lightweightArchivePath, lightweightPath } from '../catalog'
import { compileTheme } from '../styles'
import { zip } from '../zip'
import { rgb } from './common'
import { lightweightArtifacts } from './index'

const root = fileURLToPath(new URL('../../dist/ports/lightweight/', import.meta.url))

describe('lightweight tool distributions', () => {
  const outputs = lightweightArtifacts(VARIANTS.map(compileTheme))

  it('ships each tool and variant once, without authoring another palette', () => {
    assert.deepEqual(LIGHTWEIGHT_PORTS.map(port => port.id), ['ghostty', 'iterm2', 'windows-terminal', 'fzf', 'zellij', 'tmux', 'starship', 'bat', 'eza'])
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
      const wtAnsi = ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white', 'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightPurple', 'brightCyan', 'brightWhite']
      const wt = JSON.parse(outputs[`windows-terminal/lig-${variant}.json`]!) as Record<string, string>
      assert.equal(wt.name, `LiG ${variant.split('-').map(word => word[0]!.toUpperCase() + word.slice(1)).join(' ')}`)
      assert.equal(wt.background, theme.tokens['terminal.background'])
      assert.equal(wt.foreground, theme.tokens['terminal.foreground'])
      assert.equal(wt.cursorColor, theme.tokens['terminal.cursor'])
      assert.equal(wt.selectionBackground, theme.tokens['terminal.selection'])
      for (const [index, key] of wtAnsi.entries())
        assert.equal(wt[key], theme.tokens[`terminal.ansi.${index}`])
      for (const key of wtAnsi)
        assert.match(wt[key]!, /^#[a-f0-9]{6}$/)
      const iterm = outputs[`iterm2/lig-${variant}.itermcolors`]!
      assert.match(iterm, /^<\?xml version="1.0"/)
      for (let index = 0; index < 16; index++)
        assert.ok(iterm.includes(`<key>Ansi ${index} Color</key>`))
      for (const key of ['Background Color', 'Foreground Color', 'Cursor Color', 'Cursor Text Color', 'Selection Color', 'Selected Text Color', 'Bold Color', 'Link Color'])
        assert.ok(iterm.includes(`<key>${key}</key>`))
      assert.ok(iterm.includes(`<key>Color Space</key><string>sRGB</string>`))
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

  for (const portId of ['iterm2', 'windows-terminal'] as const) {
    it(`bundles all ${portId} variants and the license`, () => {
      const port = LIGHTWEIGHT_PORTS.find(port => port.id === portId)!
      const entries = Object.fromEntries(VARIANTS.map(variant => [lightweightPath(port, variant), outputs[lightweightPath(port, variant)]!]))
      entries.LICENSE = readFileSync(new URL('../../LICENSE', import.meta.url), 'utf8')
      assert.deepEqual(readFileSync(join(root, lightweightArchivePath(port))), zip(entries))
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
    const downloads = JSON.parse(readFileSync(join(publicRoot, 'manifest.json'), 'utf8')) as { files: Record<string, string> }
    for (const [path, checksum] of Object.entries(manifest.files))
      assert.equal(downloads.files[path], checksum)
  })
})
