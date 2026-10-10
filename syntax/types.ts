/** Tree-sitter offsets/columns are UTF-8 bytes; end positions are exclusive. */
export interface SyntaxNode {
  id: number
  type: string
  parent: number | null
  children: number[]
  field: string | null
  named: boolean
  missing: boolean
  error: boolean
  startByte: number
  endByte: number
  range: [number, number, number, number]
}

export interface SyntaxCapture {
  name: string
  node: number
  startByte: number
  endByte: number
  priority: number
  order: number
}

export interface SyntaxDocument {
  language: string
  filename: string
  source: string
  nodes: SyntaxNode[]
  captures: SyntaxCapture[]
  hasError: boolean
}
