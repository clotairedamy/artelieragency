<script setup lang="ts">
// A post's metadata: its tag, the date, and the reading time.
defineProps<{ tag: string; date: string; readingTime?: number }>()

const fmt = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="meta">
    <span class="tag">{{ tag }}</span>
    <time :datetime="date">{{ fmt(date) }}</time>
    <span v-if="readingTime">· {{ readingTime }} min read</span>
  </div>
</template>

<style scoped>
.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--subdued);
}

.tag {
  padding: 4px 12px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  letter-spacing: 0.04em;
}
</style>
