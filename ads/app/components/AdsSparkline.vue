<script setup lang="ts">
// A sparkline, painted by hand. The arithmetic is a pure function so it can be
// reasoned about without a chart library's opinions, and the whole component
// costs a few hundred bytes rather than a dependency.
//
// Point at it (or drag a finger along it) and it reads out: a crosshair, the
// point on the line, and the value — the inspection every real dashboard
// chart offers, which is most of what makes one feel like an instrument.
const props = withDefaults(
  defineProps<{ points: number[]; fill?: boolean; unit?: string; label?: (i: number) => string }>(),
  { fill: true, unit: '', label: undefined },
)

const W = 240
const H = 64

const geometry = computed(() => path(props.points, W, H))

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

// ─── Inspection ──────────────────────────────────────────────────────────
const hover = ref<number | null>(null)

function inspect(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  hover.value = Math.round(t * (props.points.length - 1))
}

const readout = computed(() => {
  const i = hover.value
  const c = i === null ? undefined : geometry.value.coords[i]
  if (i === null || !c) return null
  return {
    x: (c[0] / W) * 100,
    y: (c[1] / H) * 100,
    value: props.points[i]!,
    label: props.label?.(i) ?? `#${i + 1}`,
    // Keep the bubble inside the chart at either end.
    align: c[0] / W < 0.2 ? 'start' : c[0] / W > 0.8 ? 'end' : 'mid',
  }
})
</script>

<template>
  <div
    class="spark-wrap"
    @pointermove="inspect"
    @pointerdown="inspect"
    @pointerleave="hover = null"
    @pointercancel="hover = null"
  >
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="spark" aria-hidden="true">
      <defs>
        <linearGradient :id="'sparkfade'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path v-if="fill" class="spark-area" :d="geometry.area" fill="url(#sparkfade)" />
      <path
        class="spark-line"
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
      <span class="cross" :style="{ left: `${readout.x}%` }" />
      <span class="point" :style="{ left: `${readout.x}%`, top: `${readout.y}%` }" />
      <span class="bubble num" :class="readout.align" :style="{ left: `${readout.x}%` }">
        <b>{{ readout.value }}{{ unit }}</b> {{ readout.label }}
      </span>
    </template>
  </div>
</template>

<style scoped>
.spark-wrap {
  position: relative;
  touch-action: pan-y;
  cursor: crosshair;
}

.spark {
  display: block;
  width: 100%;
  height: 64px;
  color: var(--text);
}

.cross {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--line-strong);
  pointer-events: none;
}

.point {
  position: absolute;
  width: 9px;
  height: 9px;
  margin: -4.5px 0 0 -4.5px;
  border-radius: 50%;
  background: var(--text);
  box-shadow: 0 0 0 3px var(--raised);
  pointer-events: none;
  transition:
    left 0.08s linear,
    top 0.08s linear;
}

.bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  padding: 4px 9px;
  border-radius: 8px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.68rem;
  white-space: nowrap;
  pointer-events: none;
}

.bubble.start {
  transform: translateX(-12px);
}

.bubble.end {
  transform: translateX(calc(-100% + 12px));
}

.bubble b {
  font-weight: 600;
}
</style>
