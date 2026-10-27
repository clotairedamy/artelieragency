<script setup lang="ts">
// A density grid. Value maps to opacity, which is the only channel a
// monochrome palette has left — and, as it happens, the channel the eye reads
// fastest for magnitude.
const props = withDefaults(defineProps<{ cols?: number; rows?: number }>(), { cols: 24, rows: 7 })

// A deterministic field rather than Math.random(), so the server render and
// the client render agree and Vue does not throw a hydration mismatch.
const cells = computed(() =>
  Array.from({ length: props.rows }, (_, y) =>
    Array.from({ length: props.cols }, (_, x) => {
      const wave = Math.sin(x / 3.1 + y / 1.7) * 0.5 + 0.5
      const drift = Math.sin((x * 7 + y * 13) / 11) * 0.5 + 0.5
      return Math.round((wave * 0.65 + drift * 0.35) * 4)
    }),
  ),
)
</script>

<template>
  <div class="heat sweep" aria-hidden="true">
    <div v-for="(row, y) in cells" :key="y" class="heat-row">
      <span
        v-for="(v, x) in row"
        :key="x"
        class="cell"
        :style="{ opacity: 0.08 + v * 0.22 }"
      />
    </div>
  </div>
</template>

<style scoped>
.heat {
  display: grid;
  gap: 4px;
}

.heat-row {
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
}

.cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: var(--accent);
  transition: opacity 0.6s var(--ease);
}
</style>
