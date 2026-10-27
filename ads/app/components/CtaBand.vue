<script setup lang="ts">
// The close, shaped like the studio site's: one raised panel — label,
// headline, a lede that says what happens next — and one filled action in
// it. Everything above should have spent its accent carefully so that this
// button is the brightest thing on the page by the time anyone reaches it.
// The secondary action stays default weight.
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    body?: string
    ctaLabel?: string
    ctaTo?: string
    secondaryLabel?: string
    secondaryTo?: string
  }>(),
  {
    eyebrow: '',
    body: '',
    ctaLabel: 'Start a project',
    ctaTo: '/contact',
    secondaryLabel: '',
    secondaryTo: '',
  },
)
</script>

<template>
  <section class="ads-cta-band">
    <div class="ads-cta-band__inner max">
      <div class="ads-cta-band__panel card">
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h2 class="ads-cta-band__title h2">{{ title }}</h2>
        <p v-if="body" class="lede ads-cta-band__body">{{ body }}</p>
        <div class="ads-cta-band__actions">
          <NuxtLink :to="ctaTo" class="btn btn-accent">
            {{ ctaLabel }}
            <Icon name="arrow" :size="18" />
          </NuxtLink>
          <NuxtLink v-if="secondaryLabel && secondaryTo" :to="secondaryTo" class="btn">{{ secondaryLabel }}</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ads-cta-band {
  padding: var(--sp-7) 0 var(--sp-8);
}

.ads-cta-band__inner {
  padding: 0 clamp(20px, 4vw, 48px);
}

.ads-cta-band__panel {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
  padding: clamp(28px, 5vw, 52px);
}

.ads-cta-band__title {
  font-family: var(--font-display);
}

.ads-cta-band__body {
  max-width: 56ch;
}

.ads-cta-band__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  margin-top: var(--sp-2);
}
</style>
