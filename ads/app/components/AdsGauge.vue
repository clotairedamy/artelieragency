<script setup lang="ts">
// A dial, drawn rather than animated frame by frame: it moves only when a new
// value arrives and eases between the two.
//
//         ╭ ticks ╮
//      ·············        outer ring: the scale
//    ·   ╭───────╮   ·
//   ·   │   64    │   ·     centre: the live value
//   ·   │ SCROLL  │   ·
//    ·   ╰───────╯   ·      inner arc: progress through the range
//      ·············
//
// A dial shows a changing rate far better than a number does: the eye reads
// the position of the needle without reading the digits.
const props = withDefaults(
  defineProps<{ value: number; max?: number; label: string; unit?: string }>(),
  { max: 100, unit: '' },
)

const SWEEP = 260 // degrees of arc the scale covers
const START = 140 // where it begins, measured clockwise from 3 o'clock
const R = 54
const CX = 64
const CY = 64

const eased = ref(0)
// False until the first value has been applied; see the watcher below.
let primed = false

// Ease toward the live value so the needle never snaps.
watch(
  () => props.value,
  (to) => {
    const from = eased.value
    const delta = to - from
    // The first run always sets rather than animates. On the server there is
    // no rAF to call, and on the client an opening animation from zero would
    // disagree with the needle the server already drew — which is a
    // hydration mismatch on every tick mark. Only later changes ease.
    if (!primed || Math.abs(delta) < 0.5) {
      primed = true
      eased.value = to
      return
    }
    const begun = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - begun) / 420)
      eased.value = from + delta * (1 - Math.pow(1 - t, 3))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  },
  { immediate: true },
)

const fraction = computed(() => Math.max(0, Math.min(1, eased.value / props.max)))

// Rounded to two decimals, which is finer than a device pixel at any size
// this gauge is drawn at. Unrounded, Node and the browser disagree on the
// last bit of the mantissa for the same trigonometry, and every tick becomes
// a hydration mismatch.
function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180
  return [
    Math.round((CX + radius * Math.cos(rad)) * 100) / 100,
    Math.round((CY + radius * Math.sin(rad)) * 100) / 100,
  ] as const
}

function arc(from: number, to: number, radius: number) {
  const [x1, y1] = polar(from, radius)
  const [x2, y2] = polar(to, radius)
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return `M${x1} ${y1} A${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`
}

const track = arc(START, START + SWEEP, R)
const progress = computed(() => arc(START, START + SWEEP * Math.max(fraction.value, 0.001), R))

// The scale: a tick every 10% of the sweep.
const ticks = Array.from({ length: 14 }, (_, i) => {
  const angle = START + (SWEEP / 13) * i
  const [x1, y1] = polar(angle, R + 7)
  const [x2, y2] = polar(angle, R + (i % 3 === 0 ? 12 : 10))
  return { x1, y1, x2, y2, major: i % 3 === 0 }
})

const needle = computed(() => polar(START + SWEEP * fraction.value, R - 13))
const shown = computed(() => Math.round(eased.value))
</script>

<template>
  <div class="gauge">
    <svg viewBox="0 0 128 128" role="img" :aria-label="`${label}: ${shown}${unit}`">
      <g class="ticks">
        <line
          v-for="(t, i) in ticks"
          :key="i"
          :x1="t.x1"
          :y1="t.y1"
          :x2="t.x2"
          :y2="t.y2"
          :opacity="t.major ? 0.55 : 0.22"
        />
      </g>
      <path :d="track" class="track" />
      <path :d="progress" class="progress" />
      <line :x1="CX" :y1="CY" :x2="needle[0]" :y2="needle[1]" class="needle" />
      <!-- The cap is drawn over the needle so the reading is never crossed by
           it. Without this the digits and the needle fight at every value
           between 40% and 60%. -->
      <circle :cx="CX" :cy="CY" r="31" class="cap" />
    </svg>
    <div class="read">
      <span class="num value">{{ shown }}<span class="unit">{{ unit }}</span></span>
      <span class="eyebrow">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.gauge {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 190px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised);
  padding: 10px;
}

svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ticks line {
  stroke: var(--text);
  stroke-width: 1.4;
  stroke-linecap: round;
}

.track {
  fill: none;
  stroke: var(--canvas);
  stroke-width: 7;
  stroke-linecap: round;
  opacity: 0.85;
}

.progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 7;
  stroke-linecap: round;
}

.needle {
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.8;
}

.cap {
  fill: var(--raised);
}

.read {
  position: absolute;
  display: grid;
  justify-items: center;
  gap: 3px;
  pointer-events: none;
}

.value {
  font-size: 1.68rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

.unit {
  font-size: 0.78rem;
  color: var(--subdued);
  margin-left: 1px;
}

.read .eyebrow {
  font-size: 0.56rem;
  letter-spacing: 0.22em;
}
</style>
