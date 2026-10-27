<script setup lang="ts">
// Where you are in a sequence with a known end. Distinct from a progress bar:
// this counts discrete stages, not percentage.
//
// The state is never the pip's fill alone: a done step swaps its number for a
// tick, the current one is marked `aria-current="step"`, and both are spoken.
export type Step = { label: string; state?: 'done' | 'now' | 'todo' }

defineProps<{ steps: Step[] }>()
</script>

<template>
  <ol class="ads-steps">
    <li
      v-for="(s, i) in steps"
      :key="i"
      :class="{ 'is-done': s.state === 'done', 'is-now': s.state === 'now' }"
      :aria-current="s.state === 'now' ? 'step' : undefined"
    >
      <span class="pip num" aria-hidden="true">{{ s.state === 'done' ? '✓' : i + 1 }}</span>
      {{ s.label }}
      <span v-if="s.state === 'done'" class="sr-only">(done)</span>
      <span v-else-if="s.state === 'now'" class="sr-only">(current)</span>
    </li>
  </ol>
</template>
