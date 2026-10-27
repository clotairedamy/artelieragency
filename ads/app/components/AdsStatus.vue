<script setup lang="ts">
// Severity in a monochrome system is luminance: the worse it is, the brighter
// it is. The glyph (dot) carries it too, and the label is required, so the
// rank survives a greyscale print and a colour-vision deficiency alike.
//
// `grade` is for dense data — a severity column, a heat grid. `tone` is for a
// single state outside it (a health check, a job), where the three semantic
// colours are allowed; it wins over `grade` when both are given. There is no
// colour prop on purpose: state has three colours and they are spoken for.
withDefaults(
  defineProps<{ label: string; grade?: 1 | 2 | 3 | 4; tone?: 'ok' | 'warn' | 'bad' }>(),
  { grade: 1, tone: undefined },
)
</script>

<template>
  <span class="ads-status" :class="tone ? `is-${tone}` : `g${grade}`">
    <span class="ads-dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.ads-status.is-ok { color: var(--ok); }
.ads-status.is-warn { color: var(--warn); }
.ads-status.is-bad { color: var(--bad); }
</style>
