<script setup lang="ts">
// A carousel: a horizontal rail with prev/next.
const rail = ref<HTMLElement>()
defineProps<{ itemWidth?: string }>()

function scroll(dir: 1 | -1) {
  const el = rail.value
  if (!el) return
  el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
}
</script>

<template>
  <div class="carousel">
    <button type="button" class="car-btn prev" aria-label="Previous" @click="scroll(-1)"><Icon name="chevron" :size="16" /></button>
    <div ref="rail" class="car-rail">
      <slot />
    </div>
    <button type="button" class="car-btn next" aria-label="Next" @click="scroll(1)"><Icon name="chevron" :size="16" /></button>
  </div>
</template>

<style scoped>
.carousel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.car-rail {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 4px 2px;
}

.car-rail::-webkit-scrollbar {
  display: none;
}

.car-rail > :deep(*) {
  scroll-snap-align: start;
  flex: none;
}

.car-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
}

.car-btn:hover {
  color: var(--text);
}

.car-btn.prev :deep(svg) {
  rotate: 180deg;
}
</style>
