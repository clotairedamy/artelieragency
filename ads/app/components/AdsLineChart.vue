<script setup lang="ts">
// A line chart — the same hand-drawn SVG aesthetic as the sparkline, but with
// a visible scale and a filled area. Value maps to the accent.
const props = withDefaults(defineProps<{ points: number[]; height?: number }>(), { height: 160 })

const W = 600
const H = 160

const geometry = computed(() => {
  const pts = props.points
  if (pts.length < 2) return { line: '', area: '' }
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const span = max - min || 1
  const step = W / (pts.length - 1)
  const coords = pts.map((v, i) => {
    const x = i * step
    const y = H - 8 - ((v - min) / span) * (H - 16)
    return [x, y] as const
  })
  let line = `M${coords[0][0]} ${coords[0][1].toFixed(1)}`
  for (let i = 1; i < coords.length; i++) {
    line += ` L${coords[i][0].toFixed(1)} ${coords[i][1].toFixed(1)}`
  }
  return { line, area: `${line} L${W} ${H} L0 ${H} Z` }
})
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="line" :style="{ height: `${height}px` }" aria-hidden="true">
    <path v-if="geometry.area" :d="geometry.area" fill="currentColor" opacity="0.12" />
    <path
      :d="geometry.line"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      vector-effect="non-scaling-stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.line {
  display: block;
  width: 100%;
  color: var(--text);
}
</style>
