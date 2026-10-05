-- Non-visual verification of emitted Lua, token references and native API data.
local root = vim.fn.getcwd()
vim.opt.rtp:prepend(root .. "/dist/ports/neovim")
local preview = require("lig_preview")
local data = require("lig_preview.generated")
local function as_number(hex) return tonumber(hex:sub(2), 16) end

for _, variant in ipairs({ "dark", "light", "dark-soft", "light-soft", "light", "dark" }) do
  local tokens, groups = preview.load({ style = variant })
  assert(vim.g.colors_name == "lig-preview-" .. variant)
  assert(vim.o.background == data.variants[variant].mode)
  for name, binding in pairs(data.groups) do
    if not binding.link then
      local applied = vim.api.nvim_get_hl(0, { name = name, link = false })
      for _, key in ipairs({ "fg", "bg", "sp" }) do
        if groups[name][key] then
          assert(applied[key] == as_number(groups[name][key]), variant .. " " .. name .. " " .. key)
        end
      end
    end
  end
  for _, integration in pairs(data.integrations) do
    for name, binding in pairs(integration.groups) do
      assert(groups[name], "Plugin group not applied: " .. name)
      local applied = vim.api.nvim_get_hl(0, { name = name, link = false })
      for _, key in ipairs({ "fg", "bg", "sp" }) do
        if groups[name][key] then
          assert(applied[key] == as_number(groups[name][key]), variant .. " " .. name .. " " .. key)
        end
      end
      for _, key in ipairs({ "bold", "italic", "underline", "undercurl", "underdouble", "strikethrough" }) do
        if binding[key] then assert(applied[key], variant .. " " .. name .. " " .. key) end
      end
    end
  end
  for index = 0, 15 do
    assert(vim.g["terminal_color_" .. index] == tokens["terminal.ansi." .. index])
  end
end

-- The original bug painted constants as links because both shared a color.
for _, name in ipairs({ "@boolean", "@constant", "@label" }) do
  assert(not vim.api.nvim_get_hl(0, { name = name }).underline, name)
end
assert(vim.api.nvim_get_hl(0, { name = "@markup.link" }).underline)
assert(vim.api.nvim_get_hl(0, { name = "@constructor.lua" }).fg == as_number(data.variants.dark.tokens["syntax.punctuation"]))

local _, disabled, selected = preview.load({ style = "dark", plugins = { all = false, auto = false, ["blink.cmp"] = true, telescope = { enabled = true }, gitsigns = false } })
assert(selected.blink and selected.telescope and not selected.gitsigns)
assert(disabled.BlinkCmpKindBoolean and disabled.TelescopeMatching and not disabled.GitSignsAdd)
assert(vim.api.nvim_get_hl(0, { name = "GitSignsAdd" }).fg == nil)
assert(not vim.api.nvim_get_hl(0, { name = "BlinkCmpKindBoolean", link = false }).underline)

package.loaded.lazy = {}
package.loaded["lazy.core.config"] = { plugins = { ["mini.nvim"] = {}, ["gitsigns.nvim"] = {} } }
local _, auto_groups, auto = preview.load({ style = "dark", plugins = { all = false, auto = true, mini_files = false } })
assert(auto.gitsigns and auto.mini_cursorword and auto.mini_tabline and not auto.mini_files and not auto.telescope)
assert(auto_groups.GitSignsAdd and auto_groups.MiniTablineCurrent and not auto_groups.MiniFilesNormal)
package.loaded.lazy = nil
package.loaded["lazy.core.config"] = nil

-- Statusline exports consume tokens, without changing the active editor theme.
preview.load({ style = "dark" })
local before = vim.api.nvim_get_hl(0, { name = "Normal" })
local statusline = require("lig_preview.statusline")
for _, variant in ipairs({ "dark", "light", "dark-soft", "light-soft" }) do
  local lualine = require("lualine.themes.lig-preview-" .. variant)
  local tokens = preview.get_tokens(variant)
  assert(lualine.normal.a.bg == tokens["mode.normal"])
  assert(lualine.insert.a.bg == tokens["mode.insert"])
  assert(lualine.visual.a.bg == tokens["mode.visual"])
  for _, sections in pairs(lualine) do
    for _, section in pairs(sections) do assert(section.fg:match("^#%x%x%x%x%x%x$") and section.bg:match("^#%x%x%x%x%x%x$")) end
  end
  local lightline = require("lightline.colorscheme.lig_preview_" .. variant:gsub("-", "_"))
  assert(lightline.normal.left[1][2] == tokens["mode.normal"])
  assert(lightline.normal.error[1][1] == tokens["diagnostic.error"])
  assert(lightline.tabline.tabsel[1][2] == tokens["surface.inverse"])
end
assert(vim.deep_equal(vim.api.nvim_get_hl(0, { name = "Normal" }), before))
assert(vim.g.colors_name == "lig-preview-dark" and vim.o.background == "dark")
preview.setup({ lualine_bold = true })
assert(statusline.lualine().normal.a.gui == "bold")

-- Native Lua parser/query data confirms the language exception addresses table braces.
local source = "local opts = { lazy = false }; require('lazy').setup(opts)"
local parser = vim.treesitter.get_string_parser(source, "lua")
local query = assert(vim.treesitter.query.get("lua", "highlights"))
local braces, boolean, call = false, false, false
for id, node in query:iter_captures(parser:parse()[1]:root(), source) do
  local capture = query.captures[id]
  if capture == "constructor" then
    assert(vim.treesitter.get_node_text(node, source):match("[{}]"))
    braces = true
  elseif capture == "boolean" then boolean = true
  elseif capture == "function.call" then call = true end
end
assert(braces and boolean and call)

preview.load({ style = "light", transparent = true })
assert(vim.api.nvim_get_hl(0, { name = "Normal" }).bg == nil)
assert(vim.api.nvim_get_hl(0, { name = "CursorLine" }).bg ~= nil)
preview.load({ style = "dark", styles = { comments = { italic = true } } })
assert(vim.api.nvim_get_hl(0, { name = "@comment" }).italic)
assert(vim.api.nvim_get_hl(0, { name = "Comment" }).italic)
assert(vim.api.nvim_get_hl(0, { name = "@lsp.type.comment" }).italic)
local patched = preview.load({ style = "dark", on_tokens = function(tokens) tokens["text.strong"] = "#abcdef" end })
assert(patched["syntax.variable"] == "#abcdef")
assert(vim.api.nvim_get_hl(0, { name = "@variable" }).fg == 0xabcdef)
preview.setup({ style = "light-soft" })
vim.cmd.colorscheme("lig-preview")
assert(vim.g.colors_name == "lig-preview-light-soft")
vim.cmd.colorscheme("lig-preview-dark")
assert(vim.g.colors_name == "lig-preview-dark")
print("LiG Preview native API contracts passed: " .. vim.version().major .. "." .. vim.version().minor .. "." .. vim.version().patch)
