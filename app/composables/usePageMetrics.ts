/**
 * Live telemetry about the visit in progress.
 *
 * Every number the hero shows is measured, not invented. A studio that sells
 * instrumentation should not open with a fake chart, and the moment a reader
 * notices the dwell counter is counting *their* seconds, the page has made
 * its argument without a word of copy.
 *
 * Nothing here leaves the browser.
 */
export function usePageMetrics() {
  const scroll = ref(0) // 0–100, how far down the page
  const dwell = ref(0) // seconds on the page
  const fps = ref(60)
  const viewport = ref({ w: 0, h: 0 })
  const sectionsSeen = ref(0)

  onMounted(() => {
    let raf = 0
    let frames = 0
    let last = performance.now()
    const started = performance.now()
    const seen = new Set<string>()

    const measureScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll.value = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0
    }

    const measureViewport = () => {
      viewport.value = { w: window.innerWidth, h: window.innerHeight }
    }

    // One rAF loop drives the frame counter; scroll and resize only mark work
    // to be done, so neither handler does layout reads on the event itself.
    let dirty = true
    const tick = (now: number) => {
      frames++
      if (now - last >= 1000) {
        fps.value = Math.round((frames * 1000) / (now - last))
        frames = 0
        last = now
        dwell.value = Math.floor((now - started) / 1000)
      }
      if (dirty) {
        dirty = false
        measureScroll()
      }
      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      dirty = true
    }
    const onResize = () => {
      dirty = true
      measureViewport()
    }

    measureViewport()
    measureScroll()
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    // How much of the page has actually been looked at, as opposed to
    // scrolled past at speed.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target.id)) continue
          seen.add(entry.target.id)
          sectionsSeen.value = seen.size
        }
      },
      { threshold: 0.5 },
    )
    document.querySelectorAll('section[id]').forEach((el) => spy.observe(el))

    onBeforeUnmount(() => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      spy.disconnect()
    })
  })

  return { scroll, dwell, fps, viewport, sectionsSeen }
}
