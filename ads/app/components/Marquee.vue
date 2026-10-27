<script setup lang="ts">
// A scrolling band of pills — a quiet way to show breadth. The second lane is
// a copy for the seamless loop, hidden from assistive tech.
//
// Anything that moves for more than five seconds needs a way to stop it, so
// the band pauses on hover, on focus, and from its own toggle. Under reduced
// motion it never starts: the pills wrap into a still row instead.
withDefaults(
  defineProps<{ items?: string[] }>(),
  { items: () => ['Accessibility', 'SEO', 'Performance', 'Content', 'Structure', 'Security'] },
)

const paused = ref(false)
</script>

<template>
  <div class="ads-marquee" :class="{ 'is-paused': paused }">
    <div class="ads-marquee__viewport">
      <div class="ads-marquee__track">
        <ul v-for="copy in 2" :key="copy" class="ads-marquee__lane" role="list" :aria-hidden="copy === 2 ? 'true' : undefined">
          <li v-for="(item, i) in items" :key="i" class="ads-marquee__item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <button type="button" class="btn btn-quiet btn-sm ads-marquee__toggle" :aria-pressed="paused" @click="paused = !paused">
      Pause motion
    </button>
  </div>
</template>

<style scoped>
.ads-marquee {
  display: grid;
  justify-items: center;
  gap: var(--sp-2);
}

/* The fade at either end is a mask, not a painted gradient: it shapes the
   band and adds no colour. */
.ads-marquee__viewport {
  width: 100%;
  overflow: hidden;
  padding: var(--sp-4) 0;
  mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

/* Linear on purpose: --ease on a loop would surge and stall every lap. */
.ads-marquee__track {
  display: flex;
  width: max-content;
  animation: ads-marquee-slide 80s linear infinite;
}

.ads-marquee__viewport:hover .ads-marquee__track,
.ads-marquee:focus-within .ads-marquee__track,
.ads-marquee.is-paused .ads-marquee__track {
  animation-play-state: paused;
}

.ads-marquee__lane {
  display: flex;
  gap: var(--sp-4);
  margin: 0;
  padding: 0 var(--sp-4) 0 0;
  list-style: none;
}

/* Raised, not pressable: the pills are a list, not controls, so they do not
   answer hover. */
.ads-marquee__item {
  display: inline-flex;
  align-items: center;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.88rem;
  color: var(--text-soft);
  white-space: nowrap;
}

@keyframes ads-marquee-slide {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ads-marquee__viewport {
    mask: none;
    -webkit-mask: none;
  }
  .ads-marquee__track {
    width: auto;
    justify-content: center;
    animation: none;
  }
  .ads-marquee__lane {
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
  }
  .ads-marquee__lane[aria-hidden='true'],
  .ads-marquee__toggle {
    display: none;
  }
}
</style>
