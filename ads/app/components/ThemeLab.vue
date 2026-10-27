<script setup lang="ts">
// The theme lab.
//
// Every token on this page is a CSS custom property on :root, which means the
// whole site can be rethemed live from four controls. That is the entire
// argument for building a design system as tokens rather than as a set of
// finished screens, and it is more convincing to hand someone the sliders
// than to describe it.
//
// Depth is the interesting one: it scales the two shadows that make this
// style work. At zero the page goes flat and you can see exactly how much of
// the design was doing its job through elevation alone.
const { theme, set: setTheme } = useTheme()
const radius = ref(20)
const depth = ref(1)
const density = ref<'comfortable' | 'compact'>('comfortable')

// The shadow pair from the app's Soft.raised, as a function of depth: an 8px
// offset and a 28px blur at depth 1. Two darks rather than one — a tight
// contact shadow that reads as thickness, and a wide fall that seats the
// shape on the page.
function shadows(d: number) {
  const o = 8 * d
  const b = 28 * d
  const r = (n: number) => n.toFixed(2)
  return {
    raised: `${r(o * 0.45)}px ${r(o * 0.6)}px ${r(b * 0.3)}px var(--shade), ${r(o)}px ${r(o)}px ${r(b)}px var(--shade-soft), ${r(-o * 0.65)}px ${r(-o * 0.65)}px ${r(b * 0.75)}px var(--highlight)`,
    raisedSm: `${r(o * 0.22)}px ${r(o * 0.3)}px ${r(b * 0.15)}px var(--shade), ${r(o * 0.5)}px ${r(o * 0.5)}px ${r(b * 0.5)}px var(--shade-soft), ${r(-o * 0.32)}px ${r(-o * 0.32)}px ${r(b * 0.38)}px var(--highlight)`,
    raisedLg: `${r(o * 0.72)}px ${r(o * 0.96)}px ${r(b * 0.48)}px var(--shade), ${r(o * 1.6)}px ${r(o * 1.6)}px ${r(b * 1.6)}px var(--shade-soft), ${r(-o * 1.04)}px ${r(-o * 1.04)}px ${r(b * 1.2)}px var(--highlight)`,
    inset: `inset ${r(o * 0.4)}px ${r(o * 0.4)}px ${r(b * 0.29)}px var(--shade), inset ${r(-o * 0.4)}px ${r(-o * 0.4)}px ${r(b * 0.29)}px var(--highlight)`,
    insetSm: `inset ${r(o * 0.25)}px ${r(o * 0.25)}px ${r(b * 0.18)}px var(--shade), inset ${r(-o * 0.25)}px ${r(-o * 0.25)}px ${r(b * 0.18)}px var(--highlight)`,
  }
}

function apply() {
  const root = document.documentElement
  root.style.setProperty('--radius', `${radius.value}px`)
  root.style.setProperty('--radius-lg', `${Math.round(radius.value * 1.3)}px`)
  root.style.setProperty('--radius-sm', `${Math.max(4, Math.round(radius.value * 0.65))}px`)

  const s = shadows(depth.value)
  root.style.setProperty('--soft-raised', s.raised)
  root.style.setProperty('--soft-raised-sm', s.raisedSm)
  root.style.setProperty('--soft-raised-lg', s.raisedLg)
  root.style.setProperty('--soft-inset', s.inset)
  root.style.setProperty('--soft-inset-sm', s.insetSm)

  const compact = density.value === 'compact'
  root.style.setProperty('--gutter', compact ? '16px' : '24px')
  root.style.setProperty('--row-h', compact ? '28px' : '34px')
}

function reset() {
  setTheme('light')
  radius.value = 20
  depth.value = 1
  density.value = 'comfortable'
}

onMounted(() => watchEffect(apply))

onBeforeUnmount(() => {
  // Leave the page as it was found if this component ever unmounts.
  const root = document.documentElement
  for (const p of [
    '--radius',
    '--radius-lg',
    '--radius-sm',
    '--soft-raised',
    '--soft-raised-sm',
    '--soft-raised-lg',
    '--soft-inset',
    '--soft-inset-sm',
    '--gutter',
    '--row-h',
  ]) {
    root.style.removeProperty(p)
  }
})
</script>

<template>
  <div class="card ads-theme-lab">
    <div class="ads-theme-lab__head">
      <div>
        <span class="eyebrow">Live tokens</span>
        <h3 class="h3">Retheme this page.</h3>
      </div>
      <button class="btn btn-quiet" type="button" @click="reset">Reset tokens</button>
    </div>

    <div class="ads-theme-lab__controls">
      <div class="ads-theme-lab__control">
        <span id="lab-theme" class="eyebrow ads-theme-lab__label">Theme</span>
        <div class="ads-segmented ads-theme-lab__segmented" role="group" aria-labelledby="lab-theme">
          <button
            v-for="t in (['light', 'dark'] as const)"
            :key="t"
            type="button"
            :class="{ 'is-on': theme === t }"
            :aria-pressed="theme === t"
            @click="setTheme(t, { x: ($event as MouseEvent).clientX, y: ($event as MouseEvent).clientY })"
          >
            {{ t === 'light' ? 'Light' : 'Dark' }}
          </button>
        </div>
      </div>

      <div class="ads-theme-lab__control">
        <span id="lab-density" class="eyebrow ads-theme-lab__label">Density</span>
        <div class="ads-segmented ads-theme-lab__segmented" role="group" aria-labelledby="lab-density">
          <button
            v-for="d in (['comfortable', 'compact'] as const)"
            :key="d"
            type="button"
            :class="{ 'is-on': density === d }"
            :aria-pressed="density === d"
            @click="density = d"
          >
            {{ d === 'comfortable' ? 'Comfortable' : 'Compact' }}
          </button>
        </div>
      </div>

      <div class="ads-theme-lab__control">
        <label class="eyebrow ads-theme-lab__label" for="lab-radius">
          Corner radius <span class="num ads-theme-lab__readout">{{ radius }}px</span>
        </label>
        <input id="lab-radius" v-model.number="radius" class="ads-range" type="range" min="4" max="34" step="1">
      </div>

      <div class="ads-theme-lab__control">
        <label class="eyebrow ads-theme-lab__label" for="lab-depth">
          Shadow depth <span class="num ads-theme-lab__readout">{{ depth.toFixed(2) }}×</span>
        </label>
        <input id="lab-depth" v-model.number="depth" class="ads-range" type="range" min="0" max="2" step="0.05">
      </div>
    </div>

    <p class="body ads-theme-lab__foot">
      Four properties, one stylesheet, every surface on the site. Drag depth to
      zero and watch how much of this design was elevation doing the work.
    </p>
  </div>
</template>

<style scoped>
.ads-theme-lab {
  display: grid;
  gap: var(--sp-5);
}

.ads-theme-lab__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
}

.ads-theme-lab__head .eyebrow {
  margin-bottom: 7px;
}

.ads-theme-lab__controls {
  display: grid;
  gap: 20px;
}

@media (min-width: 620px) {
  .ads-theme-lab__controls {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ads-theme-lab__control {
  display: grid;
  gap: 11px;
}

.ads-theme-lab__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.ads-theme-lab__readout {
  color: var(--text);
  font-size: 0.74rem;
  letter-spacing: 0;
  text-transform: none;
}

/* The shared segmented control, stretched to the column so the two rows of
   controls line up. */
.ads-theme-lab__segmented {
  display: grid;
}

.ads-theme-lab__foot {
  margin: 0;
  max-width: 54ch;
}
</style>
