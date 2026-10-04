import type { StatuslinePalette } from '../types'

/** Mode colors are shared with mini.statusline, not independent legacy palette names. */
export const STATUSLINE: StatuslinePalette = {
  normal: {
    a: { fg: 'text.inverse', bg: 'mode.normal' },
    b: { fg: 'mode.normal', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  insert: {
    a: { fg: 'text.inverse', bg: 'mode.insert' },
    b: { fg: 'text.strong', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  visual: {
    a: { fg: 'text.inverse', bg: 'mode.visual' },
    b: { fg: 'mode.visual', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  replace: {
    a: { fg: 'text.inverse', bg: 'mode.replace' },
    b: { fg: 'mode.replace', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  command: {
    a: { fg: 'text.inverse', bg: 'mode.command' },
    b: { fg: 'mode.command', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  terminal: {
    a: { fg: 'text.inverse', bg: 'mode.terminal' },
    b: { fg: 'mode.terminal', bg: 'surface.status' },
    c: { fg: 'text.primary', bg: 'surface.canvas' },
  },
  inactive: {
    a: { fg: 'text.primary', bg: 'surface.status' },
    b: { fg: 'text.subtle', bg: 'surface.status', gui: 'bold' },
    c: { fg: 'text.subtle', bg: 'surface.status' },
  },
}
