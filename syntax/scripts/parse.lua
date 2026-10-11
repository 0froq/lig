-- Run with clean Neovim: no user init, plugins, LSP or editor UI.
local input = vim.json.decode(table.concat(vim.fn.readfile(assert(arg[1])), '\n'))
local documents = {}
for _, item in ipairs(input.documents) do
  vim.treesitter.language.add(item.language, { path = item.parser })
  local parser = vim.treesitter.get_string_parser(item.source, item.language)
  local tree = assert(parser:parse()[1])
  local root = tree:root()
  local nodes, node_ids = {}, {}
  local function visit(node, parent, field)
    local id = #nodes
    local sr, sc, sb, er, ec, eb = node:range(true)
    local result = {
      id = id, type = node:type(), parent = parent or vim.NIL,
      field = field or vim.NIL, children = {}, named = node:named(),
      missing = node:missing(), error = node:type() == 'ERROR',
      startByte = sb, endByte = eb, range = { sr, sc, er, ec },
    }
    nodes[id + 1] = result
    node_ids[node:id()] = id
    for child, child_field in node:iter_children() do
      table.insert(result.children, visit(child, id, child_field))
    end
    return id
  end
  visit(root, nil, nil)
  local query = vim.treesitter.query.parse(item.language, item.query)
  local captures = {}
  for capture, node, metadata in query:iter_captures(root, item.source, 0, -1) do
    local range = vim.treesitter.get_range(node, item.source, metadata[capture])
    table.insert(captures, {
      name = query.captures[capture], node = assert(node_ids[node:id()]),
      startByte = range[3], endByte = range[6], order = #captures,
      priority = tonumber(metadata.priority or (metadata[capture] or {}).priority) or vim.hl.priorities.treesitter,
    })
  end
  table.insert(documents, {
    language = item.language, filename = item.filename, source = item.source,
    nodes = nodes, captures = captures, hasError = root:has_error(),
  })
end
local version = vim.version()
vim.fn.writefile({ vim.json.encode({
  neovim = string.format('%d.%d.%d', version.major, version.minor, version.patch),
  documents = documents,
}) }, input.output)
