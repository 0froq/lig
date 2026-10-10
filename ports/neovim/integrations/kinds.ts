import type { HighlightBinding } from '../../types'

export const KINDS: Record<string, HighlightBinding> = {
  LspKindText: {
    link: '@markup',
  },
  LspKindTypeParameter: {
    link: '@lsp.type.typeParameter',
  },
  LspKindArray: {
    link: '@punctuation.bracket',
  },
  LspKindBoolean: {
    link: '@boolean',
  },
  LspKindClass: {
    link: '@type',
  },
  LspKindColor: {
    link: 'Special',
  },
  LspKindConstant: {
    link: '@constant',
  },
  LspKindConstructor: {
    link: '@constructor',
  },
  LspKindEnum: {
    link: '@lsp.type.enum',
  },
  LspKindEnumMember: {
    link: '@lsp.type.enumMember',
  },
  LspKindEvent: {
    link: 'Special',
  },
  LspKindField: {
    link: '@variable.member',
  },
  LspKindFile: {
    link: 'Normal',
  },
  LspKindFolder: {
    link: 'Directory',
  },
  LspKindFunction: {
    link: '@function',
  },
  LspKindInterface: {
    link: '@lsp.type.interface',
  },
  LspKindKey: {
    link: '@variable.member',
  },
  LspKindKeyword: {
    link: '@lsp.type.keyword',
  },
  LspKindMethod: {
    link: '@function.method',
  },
  LspKindModule: {
    link: '@module',
  },
  LspKindNamespace: {
    link: '@module',
  },
  LspKindNull: {
    link: '@constant.builtin',
  },
  LspKindNumber: {
    link: '@number',
  },
  LspKindObject: {
    link: '@constant',
  },
  LspKindOperator: {
    link: '@operator',
  },
  LspKindPackage: {
    link: '@module',
  },
  LspKindProperty: {
    link: '@property',
  },
  LspKindReference: {
    link: '@markup.link',
  },
  LspKindSnippet: {
    link: 'Conceal',
  },
  LspKindString: {
    link: '@string',
  },
  LspKindStruct: {
    link: '@lsp.type.struct',
  },
  LspKindValue: {
    link: '@string',
  },
  LspKindUnit: {
    link: '@lsp.type.struct',
  },
  LspKindVariable: {
    link: '@variable',
  },
}
