<script setup lang="ts">
// A horizontal rail of cards. Scrollbars are hidden site-wide, so the rail has
// to say for itself that there is more: the edge with more to see fades out,
// and the arrow on a finished side goes quiet. The rail is focusable, so arrow
// keys scroll it too, and it snaps to whole cards. Reduced motion jumps
// instead of gliding.
withDefaults(defineProps<{ label: string }>(), {})
const rail = ref<HTMLElement>()
const atStart = ref(true)
const atEnd = ref(true)
let ro: ResizeObserver | undefined

function measure() {
  const el = rail.value
  if (!el) return
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}

function scroll(dir: 1 | -1) {
  const el = rail.value
  if (!el) return
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: still ? 'auto' : 'smooth' })
}

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (rail.value) ro.observe(rail.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <section class="ads-carousel" :aria-label="label" aria-roledescription="carousel">
    <button
      type="button"
      class="ads-carousel__button is-prev"
      :aria-label="`Scroll ${label} back`"
      :disabled="atStart"
      @click="scroll(-1)"
    >
      <Icon name="arrow" :size="15" />
    </button>
    <div
      ref="rail"
      class="ads-carousel__rail"
      :class="{ 'is-more-start': !atStart, 'is-more-end': !atEnd }"
      tabindex="0"
      role="group"
      :aria-label="`${label} items`"
      @scroll.passive="measure"
    >
      <slot />
    </div>
    <button
      type="button"
      class="ads-carousel__button"
      :aria-label="`Scroll ${label} forward`"
      :disabled="atEnd"
      @click="scroll(1)"
    >
      <Icon name="arrow" :size="15" />
    </button>
  </section>
</template>

<style scoped>
.ads-carousel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--sp-2);
}

.ads-carousel__rail {
  --ads-carousel-fade-start: 0px;
  --ads-carousel-fade-end: 0px;
  display: flex;
  gap: var(--sp-3);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: var(--sp-1) 2px var(--sp-3);
  border-radius: var(--radius-sm);
  /* The fade is the scrollbar: the edge that still has cards behind it
     dissolves, so the rail reads as continuing. */
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--ads-carousel-fade-start),
    #000 calc(100% - var(--ads-carousel-fade-end)),
    transparent 100%
  );
}

.ads-carousel__rail.is-more-start {
  --ads-carousel-fade-start: var(--sp-7);
}

.ads-carousel__rail.is-more-end {
  --ads-carousel-fade-end: var(--sp-7);
}

.ads-carousel__rail > :deep(*) {
  flex: none;
  scroll-snap-align: start;
}

.ads-carousel__button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease),
    opacity var(--dur-control) var(--ease);
}

.ads-carousel__button.is-prev :deep(svg) {
  transform: rotate(180deg);
}

.ads-carousel__button:hover:not(:disabled) {
  color: var(--accent);
}

.ads-carousel__button:active:not(:disabled) {
  box-shadow: var(--soft-inset-sm);
}

.ads-carousel__button:disabled {
  opacity: 0.35;
  box-shadow: none;
  cursor: default;
}
</style>
