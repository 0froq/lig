// @env node
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { VARIANTS } from '../../core/resolve'
import { CAPTURE_ROLES } from '../neovim/bindings'
import { compileTheme, requireStyle, requireToken } from '../styles'
import { ZED_REPOSITORY, ZED_SOURCE_REF, ZED_VERSION } from './distribution'
import { ZED_SYNTAX, zedFamily } from './emit'
import parity from './fixtures/capture-parity.json'

describe('Zed editor distribution', () => {
  const themes = VARIANTS.map(compileTheme)

  it('preserves Neovim semantic intent for audited native query captures', () => {
    for (const example of parity.cases) {
      const source = parity.sources[example.language as keyof typeof parity.sources]
      assert.ok(source.captures.includes(example.capture), `${example.language}: absent query capture`)
      // Zed resolves dotted captures using the longest dot-delimited theme prefix.
      let capture = example.capture
      while (!ZED_SYNTAX[capture] && capture.includes('.'))
        capture = capture.slice(0, capture.lastIndexOf('.'))
      const role = ZED_SYNTAX[capture]
      const expectedRole = CAPTURE_ROLES[example.neovimCapture]
      const label = `${example.language}/${example.meaning}: @${example.capture}`
      assert.ok(role, `${label}: no theme fallback`)
      assert.equal(role, expectedRole, label)
      const expected = requireStyle(expectedRole!)
      for (const theme of themes) {
        const syntax = zedFamily([theme]).themes[0]!.style.syntax[capture]!
        assert.equal(syntax.color, requireToken(theme, expected.foreground ?? 'text.primary'), label)
        assert.equal(syntax.font_style, expected.italic ? 'italic' : 'normal', label)
        assert.equal(syntax.font_weight, expected.bold ? 700 : null, label)
      }
    }
  })

  it('ships four distinct names with correct native appearance and shared color provenance', () => {
    const family = zedFamily(themes)
    assert.equal(new Set(family.themes.map(theme => theme.name)).size, 4)
    family.themes.forEach((native, index) => {
      const theme = themes[index]!
      assert.equal(native.appearance, theme.mode)
      const colors = new Set(Object.values(theme.tokens))
      for (const color of JSON.stringify(native.style).match(/#[a-f0-9]{6}(?:[a-f0-9]{2})?\b/g) ?? [])
        assert.ok(colors.has(color.slice(0, 7)), `${theme.variant}: unexpected color ${color}`)
      const style = native.style as Record<string, unknown>
      assert.equal(style['editor.background'], theme.tokens['surface.canvas'])
      assert.equal(style['terminal.background'], theme.tokens['terminal.background'])
      const names = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
      names.forEach((name, slot) => {
        assert.equal(style[`terminal.ansi.${name}`], theme.tokens[`terminal.ansi.${slot}`])
        assert.equal(style[`terminal.ansi.bright_${name}`], theme.tokens[`terminal.ansi.${slot + 8}`])
      })
      assert.equal(native.style.syntax.variable!.color, theme.tokens['syntax.variable'])
      assert.equal(native.style.syntax['variable.parameter']!.color, theme.tokens['syntax.parameter'])
      assert.equal(native.style.syntax.keyword!.color, theme.tokens['syntax.keyword'])
      assert.equal(native.style.syntax.function!.color, theme.tokens['syntax.function.call'])
      assert.equal(native.style.syntax.type!.color, theme.tokens['syntax.type'])
      assert.equal(native.style.syntax.attribute!.color, theme.tokens['syntax.property'])
      assert.equal(native.style.syntax.tag!.color, theme.tokens['syntax.tag'])
      assert.notEqual(native.style.syntax.attribute!.color, native.style.syntax.tag!.color)
      assert.equal(native.style.syntax.title!.font_weight, 700)
      assert.equal(native.style.syntax['emphasis.strong']!.font_weight, 700)
      for (const [capture, style] of Object.entries(native.style.syntax)) {
        if (!['title', 'emphasis.strong'].includes(capture))
          assert.equal(style.font_weight, null, `${theme.variant}: ${capture} must inherit the editor font weight`)
      }
      assert.equal(native.style.players[0]!.cursor, theme.tokens['text.primary'])
      assert.equal(native.style.players[0]!.selection, theme.tokens['surface.selection'])
      assert.equal(native.style.players[1]!.selection, `${theme.tokens['accent.green.base']}30`)
    })
  })

  it('serves every Zed artifact and all existing downloads under verified checksums', () => {
    const distribution = fileURLToPath(new URL('../../dist/ports/', import.meta.url))
    const publicRoot = fileURLToPath(new URL('../../public/ports/', import.meta.url))
    const manifest = JSON.parse(readFileSync(`${publicRoot}manifest.json`, 'utf8')) as { files: Record<string, string> }
    for (const [path, checksum] of Object.entries(manifest.files)) {
      const bytes = readFileSync(`${publicRoot}${path}`)
      assert.equal(createHash('sha256').update(bytes).digest('hex'), checksum, path)
      if (path.startsWith('zed/'))
        assert.deepEqual(bytes, readFileSync(`${distribution}${path}`))
    }
    for (const theme of themes) {
      const path = `zed/lig-${theme.variant}.json`
      assert.ok(manifest.files[path], path)
      assert.deepEqual(JSON.parse(readFileSync(`${publicRoot}${path}`, 'utf8')), zedFamily([theme]))
    }
    assert.ok(manifest.files['zed/lig-zed-all.zip'])
    assert.ok(manifest.files['zed/README.md'])
  })

  it('packages a native repository extension with reproducible provenance and matching web themes', () => {
    const root = fileURLToPath(new URL('../../dist/ports/zed-extension/', import.meta.url))
    const publicRoot = fileURLToPath(new URL('../../public/ports/zed/', import.meta.url))
    const manifest = JSON.parse(readFileSync(`${root}lig-build.json`, 'utf8')) as { sourceRef: string, packageVersion: string, files: Record<string, string> }
    assert.equal(manifest.sourceRef, ZED_SOURCE_REF)
    assert.equal(manifest.packageVersion, ZED_VERSION)
    const toml = readFileSync(`${root}extension.toml`, 'utf8')
    assert.ok(toml.includes(`repository = "${ZED_REPOSITORY}"`))
    assert.ok(toml.includes(`version = "${ZED_VERSION}"`))
    assert.ok(toml.includes('schema_version = 1'))
    assert.ok(toml.includes('id = "lig-theme"'))
    assert.equal(Object.keys(manifest.files).length, 13)
    for (const [path, checksum] of Object.entries(manifest.files))
      assert.equal(createHash('sha256').update(readFileSync(`${root}${path}`)).digest('hex'), checksum, path)
    for (const theme of themes)
      assert.deepEqual(readFileSync(`${root}themes/lig-${theme.variant}.json`), readFileSync(`${publicRoot}lig-${theme.variant}.json`))
    assert.ok(readFileSync(`${root}LICENSE`, 'utf8').includes('MIT License'))
    assert.ok(readFileSync(`${root}LICENSE`, 'utf8').includes('Copyright (c) 2024-2026 froQ'))
  })
})
