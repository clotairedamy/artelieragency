<script setup lang="ts">
// Inline SVG paths rather than an icon package: a few dozen glyphs do not justify a
// dependency, and inlining means they inherit `currentColor` and ship in the
// same request as the markup.
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const paths: Record<string, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  alert: 'M12 4 2.5 20.5h19zM12 10v4M12 17.5v.5',
  layers: 'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M8 14.5v5',
  chart: 'M4 20V9M9.5 20V4M15 20v-7M20.5 20v-4',
  flow: 'M5 6h6a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3h2M3 6h1M19 18h2M16 3l3 3-3 3',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  chevrons: 'M13 6l-6 6 6 6M19 6l-6 6 6 6',
  check: 'M4 12.5l5 5L20 6.5',
  plus: 'M12 5v14M5 12h14',
  code: 'M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',

  // Artelier's own glyphs. Each borrows from the mark: either the A's legs,
  // which always rise two for every one across, or the window frame with a
  // sidebar that the A turns into. That shared geometry is what makes them
  // read as one family rather than twelve icons from twelve packs.
  mark: 'M3.5 21 12 4l8.5 17M7.5 15.5h9',
  dashboard: 'M3 4h18v16H3zM8.5 4v16M5.5 8h.5M5.5 11h.5M12.5 16.5v-3M15.5 16.5v-7M18.5 16.5v-5',
  discovery: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.2 15.2l5.3 5.3M8.5 12.5l2-4 2 4',
  blueprint: 'M3 4h18v16H3zM3 8.5h18M6.5 12h5v4.5h-5zM14.5 12.5H18M14.5 16h2',
  system: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM16.75 13.5 20 20h-6.5z',
  signal: 'M3 20h18M3.5 16.5 6.5 14 9 15l4-8 4 8 1.75-2L21 14',
  gauge: 'M3.5 16a8.5 8.5 0 0 1 17 0M12 16l4-5.5M12 7.5V9M6 10l1 1M18 10l-1 1M12 16h.01',
  ascend: 'M8 11l4-8 4 8M8 20l4-8 4 8',
  prototype: 'M10 15H3V4h18v7M13 13l7.5 2.8-3.2 1.2-1.2 3.2z',
  access: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5h.01M8 10h8M12 10v3.5l-2 4M12 13.5l2 4',
  handoff: 'M3 4h18v16H3zM9.5 9.5 7 12l2.5 2.5M14.5 9.5 17 12l-2.5 2.5',
  engine: 'M12 2.5l8.25 4.75v9.5L12 21.5l-8.25-4.75v-9.5zM8.5 16 12 9l3.5 7M10.25 13.5h3.5',
  theme: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18M12 7.5h4.5M12 12h6M12 16.5h4.5',
  audit: 'M9 3.5h6v3H9zM9 5H5.5v15.5h13V5H15M8.5 13.5l2.5 2.5 4.5-5',
  table: 'M3 4h18v16H3zM3 9h18M3 14.5h18M9 4v16',
}
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[props.name] ?? paths.grid" />
  </svg>
</template>
