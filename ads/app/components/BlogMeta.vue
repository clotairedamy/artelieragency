<script setup lang="ts">
// A post's metadata: its tag, the date, and the reading time. The date is
// ISO and the figures are in the data face, like every other number here.
defineProps<{ tag: string; date: string; readingTime?: number }>()
</script>

<template>
  <div class="ads-blog-meta">
    <span class="ads-blog-meta__tag">{{ tag }}</span>
    <time class="num" :datetime="date">{{ date }}</time>
    <span v-if="readingTime">· <span class="num">{{ readingTime }}</span> min read</span>
  </div>
</template>

<style scoped>
.ads-blog-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--subdued);
}

.ads-blog-meta__tag {
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
  letter-spacing: 0.04em;
}
</style>
