export type Point = [number, number]

export interface LayerColors {
  paper: string
  ink: string
  accent: string
  dark: boolean
}

export interface PaperOptions {
  colors: LayerColors
  /** Elements whose centre receives a wash when `bloom()` runs. */
  marks?: HTMLElement[]
  /** Punctuation washes. Off leaves the stops as type. */
  washes?: boolean
  /** Seconds of stillness before a dwell wash. `0` listens for nothing. */
  dwellAfter?: number
  /** A press drops a wash. Off ignores clicks. */
  click?: boolean
}

export interface BloomOptions {
  delay?: number
  strength?: number
}

export interface PaperLayer {
  bloom: () => void
  soak: (el: HTMLElement | null | undefined) => void
  add: (x: number, y: number, size: number, options?: BloomOptions) => void
  /** 0–1 wash coverage at a document point. The pen dyes the stroke there. */
  wet: (x: number, y: number) => number
  /** A wash is still on the page, so the pen should redraw through it. */
  flowing: () => boolean
  setColors: (colors: LayerColors) => void
  destroy: () => void
}

export interface PenOptions {
  /** Page root; the route is read from `[data-anchor]` descendants. */
  root: HTMLElement
  /** Handwrite this element's text. Null or empty text skips the hand. */
  hand?: HTMLElement | null
  colors: LayerColors
  /** Wash coverage at a document point. Covered ink is dyed. */
  wet?: (x: number, y: number) => number
  /** True while a wash is still spreading, so newly dyed ink gets redrawn. */
  flowing?: () => boolean
  /** Called when the pen reaches the final mark. Without it the pen dots the stop itself. */
  onArrive?: () => void
}

export interface PenLayer {
  setColors: (colors: LayerColors) => void
  destroy: () => void
}

export interface GlyphLayout {
  strokes: Point[][]
  width: number
  ascent: number
  descent: number
}
