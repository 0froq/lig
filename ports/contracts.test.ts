// @env node
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { VARIANTS } from '../core/resolve'
import { neovimGroups } from './neovim/emit'
import { INTEGRATIONS } from './neovim/integrations'
import coverage from './neovim/integrations/coverage.json'
import { compileTheme, requireStyle, requireToken } from './styles'
import { vscodeStyle, vscodeTheme } from './vscode/emit'

const root = fileURLToPath(new URL('../dist/ports/', import.meta.url))

describe('shared theme and native adapter contracts', () => {
  it('retains every group from all sixteen implemented upstream integrations', () => {
    assert.deepEqual(Object.keys(INTEGRATIONS).sort(), Object.keys(coverage.plugins).sort())
    for (const [name, upstream] of Object.entries(coverage.plugins)) {
      const migrated = INTEGRATIONS[name]!
      assert.equal(migrated.plugin, upstream.plugin)
      for (const group of upstream.groups)
        assert.ok(migrated.groups[group], `${name}: missing upstream group ${group}`)
    }
    const groups = neovimGroups()
    for (const [name, binding] of Object.entries(groups)) {
      if (binding.link)
        assert.ok(groups[binding.link], `${name}: unresolved link ${binding.link}`)
    }
    assert.deepEqual(groups.WhichKeyIconBlue, groups.WhichKeylconBlue)
    assert.equal(groups.GitSignsChangeLn!.bg, 'surface.git.change.line')
    assert.equal(groups.MiniCursorword!.bg, 'surface.cursorword')
  })

  it('preserves syntax intent when two styles share a color token', () => {
    const groups = neovimGroups()
    for (const name of ['@boolean', '@constant', '@label']) {
      assert.equal(groups[name]!.role, 'constant')
      assert.equal(requireStyle(groups[name]!.role!).underline, undefined)
    }
    assert.equal(groups['@markup.link']!.role, 'markup.link')
    assert.equal(requireStyle('markup.link').underline, true)
    assert.equal(groups['@none']!.role, 'text')
    assert.equal(groups['@constructor.lua']!.role, 'punctuation')
    assert.equal(groups['@constructor']!.role, 'constructor')
  })
  it('keeps semantic declarations and non-color modifiers separate', () => {
    const groups = neovimGroups()
    assert.equal(groups['@variable']!.role, 'variable')
    assert.equal(groups['@keyword']!.role, 'keyword')
    assert.equal(groups['@lsp.type.parameter']!.role, 'variable')
    assert.equal(groups['@lsp.typemod.parameter.declaration']!.role, 'parameter.binding')
    assert.deepEqual(groups['@lsp.mod.modification'], {})
    assert.deepEqual(requireStyle('modifier.defaultLibrary'), { italic: true })
    assert.deepEqual(requireStyle('modifier.deprecated'), { strikethrough: true })
  })

  for (const variant of VARIANTS) {
    it(`${variant}: native styles use exact shared token values`, () => {
      const theme = compileTheme(variant)
      const native = vscodeTheme(theme, variant) as { colors: Record<string, string>, semanticTokenColors: Record<string, object> }
      assert.notEqual(vscodeStyle(theme, 'variable').foreground, vscodeStyle(theme, 'keyword').foreground)
      assert.equal(native.colors['editor.background'], theme.tokens['surface.canvas'])
      assert.deepEqual(native.semanticTokenColors['function.declaration'], vscodeStyle(theme, 'function.definition'))
      assert.deepEqual(native.semanticTokenColors['*.defaultLibrary'], { italic: true })
      assert.equal(native.colors['terminal.ansiBrightBlack'], theme.tokens['terminal.ansi.8'])
      for (const value of Object.values(native.colors))
        assert.match(value, /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/)
      for (const binding of Object.values(neovimGroups())) {
        if (binding.role)
          requireStyle(binding.role)
        for (const key of ['fg', 'bg', 'sp'] as const) {
          if (binding[key])
            requireToken(theme, binding[key]!)
        }
      }
    })
  }

  it('every managed artifact matches its published manifest checksum', () => {
    const manifest = JSON.parse(readFileSync(`${root}manifest.json`, 'utf8')) as { files: Record<string, string> }
    for (const [path, checksum] of Object.entries(manifest.files)) {
      const actual = createHash('sha256').update(readFileSync(`${root}${path}`)).digest('hex')
      assert.equal(actual, checksum, path)
    }
  })
})
