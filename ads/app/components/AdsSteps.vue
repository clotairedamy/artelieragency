<script setup lang="ts">
// Where you are in a sequence with a known end. Distinct from a progress bar:
// this counts discrete stages, not percentage.
export type Step = { label: string; state?: 'done' | 'now' | 'todo' }

defineProps<{ steps: Step[] }>()
</script>

<template>
  <ol class="ads-steps">
    <li v-for="(s, i) in steps" :key="i" :class="{ 'is-done': s.state === 'done', 'is-now': s.state === 'now' }">
      <span class="pip">{{ s.state === 'done' ? '✓' : i + 1 }}</span>
      {{ s.label }}
    </li>
  </ol>
</template>
