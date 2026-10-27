<script setup lang="ts">
// The hero: a big display headline over a soft visual. The visual is a slot,
// so the landing page can drop in a chart or a dashboard mock.
//
// Actions are a slot too, but they follow the studio's hero: one accent link
// on the action the page exists for, a default one beside it. If the nav or
// anything else above the fold already spends the accent, this does not.
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lead?: string; align?: 'center' | 'left' }>(),
  { eyebrow: '', lead: '', align: 'center' },
)
</script>

<template>
  <section class="ads-hero-section">
    <div class="ads-hero-section__inner max" :class="{ 'is-center': align === 'center' }">
      <div class="ads-hero-section__copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="ads-hero-section__title">{{ title }}</h1>
        <p v-if="lead" class="lede ads-hero-section__lead">{{ lead }}</p>
        <div v-if="$slots.actions" class="ads-hero-section__actions">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.visual" class="ads-hero-section__visual">
        <slot name="visual" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ads-hero-section {
  padding: clamp(56px, 9vw, 120px) 0 var(--sp-7);
}

.ads-hero-section__inner {
  display: grid;
  gap: var(--sp-7);
  padding: 0 clamp(20px, 4vw, 48px);
}

.ads-hero-section__inner.is-center {
  justify-items: center;
  text-align: center;
}

.ads-hero-section__copy {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
  max-width: 720px;
}

.ads-hero-section__inner.is-center .ads-hero-section__copy {
  justify-items: center;
}

.ads-hero-section__title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 7vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  font-weight: 600;
}

.ads-hero-section__lead {
  max-width: 640px;
}

.ads-hero-section__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
}

.ads-hero-section__inner.is-center .ads-hero-section__actions {
  justify-content: center;
}

.ads-hero-section__visual {
  width: 100%;
  max-width: 980px;
}
</style>
