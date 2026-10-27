<script setup lang="ts">
// A status marker: a glyph and a label, never a coloured dot on its own —
// status carried by colour alone fails a greyscale print and one reader in
// twelve. The colour comes from a closed set, so a caller cannot paint the
// chrome: `tone` for a state (ok, warn, bad, or neutral), or `grade` 1–4 for
// severity inside dense data, where three hues down four hundred rows is noise
// and luminance does the work instead (the worse, the brighter). Only the
// glyph takes the colour; the label stays in a text token at full contrast.
export type MarkerTone = 'neutral' | 'ok' | 'warn' | 'bad'

const props = withDefaults(defineProps<{ label: string; tone?: MarkerTone; grade?: 1 | 2 | 3 | 4 }>(), {
  tone: 'neutral',
  grade: undefined,
})

// Each tone has its own shape, so the state survives without the hue.
const glyph = computed(() => (props.grade ? null : { ok: 'check', warn: 'alert', bad: 'plus', neutral: null }[props.tone]))
</script>

<template>
  <span class="ads-marker" :class="grade ? `is-grade-${grade}` : `is-${tone}`">
    <span class="ads-marker__glyph" aria-hidden="true">
      <Icon v-if="glyph" :name="glyph" :size="13" :style="tone === 'bad' ? 'rotate: 45deg' : undefined" />
      <span v-else class="ads-marker__dot" />
    </span>
    <span class="ads-marker__label">{{ label }}</span>
    <slot />
  </span>
</template>

<style scoped>
.ads-marker {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.82rem;
  color: var(--text-soft);
}

.ads-marker__glyph {
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
  flex: none;
  color: var(--subdued);
}

.ads-marker__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.ads-marker.is-ok .ads-marker__glyph { color: var(--ok); }
.ads-marker.is-warn .ads-marker__glyph { color: var(--warn); }
.ads-marker.is-bad .ads-marker__glyph { color: var(--bad); }
.ads-marker.is-grade-1 .ads-marker__glyph { color: var(--grade-1); }
.ads-marker.is-grade-2 .ads-marker__glyph { color: var(--grade-2); }
.ads-marker.is-grade-3 .ads-marker__glyph { color: var(--grade-3); }
.ads-marker.is-grade-4 .ads-marker__glyph { color: var(--grade-4); }

.ads-marker__label {
  font-family: var(--font-label);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
