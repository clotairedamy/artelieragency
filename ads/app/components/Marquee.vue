<script setup lang="ts">
// A scrolling band of pills — a quiet way to show breadth. Pauses on hover and
// stops under reduced motion.
withDefaults(
  defineProps<{ items?: string[] }>(),
  { items: () => ['Accessibility', 'SEO', 'Performance', 'Content', 'Structure', 'Security'] },
)
</script>

<template>
  <div class="marquee">
    <div class="track">
      <div v-for="copy in 2" :key="copy" class="lane" :aria-hidden="copy === 2">
        <span v-for="(item, i) in items" :key="i" class="item">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  display: grid;
  gap: 22px;
  overflow: hidden;
  mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  padding: 20px 0;
}

.track {
  display: flex;
  width: max-content;
  animation: slide 80s linear infinite;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.lane {
  display: flex;
  gap: 20px;
  padding-right: 20px;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.88rem;
  color: var(--text-soft);
  white-space: nowrap;
  transition: color 0.2s var(--ease), box-shadow 0.3s var(--ease);
}

.item:hover {
  color: var(--text);
  box-shadow: var(--soft-inset-sm);
}

@keyframes slide {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
}
</style>
