<script setup lang="ts">
// A sparkline, painted by hand. The arithmetic is a pure function so it can be
// reasoned about without a chart library's opinions, and the whole component
// costs a few hundred bytes rather than a dependency.
const props = withDefaults(defineProps<{ points: number[]; fill?: boolean }>(), { fill: true })

const W = 240
const H = 64

const geometry = computed(() => path(props.points, W, H))

function path(values: number[], w: number, h: number) {
  if (values.length < 2) return { line: '', area: '' }
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
  return { line, area: `${line} L${w} ${h} L0 ${h} Z` }
}
</script>

<template>
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
</template>

<style scoped>
.spark {
  width: 100%;
  height: 64px;
  color: var(--text);
}
</style>
