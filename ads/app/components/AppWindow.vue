<script setup lang="ts">
// A screenshot in a soft window frame. The first traffic dot carries the
// accent — the "solid dot marks the value" motif, applied to chrome.
const props = withDefaults(
  defineProps<{ src: string; alt: string; width?: number; height?: number; eager?: boolean }>(),
  { width: 1440, height: 900, eager: false },
)

const el = ref<HTMLElement>()
const shown = ref(false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = true
    return
  }
  const io = new IntersectionObserver(
    ([e]) => {
      if (e!.intersectionRatio >= 0.12) shown.value = true
      else if (!e!.isIntersecting) shown.value = false
    },
    { threshold: [0, 0.12] },
  )
  io.observe(el.value!)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <figure ref="el" class="window" :class="{ in: shown }">
    <div class="chrome" aria-hidden="true"><span /><span /><span /></div>
    <div class="pane">
      <img
        :src="src"
        :alt="alt"
        :width="props.width"
        :height="props.height"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        decoding="async"
      />
    </div>
  </figure>
</template>

<style scoped>
.window {
  margin: 0;
  padding: 12px;
  padding-top: 0;
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
}

.chrome {
  display: flex;
  gap: 8px;
  padding: 14px 6px 12px;
}

.chrome span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.chrome span:first-child {
  background: var(--accent);
  box-shadow: none;
}

.pane {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: var(--canvas);
}

img {
  display: block;
  width: 100%;
  height: auto;
}

/* Reveal: rise and settle as it scrolls into view. */
.js .window {
  opacity: 0;
  translate: 0 40px;
  transition: opacity 0.9s var(--ease), translate 1.1s var(--ease);
}

.js .window.in {
  opacity: 1;
  translate: 0 0;
}

@media (prefers-reduced-motion: reduce) {
  .js .window {
    opacity: 1;
    translate: none;
    transition: none;
  }
}
</style>
