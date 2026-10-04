local M = {}
local config = { terminal_colors = true, transparent = false, styles = {} }

function M.setup(opts)
  config = vim.tbl_deep_extend("force", {}, config, opts or {})
end

function M.load(opts)
  opts = vim.tbl_deep_extend("force", {}, config, opts or {})
  local data = require("lig_preview.generated")
  local variant = opts.style or (vim.o.background == "light" and "light" or "dark")
  local theme = data.variants[variant]
  if not theme then
    error("Unknown LiG Preview variant: " .. tostring(variant))
  end
  local tokens = vim.deepcopy(theme.tokens)
  if opts.on_tokens then opts.on_tokens(tokens) end
  local changed = {}
  for name, value in pairs(tokens) do
    if value ~= theme.tokens[name] then changed[name] = true end
  end
  local visiting = {}
  local function alias(name)
    if theme.aliases[name] and not changed[name] then
      if visiting[name] then error("LiG Preview alias cycle: " .. name) end
      visiting[name] = true
      tokens[name] = alias(theme.aliases[name])
      visiting[name] = nil
    end
    return tokens[name]
  end
  for name in pairs(theme.aliases) do alias(name) end

  local function color(name)
    local value = tokens[name]
    if not value then error("Missing LiG Preview token: " .. name) end
    if not value:match("^#%x%x%x%x%x%x$") then
      error("LiG Preview token must be #rrggbb: " .. name)
    end
    return value
  end

  local groups = {}
  local style_categories = {
    comment = "comments", keyword = "keywords", variable = "variables",
    ["function"] = "functions", method = "functions", type = "types",
  }
  local transparent_groups = {
    Normal = true, NormalNC = true, NormalFloat = true, FloatBorder = true,
    FloatTitle = true, SignColumn = true, FoldColumn = true,
  }
  for group, binding in pairs(data.groups) do
    local hl = {}
    if binding.role then
      local style = data.styles[binding.role]
      if style.foreground then hl.fg = color(style.foreground) end
      for _, key in ipairs({ "bold", "italic", "underline", "strikethrough" }) do
        if style[key] ~= nil then hl[key] = style[key] end
      end
      local category = style_categories[binding.role:match("^[^.]+")]
      if category and opts.styles[category] then
        hl = vim.tbl_extend("force", hl, opts.styles[category])
      end
    end
    for key, value in pairs(binding) do
      if key == "fg" or key == "bg" or key == "sp" then
        hl[key] = color(value)
      elseif key ~= "role" then
        hl[key] = value
      end
    end
    if opts.transparent and transparent_groups[group] then hl.bg = nil end
    groups[group] = hl
  end
  if opts.on_highlights then opts.on_highlights(groups, tokens) end
  if vim.g.colors_name then vim.cmd("highlight clear") end
  vim.o.termguicolors = true
  vim.g.colors_name = nil
  vim.o.background = theme.mode
  vim.g.colors_name = "lig-preview-" .. variant
  for name, hl in pairs(groups) do vim.api.nvim_set_hl(0, name, hl) end
  if opts.terminal_colors then
    for index = 0, 15 do
      vim.g["terminal_color_" .. index] = color("terminal.ansi." .. index)
    end
  end
  return tokens, groups
end

return M
