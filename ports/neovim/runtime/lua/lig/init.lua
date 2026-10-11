local M = {}
local defaults = { terminal_colors = true, transparent = false, styles = {}, lualine_bold = false, plugins = { auto = true } }
local config = vim.deepcopy(defaults)
local active_style
M.styles = {}
M.version = "0.2.1"

local function normalize_style(style)
  if style == "light-soft" then return "light-paper" end
  if style == "dark-soft" then return "dark-paper" end
  return style
end

local function validate_options(opts)
  if opts.on_colors then
    error("LiG 0.2 uses on_tokens(tokens), not on_colors(colors). See the migration section in README.md.")
  end
  if opts.mono and opts.mono.enabled then
    error("LiG 0.2 no longer supports the mono profile. See README.md.")
  end
end

function M.setup(opts)
  validate_options(opts or {})
  config = vim.tbl_deep_extend("force", {}, defaults, opts or {})
  config.style = normalize_style(config.style)
  M.styles = {}
end

function M.get_options()
  return vim.deepcopy(config)
end

local function palette(opts)
  local data = require("lig.generated")
  local variant = normalize_style(opts.style) or (vim.o.background == "light" and "light" or "dark")
  local theme = data.variants[variant]
  if not theme then
    error("Unknown LiG variant: " .. tostring(variant))
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
      if visiting[name] then error("LiG alias cycle: " .. name) end
      visiting[name] = true
      tokens[name] = alias(theme.aliases[name])
      visiting[name] = nil
    end
    return tokens[name]
  end
  for name in pairs(theme.aliases) do alias(name) end

  return tokens, variant, theme
end

function M.get_tokens(style)
  local opts = vim.tbl_deep_extend("force", {}, config)
  opts.style = style or active_style or opts.style
  return palette(opts)
end

local function enabled_integrations(data, opts)
  local settings = opts.plugins
  if type(settings) ~= "table" then error("LiG plugins must be a table") end
  local all = settings.all
  if all == nil then all = package.loaded.lazy == nil end
  local installed = {}
  if settings.auto and package.loaded.lazy then
    local ok, lazy_config = pcall(require, "lazy.core.config")
    if ok then installed = lazy_config.plugins or {} end
  end
  local enabled = {}
  for name, integration in pairs(data.integrations) do
    local use = all or (settings.auto and (installed[integration.plugin] ~= nil
      or (name:match("^mini_") and installed["mini.nvim"] ~= nil)))
    local manual = settings[name]
    if manual == nil then manual = settings[integration.plugin] end
    if type(manual) == "table" then manual = manual.enabled end
    if manual ~= nil then use = manual end
    if use then enabled[name] = true end
  end
  return enabled
end

function M.load(opts)
  opts = vim.tbl_deep_extend("force", {}, config, opts or {})
  validate_options(opts)
  opts.style = normalize_style(opts.style)
  local data = require("lig.generated")
  local requested = opts.style or vim.o.background
  -- Neovim re-sources the current colorscheme when 'background' changes.
  -- Follow that change while retaining the selected standard/paper family.
  if active_style == requested and vim.g.colors_name == "lig-" .. requested
    and data.variants[requested] and vim.o.background ~= data.variants[requested].mode then
    opts.style = M.styles[vim.o.background]
      or (vim.o.background == "light" and opts.light_style)
      or (vim.o.background .. (requested:match("%-paper$") and "-paper" or ""))
  end
  local tokens, variant, theme = palette(opts)
  local function color(name)
    local value = tokens[name]
    if not value then error("Missing LiG token: " .. name) end
    if not value:match("^#%x%x%x%x%x%x$") then
      error("LiG token must be #rrggbb: " .. name)
    end
    return value
  end

  local groups = {}
  local bindings = vim.deepcopy(data.groups)
  local enabled = enabled_integrations(data, opts)
  for name in pairs(enabled) do
    for group, binding in pairs(data.integrations[name].groups) do
      bindings[group] = binding
    end
  end
  local style_categories = {
    comment = "comments", keyword = "keywords", variable = "variables",
    ["function"] = "functions", method = "functions", type = "types",
  }
  local transparent_groups = {
    Normal = true, NormalNC = true, NormalFloat = true, FloatBorder = true,
    FloatTitle = true, SignColumn = true, FoldColumn = true,
  }
  for group, binding in pairs(bindings) do
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
  vim.g.colors_name = "lig-" .. variant
  active_style = variant
  M.styles[theme.mode] = variant
  for name, hl in pairs(groups) do vim.api.nvim_set_hl(0, name, hl) end
  if opts.terminal_colors then
    for index = 0, 15 do
      vim.g["terminal_color_" .. index] = color("terminal.ansi." .. index)
    end
  end
  return tokens, groups, enabled
end

return M
