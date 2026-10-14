import type { Ref } from 'vue'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const DURATION = 520

function textBox(el: HTMLElement): DOMRect {
  const range = document.createRange()
  range.selectNodeContents(el)
  return range.getBoundingClientRect()
}

function box(el: HTMLElement): DOMRect {
  return el.classList.contains('l-label') ? textBox(el) : el.getBoundingClientRect()
}

/** Glide the homepage measure when it switches between the wide and narrow grids. */
export function useMeasureMotion(root: Ref<HTMLElement | undefined>): void {
  const playing: Animation[] = []
  let narrow = false
  let glideWidth = 0
  let previous = new Map<HTMLElement, DOMRect>()

  function targets(el: HTMLElement): HTMLElement[] {
    if (!el.querySelector('.lig-hero'))
      return []
    // The foot itself is not moved: a transform on it would become the tagline's containing block.
    return [...el.querySelectorAll<HTMLElement>('.lig-hero .l-lede, .lig-hero ~ .l-section .l-label, .lig-hero ~ .l-section .l-body')]
  }

  function snapshot(list: HTMLElement[]): Map<HTMLElement, DOMRect> {
    return new Map(list.map(el => [el, box(el)]))
  }

  function stop(): void {
    for (const anim of playing)
      anim.cancel()
    playing.length = 0
  }

  function remember(): void {
    const el = root.value
    if (!el || playing.length)
      return
    previous = snapshot(targets(el))
  }

  function glide(list: HTMLElement[], from: Map<HTMLElement, DOMRect>, to: Map<HTMLElement, DOMRect>): void {
    stop()
    for (const el of list) {
      const a = from.get(el)
      const b = to.get(el)
      if (!a || !b)
        continue
      const dx = a.left - b.left
      const dy = a.top - b.top
      if (Math.hypot(dx, dy) < 1)
        continue
      const anim = el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }],
        { duration: DURATION, easing: EASE, fill: 'both' },
      )
      playing.push(anim)
      anim.onfinish = () => {
        anim.cancel()
        const index = playing.indexOf(anim)
        if (index >= 0)
          playing.splice(index, 1)
        remember()
      }
    }
  }

  function onResize(): void {
    const el = root.value
    if (!el)
      return
    const next = window.matchMedia('(max-width: 860px)').matches
    const list = targets(el)
    if (next !== narrow && previous.size && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const current = snapshot(list)
      glide(list, previous, current)
      glideWidth = window.innerWidth
      narrow = next
      previous = current
      return
    }
    if (playing.length && Math.abs(window.innerWidth - glideWidth) > 28)
      stop()
    narrow = next
    remember()
  }

  onMounted(() => {
    narrow = window.matchMedia('(max-width: 860px)').matches
    remember()
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('resize', onResize)
  })
}
