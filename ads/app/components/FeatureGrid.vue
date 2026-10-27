<script setup lang="ts">
// A grid of feature cards. Each is a soft surface with a glyph, a title and a
// line of body.
export type Feature = { icon: string; title: string; body: string }

withDefaults(defineProps<{ features: Feature[]; columns?: 2 | 3 | 4 }>(), { columns: 3 })
</script>

<template>
  <div class="grid" :class="`grid-${columns}`">
    <article v-for="f in features" :key="f.title" class="card card-press feat">
      <span class="glyph"><Icon :name="f.icon" :size="20" /></span>
      <h3 class="title">{{ f.title }}</h3>
      <p class="body">{{ f.body }}</p>
    </article>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--gutter);
}

@media (min-width: 760px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
}

.feat {
  display: grid;
  gap: 12px;
  align-content: start;
  justify-items: start;
}

.glyph {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  margin-bottom: 4px;
}

.title {
  font-size: 1.08rem;
  font-weight: 540;
  color: var(--text);
}

.body {
  font-size: 0.9rem;
  color: var(--subdued);
}
</style>
