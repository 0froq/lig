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
  for index = 0, 15 do
    assert(vim.g["terminal_color_" .. index] == tokens["terminal.ansi." .. index])
  end
end

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
