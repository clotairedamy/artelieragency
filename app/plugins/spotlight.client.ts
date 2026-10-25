// Cards catch the light. One listener for the whole document rather than
// one per card: it finds the card under the pointer, writes the pointer's
// position into that card's --mx/--my, and marks it `lit` so main.css paints
// the highlight. Mouse only — a finger has no hover to follow — and nothing
// at all under reduced motion.
export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let current: HTMLElement | null = null
  let raf = 0
  let last: PointerEvent | null = null

  const paint = () => {
    raf = 0
    const e = last
    if (!e) return
    const el = (e.target as Element | null)?.closest?.<HTMLElement>('.card, .tile') ?? null
    if (el !== current) {
      current?.classList.remove('lit')
      current = el
      current?.classList.add('lit')
    }
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      last = e
      raf ||= requestAnimationFrame(paint)
    },
    { passive: true },
  )

  document.addEventListener('pointerleave', () => {
    current?.classList.remove('lit')
    current = null
  })
})
