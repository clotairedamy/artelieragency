<script setup lang="ts">
// A screenshot in a soft window frame. The traffic dots are pressed into the
// frame and all three are grey: the window is chrome, and the accent is kept
// for the one action on the page, not spent on a picture of one.
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
  <figure ref="el" class="ads-app-window" :class="{ 'is-shown': shown }">
    <div class="ads-app-window__chrome" aria-hidden="true">
      <span class="ads-app-window__dot" /><span class="ads-app-window__dot" /><span class="ads-app-window__dot" />
    </div>
    <div class="ads-app-window__pane">
      <img
        class="ads-app-window__image"
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
.ads-app-window {
  margin: 0;
  padding: 0 var(--sp-3) var(--sp-3);
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
}

.ads-app-window__chrome {
  display: flex;
  gap: var(--sp-2);
  padding: var(--sp-3) 6px;
}

.ads-app-window__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-app-window__pane {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--canvas);
}

.ads-app-window__image {
  display: block;
  width: 100%;
  height: auto;
}

/* Reveal: rise and settle as it scrolls into view. */
.js .ads-app-window {
  opacity: 0;
  translate: 0 40px;
  transition:
    opacity var(--dur-enter) var(--ease),
    translate var(--dur-enter) var(--ease);
}

.js .ads-app-window.is-shown {
  opacity: 1;
  translate: 0 0;
}

@media (prefers-reduced-motion: reduce) {
  .js .ads-app-window {
    opacity: 1;
    translate: none;
    transition: none;
  }
}
</style>
