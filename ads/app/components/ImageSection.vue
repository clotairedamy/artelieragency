<script setup lang="ts">
// A split section: copy on one side, an image (or any visual) on the other.
// `flip` swaps them. The visual is a slot and sits in a raised frame — depth,
// not a border, is what separates it from the page.
withDefaults(defineProps<{ eyebrow?: string; title: string; body?: string; flip?: boolean }>(), { eyebrow: '', body: '', flip: false })
</script>

<template>
  <section class="ads-image-section">
    <div class="ads-image-section__inner max" :class="{ 'is-flipped': flip }">
      <div class="ads-image-section__copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="ads-image-section__title h2">{{ title }}</h2>
        <p v-if="body" class="ads-image-section__body">{{ body }}</p>
        <slot name="actions" />
      </div>
      <figure class="ads-image-section__frame">
        <slot />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.ads-image-section {
  padding: var(--sp-8) 0;
}

.ads-image-section__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding: 0 clamp(20px, 4vw, 48px);
}

.ads-image-section__inner.is-flipped .ads-image-section__copy {
  order: 2;
}

.ads-image-section__copy {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
}

.ads-image-section__title {
  font-family: var(--font-display);
}

.ads-image-section__body {
  color: var(--subdued);
  font-size: 1rem;
  max-width: 52ch;
}

.ads-image-section__frame {
  margin: 0;
  padding: clamp(18px, 3vw, 30px);
  border-radius: var(--radius-lg);
  background: var(--raised);
  box-shadow: var(--soft-raised);
  overflow: hidden;
}

@media (max-width: 820px) {
  .ads-image-section__inner {
    grid-template-columns: 1fr;
  }
  .ads-image-section__inner.is-flipped .ads-image-section__copy {
    order: 0;
  }
}
</style>
