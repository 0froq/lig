// Stroke: the whole page is one sentence written with a single pen line.
// It handwrites the tagline (if the page has one), rules off the page head, threads through
// the empty label column, circles the price and ends on the final full stop.
// The route is derived from data-anchor elements, so any content produces its own line.

import type { LayerColors, PenLayer, PenOptions, Point } from './types'
import { layoutText } from './hand-font'
import { cubic, looseEllipse, resample, roundJoin, simplify, smooth, STEP, tangent, wobble } from './pen-geometry'

interface Seg {
  from: number
  to: number
  speed: number
  trigger: Element | null
}

interface Dot {
  x: number
  y: number
  r: number
}

interface TravelOpts {
  speed: number
  trigger?: Element | null
  taper?: boolean
  nib?: boolean
}

/** Tagline text the pen writes. Slot labels inside a placeholder are not copy. */
function handCopy(el: HTMLElement | null): string {
  if (!el)
    return ''
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.l-fill').forEach(node => node.remove())
  return (clone.textContent ?? '').trim()
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// `onArrive` hands the final full stop to another layer instead of stamping a flat dot
export function createPen(options: PenOptions): PenLayer {
  const { root, onArrive, wet, flowing } = options
  const textEl = options.hand ?? null
  const raw = handCopy(textEl)
  const hand = raw.length > 0 ? textEl : null
  const text = hand ? raw.replace(/[.!?]$/, '') : ''
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canvas = document.createElement('canvas')
  canvas.className = 'stroke-layer'
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', zIndex: '-1', pointerEvents: 'none' })
  // Inside the page's stacking context, under its type: it fades out with the page it belongs to
  root.prepend(canvas)
  const html = document.documentElement
  html.classList.add('has-stroke')
  if (hand)
    html.classList.add('has-hand')
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d) {
    canvas.remove()
    html.classList.remove('has-stroke')
    if (hand)
      html.classList.remove('has-hand')
    return { setColors() {}, destroy() {} }
  }
  const ctx: CanvasRenderingContext2D = ctx2d

  let ink = options.colors.ink
  let accent = options.colors.accent
  const probes: HTMLElement[] = []
  let destroyed = false
  let raf = 0
  let resizeTimer = 0
  const ac = new AbortController()
  const { signal } = ac

  let X = new Float32Array()
  let Y = new Float32Array()
  let Wd = new Float32Array()
  let NX = new Float32Array()
  let NY = new Float32Array()
  let stainAt = new Float64Array()
  let OX = new Float32Array()
  let OY = new Float32Array()
  let VX = new Float32Array()
  let VY = new Float32Array()
  let segs: Seg[] = []
  let total = 0
  let head = 0
  let segIndex = 0
  let dot: Dot | null = null
  let dotBorn = 0
  let wordWidth = 1.6
  let dirty = true
  // Dye stays long after the wash has gone, then eases back to ink
  const DYE_HOLD = 70
  const DYE_FADE = 36
  let wake = Number.POSITIVE_INFINITY

  // Box of the text itself, not of the (possibly grid-stretched) element
  function textRect(el: Element): DOMRect {
    const range = document.createRange()
    range.selectNodeContents(el)
    return range.getBoundingClientRect()
  }

  function baseline(el: Element): number {
    let probe = el.querySelector(':scope > .stroke-probe')
    if (!probe) {
      const created = document.createElement('i')
      created.className = 'stroke-probe'
      Object.assign(created.style, { display: 'inline-block', width: '0', height: '0', verticalAlign: 'baseline' })
      el.append(created)
      probes.push(created)
      probe = created
    }
    return probe.getBoundingClientRect().top + window.scrollY
  }

  function build(): void {
    const pts: Point[] = []
    const widths: number[] = []
    const draft: (Seg | null)[] = []
    let pen: Point | null = null
    let dir: Point = [1, 0]

    const append = (poly: Point[], w: number, opts: TravelOpts): Seg => {
      const { speed, trigger = null, taper = false, nib = false } = opts
      const joined = pen ? roundJoin(pen, dir, poly) : poly
      const r = resample(joined)
      const from = pts.length
      r.forEach((p, i) => {
        if (from > 0 && i === 0)
          return
        pts.push(p)
        const k = taper ? Math.min(1, i / 24, (r.length - 1 - i) / 24) : 1
        let ww = w * (0.45 + 0.55 * k)
        if (nib) {
          // Pointed pen: downstrokes swell, hairlines on the way up
          const a = r[Math.max(0, i - 2)]!
          const b = r[Math.min(r.length - 1, i + 2)]!
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
          ww *= 0.32 + 1.1 * Math.max(0, (b[1] - a[1]) / l) ** 1.4
        }
        widths.push(ww)
      })
      pen = r[r.length - 1] ?? pen
      dir = tangent(r, true)
      return { from, to: pts.length - 1, speed, trigger }
    }
    // Before anything is drawn the first travel just puts the pen down
    const travel = (to: Point, entry: Point, w?: number, opts?: TravelOpts): Seg | null => {
      if (!pen) {
        pen = to
        dir = entry
        return null
      }
      const d = Math.hypot(to[0] - pen[0], to[1] - pen[1])
      return append(wobble(cubic(pen, dir, to, entry, Math.max(20, Math.round(d / 6))), Math.min(6, d * 0.012), to[1] * 0.01), w ?? 0, opts ?? { speed: 0 })
    }

    // 1. The tagline, handwritten into the box of the (hidden) typeset one
    const glyphs: Point[][] = []
    let size = 0
    if (hand) {
      const rect = textRect(hand)
      const probeSize = 100
      size = probeSize * rect.width / layoutText(text, { size: probeSize }).width
      wordWidth = Math.max(1.4, Math.min(3.4, size * 0.028))
      for (const s of layoutText(text, { size }).strokes)
        glyphs.push(smooth(simplify(s.map(([x, y]): Point => [x + rect.left, y + baseline(hand)]), size * 0.006)))
    }
    glyphs.forEach((g, k) => {
      const start = g[0]
      if (!start)
        return
      let len = 0
      for (let i = 1; i < g.length; i++) {
        const prev = g[i - 1]!
        const next = g[i]!
        len += Math.hypot(next[0] - prev[0], next[1] - prev[1])
      }
      const isDot = len < size * 0.1
      // Between strokes the pen stays on the paper but barely touches it; it heads
      // straight for a dot rather than looping into the dot's own direction
      if (k > 0 && pen) {
        const dx = start[0] - pen[0]
        const dy = start[1] - pen[1]
        const l = Math.hypot(dx, dy) || 1
        draft.push(append(cubic(pen, dir, start, isDot ? [dx / l, dy / l] : tangent(g, false), 40), 0.07, { speed: size * 9 }))
      }
      draft.push(append(g, isDot ? 1.5 : 1, { speed: size * (isDot ? 2 : 6), nib: !isDot }))
    })
    const connector = 1.2 / wordWidth
    // Single-column layouts have no margin to run in, so the pen lifts between sections
    const narrow = window.innerWidth < 860
    const lift = (to: Point, trigger: Element): Seg | null => pen ? append([pen, to], 0, { speed: 1e6, trigger }) : travel(to, [1, 0])

    // 2. The rule under the head of the page, drawn right to left
    const foot = root.querySelector('[data-anchor="rule"]')
    if (foot) {
      const fr = foot.getBoundingClientRect()
      const y = fr.top + window.scrollY
      draft.push(travel([fr.right, y], [-0.45, 0.9], connector, { speed: 1100 }))
      draft.push(append(wobble([[fr.right, y], [fr.left, y]], 1.2, 3), connector * 0.8, { speed: 1800 }))
    }

    // 3. Each section label is underlined; the price gets circled
    root.querySelectorAll('.l-section').forEach((section) => {
      const label = section.querySelector('[data-anchor="label"]')
      if (!label)
        return
      const lr = textRect(label)
      const y = lr.bottom + window.scrollY + 5
      const start: Point = [lr.left - 2, y]
      draft.push(narrow ? lift(start, label) : travel(start, [0.25, 0.97], connector, { speed: 1600, trigger: label }))
      draft.push(append(wobble([start, [lr.right + 18, y - 1.5]], 0.8, y), connector * 1.15, { speed: 700, trigger: label }))

      const price = section.querySelector('[data-anchor="price"]')
      if (!price)
        return
      const pr = textRect(price)
      const cx = pr.left + pr.width / 2
      const cy = pr.top + window.scrollY + pr.height * 0.55
      const ring = looseEllipse(cx, cy, pr.width * 0.62, pr.height * 0.5)
      const ringStart = ring[0]
      if (!ringStart)
        return
      draft.push(narrow ? lift(ringStart, price) : travel(ringStart, tangent(ring, false), connector, { speed: 1600, trigger: price }))
      draft.push(append(ring, connector * 1.25, { speed: 1100, trigger: price }))
    })

    // 4. The full stop
    const mark = root.querySelector('[data-anchor="final-mark"]')
    const section = mark?.closest('section') ?? null
    const parent = mark?.parentElement ?? null
    const measure = mark ? document.createElement('canvas').getContext('2d') : null
    const glyphText = mark?.firstChild?.textContent
    if (mark && section && parent && measure && glyphText != null) {
      const style = getComputedStyle(mark)
      measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const t = measure.measureText(glyphText)
      const mr = mark.getBoundingClientRect()
      const b = baseline(mark)
      const c: Point = [mr.left + (t.actualBoundingBoxRight - t.actualBoundingBoxLeft) / 2, b + (t.actualBoundingBoxDescent - t.actualBoundingBoxAscent) / 2]
      const r = Math.max(t.actualBoundingBoxRight + t.actualBoundingBoxLeft, t.actualBoundingBoxAscent + t.actualBoundingBoxDescent) / 2
      // Down the margin, across the empty band above the last section, then into the stop
      // from the upper right so the line never crosses text
      const prev = section.previousElementSibling?.getBoundingClientRect()
      const top = section.getBoundingClientRect().top
      const bandY = (prev ? (prev.bottom + top) / 2 : top) + window.scrollY
      const title = textRect(parent)
      const left = root.querySelector('[data-anchor="label"]')?.getBoundingClientRect().left ?? 40
      const over: Point = [Math.min(window.innerWidth - 40, c[0] + title.height * 1.1), title.top + window.scrollY - title.height * 0.9]
      if (narrow) {
        draft.push(lift(over, section))
        dir = [0.86, 0.5]
      }
      else {
        draft.push(travel([left + 24, bandY], [0.2, 0.98], connector, { speed: 1500, trigger: section }))
        draft.push(travel(over, [0.86, 0.5], connector, { speed: 1500, trigger: section }))
      }
      draft.push(travel(c, [-0.42, 0.91], connector, { speed: 1100, trigger: mark }))
      dot = { x: c[0], y: c[1], r }
    }

    segs = draft.filter((seg): seg is Seg => seg !== null)
    total = pts.length
    X = new Float32Array(total)
    Y = new Float32Array(total)
    Wd = new Float32Array(total)
    OX = new Float32Array(total)
    OY = new Float32Array(total)
    VX = new Float32Array(total)
    VY = new Float32Array(total)
    NX = new Float32Array(total)
    NY = new Float32Array(total)
    stainAt = new Float64Array(total)
    wake = Number.POSITIVE_INFINITY
    pts.forEach(([x, y], i) => {
      X[i] = x
      Y[i] = y
      Wd[i] = widths[i] ?? 0
      const a = pts[Math.max(0, i - 3)]!
      const b = pts[Math.min(total - 1, i + 3)]!
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
      NX[i] = -(b[1] - a[1]) / l
      NY[i] = (b[0] - a[0]) / l
    })
  }

  let dpr = 1
  let W = 0
  let H = 0
  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
  }

  function rebuild(): void {
    const done = segIndex
    const finished = head >= total - 1 && total > 0
    build()
    segIndex = Math.min(done, segs.length)
    const prev = segs[segIndex - 1]
    head = finished ? total - 1 : (segIndex > 0 && prev ? prev.to : 0)
    dirty = true
  }

  let pointer: { x: number, y: number } | null = null
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY + window.scrollY }
  }, { passive: true, signal })
  document.addEventListener('mouseleave', () => {
    pointer = null
  }, { signal })

  let lastScroll = -1
  let last = performance.now()
  let started = 0

  function triggered(seg: Seg): boolean {
    return !seg.trigger || seg.trigger.getBoundingClientRect().top < window.innerHeight * 0.8
  }

  function advance(dt: number): void {
    if (reduced) {
      if (head < total - 1) {
        head = total - 1
        segIndex = segs.length
        arrive(performance.now() - 1000)
        dirty = true
      }
      return
    }
    let budget = dt
    while (segIndex < segs.length && budget > 0) {
      const seg = segs[segIndex]
      if (!seg || !triggered(seg))
        break
      // If the reader has run ahead, the pen hurries to catch up
      let ahead = 0
      for (let k = segIndex + 1; k < segs.length && triggered(segs[k]!); k++) {
        if (segs[k]!.trigger)
          ahead++
      }
      const rate = (seg.speed / STEP) * (1 + ahead * 0.6)
      const need = (seg.to - head) / rate
      if (need <= budget) {
        head = seg.to
        budget -= need
        segIndex++
      }
      else {
        head += rate * budget
        budget = 0
      }
      dirty = true
    }
    if (segIndex >= segs.length && dot && !dotBorn)
      arrive(performance.now())
  }

  function arrive(at: number): void {
    dotBorn = at
    onArrive?.()
  }

  function thread(): boolean {
    if (reduced)
      return false
    const y0 = window.scrollY - 60
    const y1 = window.scrollY + H + 60
    const R = 70
    let active = false
    const upto = Math.floor(head)
    for (let i = 0; i <= upto; i++) {
      const y = Y[i] ?? 0
      if (y < y0 || y > y1) {
        if ((OX[i] ?? 0) !== 0 || (OY[i] ?? 0) !== 0)
          OX[i] = OY[i] = VX[i] = VY[i] = 0
        continue
      }
      let tx = 0
      let ty = 0
      if (pointer) {
        const dx = (X[i] ?? 0) - pointer.x
        const dy = y - pointer.y
        const d = Math.hypot(dx, dy)
        if (d < R) {
          // Pushed along the line's normal, away from the pointer's side, like a plucked string
          const nx = NX[i] ?? 0
          const ny = NY[i] ?? 0
          const side = dx * nx + dy * ny < 0 ? -1 : 1
          const f = (1 - d / R) ** 2 * 16 * side
          tx = nx * f
          ty = ny * f
        }
      }
      VX[i] = ((VX[i] ?? 0) + (tx - (OX[i] ?? 0)) * 0.14) * 0.8
      VY[i] = ((VY[i] ?? 0) + (ty - (OY[i] ?? 0)) * 0.14) * 0.8
      OX[i] = (OX[i] ?? 0) + (VX[i] ?? 0)
      OY[i] = (OY[i] ?? 0) + (VY[i] ?? 0)
      if (Math.abs(OX[i] ?? 0) + Math.abs(OY[i] ?? 0) + Math.abs(VX[i] ?? 0) + Math.abs(VY[i] ?? 0) > 0.02)
        active = true
    }
    return active
  }

  function draw(now: number): boolean {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = ink
    const sy = window.scrollY
    const y0 = sy - 60
    const y1 = sy + H + 60
    const upto = Math.floor(head)
    const CH = 3
    const doc = (i: number): [number, number] => [(X[i] ?? 0) + (OX[i] ?? 0), (Y[i] ?? 0) + (OY[i] ?? 0)]
    const hidden = (i: number, j: number): boolean => {
      const yi = Y[i] ?? 0
      const yj = Y[j] ?? 0
      return (yi < y0 && yj < y0) || (yi > y1 && yj > y1)
    }
    const dyeOf = (i: number): number => {
      const at = stainAt[i] ?? 0
      if (at <= 0)
        return 0
      const since = (now - at) / 1000
      if (since <= DYE_HOLD)
        return 1
      return 1 - smoothstep(DYE_HOLD, DYE_HOLD + DYE_FADE, since)
    }
    const stroke = (i: number, j: number, width: number, color: string, alpha: number): void => {
      const [x, y] = doc(i)
      ctx.beginPath()
      ctx.moveTo(x, y - sy)
      for (let k = i + 1; k <= j; k++) {
        const [px, py] = doc(k)
        ctx.lineTo(px, py - sy)
      }
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.strokeStyle = ink
    }
    for (let i = 0; i < upto;) {
      const w = Wd[i + 1] ?? 0
      let j = i + 1
      while (j < upto && j - i < CH && Math.abs((Wd[j + 1] ?? 0) - w) < w * 0.35)
        j++
      if (w > 0 && !hidden(i, j))
        stroke(i, j, wordWidth * w, ink, 1)
      if (wet) {
        for (let k = i; k < j; k++) {
          const [x, y] = doc(k)
          if (wet(x, y) > 0.2)
            stainAt[k] = now
        }
      }
      i = j
    }
    let next = Number.POSITIVE_INFINITY
    let fading = false
    for (let i = 0; i < upto;) {
      const dye = dyeOf(i)
      const at = stainAt[i] ?? 0
      if (at > 0) {
        const fadeAt = at + DYE_HOLD * 1000
        if (now >= fadeAt && now < fadeAt + DYE_FADE * 1000)
          fading = true
        else if (now < fadeAt && fadeAt < next)
          next = fadeAt
      }
      let j = i + 1
      while (j < upto && j - i < CH && Math.abs(dyeOf(j) - dye) < 0.06)
        j++
      const w = Wd[j] ?? Wd[i + 1] ?? 0
      if (dye > 0.02 && w > 0 && !hidden(i, j))
        stroke(i, j, wordWidth * w, accent, dye)
      i = j
    }
    wake = fading ? now : next
    // Fractional tip and the nib
    // A pen resting where a lift put it leaves no mark until it moves
    const tipW = Wd[upto + 1] ?? 0
    if (upto < total - 1 && tipW > 0 && head > upto) {
      const f = head - upto
      const x0 = X[upto] ?? 0
      const yAt = Y[upto] ?? 0
      const hx = x0 + ((X[upto + 1] ?? 0) - x0) * f + (OX[upto] ?? 0)
      const hy = yAt + ((Y[upto + 1] ?? 0) - yAt) * f + (OY[upto] ?? 0) - sy
      ctx.beginPath()
      ctx.moveTo(x0 + (OX[upto] ?? 0), yAt + (OY[upto] ?? 0) - sy)
      ctx.lineTo(hx, hy)
      ctx.lineWidth = wordWidth * (Wd[upto] ?? 0)
      ctx.stroke()
      const current = segs[segIndex]
      if (head > 0 && segIndex < segs.length && current && triggered(current)) {
        ctx.fillStyle = ink
        ctx.beginPath()
        ctx.arc(hx, hy, wordWidth * (Wd[upto] ?? 0) * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (dot && dotBorn && !onArrive) {
      // Ease-out-back: the nib presses, the ink spreads slightly past, then settles
      const t = Math.min(1, (now - dotBorn) / 420)
      const s = 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2
      const r = dot.r * Math.max(0, s)
      if (r > 0) {
        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(dot.x, dot.y - sy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      return t < 1
    }
    return false
  }

  function frame(now: number): void {
    if (destroyed)
      return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!started)
      started = now
    if (now - started > 500)
      advance(dt)
    if (destroyed)
      return
    const moving = thread()
    if (flowing?.() || now >= wake)
      dirty = true
    if (dirty || moving || window.scrollY !== lastScroll || (dot && dotBorn && now - dotBorn < 500)) {
      draw(now)
      dirty = false
      lastScroll = window.scrollY
    }
    if (!destroyed)
      raf = requestAnimationFrame(frame)
  }

  function setColors(colors: LayerColors): void {
    if (destroyed)
      return
    ink = colors.ink
    accent = colors.accent
    dirty = true
  }

  function destroy(): void {
    if (destroyed)
      return
    destroyed = true
    cancelAnimationFrame(raf)
    window.clearTimeout(resizeTimer)
    ac.abort()
    for (const probe of probes)
      probe.remove()
    canvas.remove()
    html.classList.remove('has-stroke')
    if (hand)
      html.classList.remove('has-hand')
  }

  resize()
  build()
  window.addEventListener('resize', () => {
    resize()
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(rebuild, 120)
  }, { signal })
  raf = requestAnimationFrame(frame)

  return { setColors, destroy }
}
