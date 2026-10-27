<script setup lang="ts">
// Summary → detail: the pattern the whole system is arranged around. A ranked
// answer at the top, the reasoning one level down, the raw rows two levels
// down — and the reader never loses their place.
export type Rung = { title: string; body: string }

withDefaults(
  defineProps<{ rungs?: Rung[] }>(),
  {
    rungs: () => [
      { title: 'Answer.', body: 'One ranked list. "Fix the alt text on the blog template — 823 pages, two changes."' },
      { title: 'Reasoning.', body: 'An accordion or drawer: why this ranks first, what the score is made of.' },
      { title: 'Evidence.', body: 'The grid, filtered to the 823 rows, with the filter visible as a tag.' },
    ],
  },
)
</script>

<template>
  <ol class="ladder">
    <li v-for="(r, i) in rungs" :key="i" class="rung">
      <span class="num n">{{ i + 1 }}</span>
      <p class="body"><strong>{{ r.title }}</strong> {{ r.body }}</p>
    </li>
  </ol>
</template>

<style scoped>
.ladder {
  display: grid;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.rung {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.n {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.72rem;
  color: var(--text);
}

.body {
  font-size: 0.9rem;
  color: var(--text-soft);
  margin: 0;
}

.body strong {
  color: var(--text);
  font-weight: 600;
}
</style>
