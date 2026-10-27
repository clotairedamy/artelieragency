<script setup lang="ts">
// A sparkline, painted by hand. The arithmetic is a pure function so it can be
// reasoned about without a chart library's opinions, and the whole component
// costs a few hundred bytes rather than a dependency.
//
// Point at it (or drag a finger along it) and it reads out: a crosshair, the
// point on the line, and the value — the inspection every real dashboard
// chart offers, which is most of what makes one feel like an instrument. The
// arrow keys do the same from the keyboard, and the readout is spoken.
//
// `label` is the chart's name and is required: the SVG's accessible name is
// built from it plus the first, last, lowest and highest values, which is what
// a reader glancing at a sparkline takes from it anyway.
const props = withDefaults(
  defineProps<{ points: number[]; label: string; fill?: boolean; unit?: string; pointLabel?: (i: number) => string }>(),
  { fill: true, unit: '', pointLabel: undefined },
)

const W = 240
const H = 64
// Sanitised: an id with a colon in it breaks `url(#…)`.
const fadeId = `ads-sparkline-${useId().replace(/[^\w-]/g, '-')}`

const geometry = computed(() => path(props.points, W, H))
const fmt = (n: number) => `${n.toLocaleString('en-GB')}${props.unit}`

function path(values: number[], w: number, h: number) {
  if (values.length < 2) return { line: '', area: '', coords: [] as (readonly [number, number])[] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = w / (values.length - 1)
  const coords = values.map((v, i) => {
    const x = i * step
    // 4px of padding top and bottom so the stroke is never clipped.
    const y = h - 4 - ((v - min) / span) * (h - 8)
    return [x, y] as const
  })

  // A Catmull-Rom-ish smoothing: each segment gets control points a third of
  // the way toward its neighbours, which reads as a curve without overshoot.
  let line = `M${coords[0]![0]} ${coords[0]![1].toFixed(2)}`
  for (let i = 0; i < coords.length - 1; i++) {
    const [x0, y0] = coords[i]!
    const [x1, y1] = coords[i + 1]!
    const cx = (x0 + x1) / 2
    line += ` C${cx.toFixed(2)} ${y0.toFixed(2)} ${cx.toFixed(2)} ${y1.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`
  }
  return { line, area: `${line} L${w} ${h} L0 ${h} Z`, coords }
}

const summary = computed(() => {
  const p = props.points
  if (!p.length) return `${props.label}: no data`
  return `${props.label}: ${p.length} points, from ${fmt(p[0]!)} to ${fmt(p[p.length - 1]!)}, low ${fmt(Math.min(...p))}, high ${fmt(Math.max(...p))}`
})

// ─── Inspection ──────────────────────────────────────────────────────────
const hover = ref<number | null>(null)

function inspect(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  hover.value = Math.round(t * (props.points.length - 1))
}

function onKey(e: KeyboardEvent) {
  const last = props.points.length - 1
  const i = hover.value ?? last
  if (e.key === 'ArrowLeft') hover.value = Math.max(0, i - 1)
  else if (e.key === 'ArrowRight') hover.value = Math.min(last, i + 1)
  else if (e.key === 'Home') hover.value = 0
  else if (e.key === 'End') hover.value = last
  else if (e.key === 'Escape') hover.value = null
  else return
  e.preventDefault()
}

const readout = computed(() => {
  const i = hover.value
  const c = i === null ? undefined : geometry.value.coords[i]
  if (i === null || !c) return null
  return {
    x: (c[0] / W) * 100,
    y: (c[1] / H) * 100,
    value: fmt(props.points[i]!),
    label: props.pointLabel?.(i) ?? `#${i + 1}`,
    // Keep the bubble inside the chart at either end.
    align: c[0] / W < 0.2 ? 'is-start' : c[0] / W > 0.8 ? 'is-end' : '',
  }
})
</script>

<template>
  <div
    class="ads-sparkline"
    role="group"
    tabindex="0"
    :aria-label="label"
    @pointermove="inspect"
    @pointerdown="inspect"
    @pointerleave="hover = null"
    @pointercancel="hover = null"
    @keydown="onKey"
    @blur="hover = null"
  >
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="ads-sparkline__svg" role="img" :aria-label="summary">
      <defs>
        <linearGradient :id="fadeId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path v-if="fill" :d="geometry.area" :fill="`url(#${fadeId})`" />
      <path
        :d="geometry.line"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
      />
    </svg>
    <template v-if="readout">
      <span class="ads-sparkline__cross" :style="{ left: `${readout.x}%` }" />
      <span class="ads-sparkline__point" :style="{ left: `${readout.x}%`, top: `${readout.y}%` }" />
      <span class="ads-sparkline__bubble num" :class="readout.align" :style="{ left: `${readout.x}%` }" aria-hidden="true">
        <b>{{ readout.value }}</b> {{ readout.label }}
      </span>
    </template>
    <span class="sr-only" aria-live="polite">{{ readout ? `${readout.value}, ${readout.label}` : '' }}</span>
  </div>
</template>

<style scoped>
.ads-sparkline {
  position: relative;
  touch-action: pan-y;
  cursor: crosshair;
}

.ads-sparkline__svg {
  display: block;
  width: 100%;
  height: 64px;
  color: var(--text);
}

.ads-sparkline__cross {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line-strong);
  pointer-events: none;
}

/* Follows the pointer, so it moves in a frame or two rather than on the
   control duration — a dot that lags the hand reads as broken, not smooth. */
.ads-sparkline__point {
  position: absolute;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background: var(--text);
  box-shadow: 0 0 0 3px var(--raised);
  pointer-events: none;
  transition:
    left 0.08s var(--ease),
    top 0.08s var(--ease);
}

.ads-sparkline__bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  padding: var(--sp-1) 9px;
  border-radius: 8px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.68rem;
  white-space: nowrap;
  pointer-events: none;
}

.ads-sparkline__bubble.is-start {
  transform: translateX(-12px);
}

.ads-sparkline__bubble.is-end {
  transform: translateX(calc(-100% + 12px));
}

.ads-sparkline__bubble b {
  font-weight: 600;
}
</style>
