<script setup lang="ts">
// A grid of feature cards. Each is a raised card with a glyph in a well, a
// title and a line of body — the studio's service cards. Hover presses the
// card in rather than lifting it.
export type Feature = { icon: string; title: string; body: string }

withDefaults(defineProps<{ features: Feature[]; columns?: 2 | 3 | 4 }>(), { columns: 3 })
</script>

<template>
  <div class="ads-feature-grid" :style="{ '--ads-feature-grid-cols': columns }">
    <article v-for="f in features" :key="f.title" class="card card-press ads-feature-grid__item">
      <span class="ads-feature-grid__glyph"><Icon :name="f.icon" :size="20" /></span>
      <h3 class="ads-feature-grid__title h3">{{ f.title }}</h3>
      <p class="ads-feature-grid__body">{{ f.body }}</p>
    </article>
  </div>
</template>

<style scoped>
.ads-feature-grid {
  display: grid;
  gap: var(--gutter);
}

@media (min-width: 760px) {
  .ads-feature-grid {
    grid-template-columns: repeat(var(--ads-feature-grid-cols, 3), 1fr);
  }
}

.ads-feature-grid__item {
  display: grid;
  gap: var(--sp-3);
  align-content: start;
  justify-items: start;
}

.ads-feature-grid__glyph {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--sp-1);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.ads-feature-grid__title {
  color: var(--text);
}

.ads-feature-grid__body {
  font-size: 0.9rem;
  color: var(--subdued);
}
</style>
