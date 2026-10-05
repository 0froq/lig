import type { SyntaxCapture, SyntaxDocument, SyntaxNode } from './types'
import { captureRole } from '../core/syntax'

export interface SourceSegment {
  id: number
  startByte: number
  endByte: number
  text: string
  node: number
  captures: SyntaxCapture[]
  winner: SyntaxCapture | null
  token: string
}

/** Byte boundaries -> JS UTF-16 indices; reject offsets inside a code point. */
export function byteIndices(source: string): Map<number, number> {
  const result = new Map([[0, 0]])
  let bytes = 0
  let index = 0
  const encoder = new TextEncoder()
  for (const character of source) {
    bytes += encoder.encode(character).length
    index += character.length
    result.set(bytes, index)
  }
  return result
}

export function sourceRange(document: SyntaxDocument, node: SyntaxNode): string {
  const indices = byteIndices(document.source)
  return document.source.slice(indices.get(node.startByte), indices.get(node.endByte))
}

export function ancestry(document: SyntaxDocument, id: number): SyntaxNode[] {
  const nodes: SyntaxNode[] = []
  let node: SyntaxNode | undefined = document.nodes[id]
  while (node) {
    nodes.unshift(node)
    node = node.parent === null ? undefined : document.nodes[node.parent]
  }
  return nodes
}

export function segmentSource(document: SyntaxDocument): SourceSegment[] {
  const indices = byteIndices(document.source)
  const length = new TextEncoder().encode(document.source).length
  const boundaries = new Set([0, length])
  for (const item of [...document.nodes, ...document.captures]) {
    for (const offset of [item.startByte, item.endByte]) {
      if (!indices.has(offset))
        throw new Error(`Invalid UTF-8 boundary ${offset} in ${document.filename}`)
      boundaries.add(offset)
    }
  }
  const points = [...boundaries].sort((a, b) => a - b)
  return points.slice(0, -1).map((startByte, id) => {
    const endByte = points[id + 1]!
    // Preorder means the last enclosing node is the deepest, including anonymous leaves.
    const node = document.nodes.findLast(item => item.startByte <= startByte && item.endByte >= endByte) ?? document.nodes[0]!
    const captures = document.captures.filter(item => item.startByte <= startByte && item.endByte >= endByte)
      .sort((a, b) => b.priority - a.priority || b.order - a.order)
    // Neovim uses priority, then application order for overlapping foregrounds.
    // Unmapped captures remain visible in the inspector but must not mask a known role.
    const winner = captures.find(item => captureRole(item.name)?.matched != null) ?? null
    return {
      id,
      startByte,
      endByte,
      node: node.id,
      captures,
      winner,
      text: document.source.slice(indices.get(startByte), indices.get(endByte)),
      token: winner ? captureRole(winner.name)!.token : 'text.primary',
    }
  })
}
