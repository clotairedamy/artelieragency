<script setup lang="ts">
// A split section: copy on one side, an image (or any visual) on the other.
// `flip` swaps them. The visual is a slot and sits in a soft frame.
withDefaults(defineProps<{ eyebrow?: string; title: string; body?: string; flip?: boolean }>(), { eyebrow: '', body: '', flip: false })
</script>

<template>
  <section class="section">
    <div class="max inner" :class="{ flip }">
      <div class="copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="title">{{ title }}</h2>
        <p v-if="body" class="body">{{ body }}</p>
        <slot name="actions" />
      </div>
      <figure class="frame">
        <slot />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 72px 0;
}

.inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
  padding: 0 clamp(20px, 4vw, 48px);
}

.inner.flip .copy {
  order: 2;
}

.copy {
  display: grid;
  gap: 16px;
  justify-items: start;
}

.title {
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  letter-spacing: -0.028em;
  font-weight: 540;
}

.body {
  color: var(--subdued);
  font-size: 1rem;
  max-width: 52ch;
}

.frame {
  margin: 0;
  padding: clamp(18px, 3vw, 30px);
  border-radius: var(--radius-lg);
  background: var(--raised);
  box-shadow: var(--soft-raised);
  overflow: hidden;
}

@media (max-width: 820px) {
  .inner {
    grid-template-columns: 1fr;
  }
  .inner.flip .copy {
    order: 0;
  }
}
</style>
