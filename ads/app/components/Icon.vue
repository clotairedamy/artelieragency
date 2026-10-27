<script setup lang="ts">
// Inline SVG rather than an icon package: the glyphs live in utils/glyphs.ts,
// inherit `currentColor`, and ship in the same request as the markup.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

// Soft layers are the chrome of a glyph — its frame, its track. Low enough to
// recede behind the strong stroke, high enough to survive the light theme.
const SOFT = 0.38

const layers = computed<Layer[]>(() => {
  const g = glyphs[props.name] ?? glyphs.grid!
  return typeof g === 'string' ? [{ d: g }] : g
})
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-for="(l, i) in layers" :key="i">
      <path
        v-if="'d' in l"
        :d="l.d"
        :fill="l.fill ? 'currentColor' : undefined"
        :stroke="l.fill ? 'none' : undefined"
        :opacity="l.soft ? SOFT : undefined"
      />
      <rect
        v-else-if="'rect' in l"
        :x="l.rect[0]"
        :y="l.rect[1]"
        :width="l.rect[2]"
        :height="l.rect[3]"
        :rx="l.rect[4]"
        :opacity="l.soft ? SOFT : undefined"
      />
      <circle
        v-else
        :cx="l.circle[0]"
        :cy="l.circle[1]"
        :r="l.circle[2]"
        :fill="l.fill ? 'currentColor' : undefined"
        :stroke="l.fill ? 'none' : undefined"
        :opacity="l.soft ? SOFT : undefined"
      />
    </template>
  </svg>
</template>
