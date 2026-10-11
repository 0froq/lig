export function lua(value: unknown): string {
  if (typeof value === 'string')
    return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  if (Array.isArray(value))
    return `{ ${value.map(lua).join(', ')} }`
  if (value && typeof value === 'object') {
    return `{\n${Object.entries(value).map(([key, item]) => `  [${lua(key)}] = ${lua(item)},`).join('\n')}\n}`
  }
  throw new Error(`Cannot serialize Lua value: ${String(value)}`)
}
