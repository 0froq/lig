local M = {}

-- Reading a statusline palette must not clear highlights or change background.
function M.lualine(style)
  local tokens = require("lig_preview").get_tokens(style)
  local definitions = require("lig_preview.generated").statusline
  local bold = require("lig_preview").get_options().lualine_bold
  local result = {}
  for mode, sections in pairs(definitions) do
    result[mode] = {}
    for section, binding in pairs(sections) do
      result[mode][section] = { fg = assert(tokens[binding.fg]), bg = assert(tokens[binding.bg]), gui = (bold and section == "a") and "bold" or binding.gui }
    end
  end
  return result
end

function M.lightline(style)
  local source = M.lualine(style)
  local result = {}
  for mode, sections in pairs(source) do
    result[mode] = {
      left = { { sections.a.fg, sections.a.bg, sections.a.gui or "" }, { sections.b.fg, sections.b.bg, sections.b.gui or "" } },
      middle = { { sections.c.fg, sections.c.bg, sections.c.gui or "" } },
      right = { { sections.a.fg, sections.a.bg, sections.a.gui or "" }, { sections.b.fg, sections.b.bg, sections.b.gui or "" } },
    }
  end
  local tokens = require("lig_preview").get_tokens(style)
  result.normal.error = { { tokens["diagnostic.error"], tokens["surface.status"], "" } }
  result.normal.warning = { { tokens["diagnostic.warning"], tokens["surface.status"], "" } }
  result.tabline = {
    left = { { tokens["text.primary"], tokens["surface.status"], "" } },
    tabsel = { { tokens["text.inverse"], tokens["surface.inverse"], "bold" } },
    middle = { { tokens["text.subtle"], tokens["surface.status"], "" } },
    right = { { tokens["text.strong"], tokens["surface.status"], "" } },
  }
  return result
end

return M
