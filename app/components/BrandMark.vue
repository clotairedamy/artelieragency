<script setup lang="ts">
// The mark: an A that becomes a dashboard as you scroll.
//
// Both states are drawn with the same strokes, point for point, so the morph
// is plain interpolation rather than a crossfade between two pictures:
//
//   A                         dashboard
//   the legs        ──────▶   the window frame (the apex splits into the top
//                             edge, the bottom edge sweeps in from the right)
//   the crossbar    ──────▶   the sidebar divider (it pivots upright)
//   the apex        ──────▶   two nav rows, spilling down into the sidebar
//   the crossbar    ──────▶   three bars, growing out of where it used to be
//
// Each stroke moves in its own window of the scroll, so the change reads as a
// sequence — frame, then divider, then content — rather than everything
// sliding at once. Without `morph` it is simply the A.
const props = withDefaults(defineProps<{ size?: number; morph?: boolean }>(), {
  size: 32,
  morph: false,
})

type Pt = readonly [number, number]
type Stroke = { from: Pt[]; to: Pt[]; window: readonly [number, number]; fade?: boolean }

const strokes: Stroke[] = [
  // Legs → frame. The doubled points are where the A has a corner the frame
  // needs two of.
  {
    from: [[5, 27], [16, 5], [16, 5], [27, 27], [27, 27]],
    to: [[4, 27], [4, 5], [28, 5], [28, 27], [4, 27]],
    window: [0, 0.7],
  },
  // Crossbar → sidebar divider.
  {
    from: [[10.4, 19.5], [21.6, 19.5]],
    to: [[11, 5], [11, 27]],
    window: [0.12, 0.82],
  },
  // Apex → nav rows.
  { from: [[16, 5], [16, 5]], to: [[6.8, 10], [8.2, 10]], window: [0.35, 0.95], fade: true },
  { from: [[16, 5], [16, 5]], to: [[6.8, 14], [8.2, 14]], window: [0.4, 1], fade: true },
  // Crossbar → bars.
  { from: [[13, 19.5], [13, 19.5]], to: [[16, 23], [16, 17]], window: [0.42, 0.92], fade: true },
  { from: [[16, 19.5], [16, 19.5]], to: [[20, 23], [20, 11]], window: [0.48, 0.98], fade: true },
  { from: [[19, 19.5], [19, 19.5]], to: [[24, 23], [24, 15]], window: [0.54, 1], fade: true },
]

// How far down the page the morph completes. Short enough that the
// dashboard has arrived by the time the first section is in view.
const RANGE = 240

const progress = ref(0)

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const local = (p: number, [a, b]: readonly [number, number]) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))))
const fmt = (n: number) => Math.round(n * 100) / 100

const paths = computed(() =>
  strokes.map((s) => {
    const t = local(progress.value, s.window)
    const d = s.from
      .map(([x, y], i) => {
        const [tx, ty] = s.to[i]!
        return `${i ? 'L' : 'M'}${fmt(x + (tx - x) * t)} ${fmt(y + (ty - y) * t)}`
      })
      .join('')
    // Strokes that only exist in the dashboard fade in as they travel, so the
    // A never shows a stray dot where they wait.
    return { d, opacity: s.fade ? Math.min(1, t * 1.6) : 1 }
  }),
)

onMounted(() => {
  if (!props.morph) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0

  const update = () => {
    frame = 0
    const p = Math.min(1, window.scrollY / RANGE)
    // Under reduced motion the mark still changes state — it is information
    // about where you are — but in one step rather than a travelling shape.
    progress.value = reduced.matches ? (p > 0.5 ? 1 : 0) : p
  }
  const onScroll = () => {
    frame ||= requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  })
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(p, i) in paths" :key="i" :d="p.d" :opacity="p.opacity" />
  </svg>
</template>
