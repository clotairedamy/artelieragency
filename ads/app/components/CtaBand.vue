<script setup lang="ts">
// The closing call to action. A single raised card with the one accent button.
withDefaults(
  defineProps<{ title?: string; body?: string; ctaLabel?: string; ctaTo?: string; secondaryLabel?: string; secondaryTo?: string }>(),
  {
    title: 'Build the dashboard your users live in.',
    body: 'A monochrome soft-UI kit: tokens, utilities, sections and a dashboard — ready to drop into a Nuxt project.',
    ctaLabel: 'Start a project',
    ctaTo: '/contact',
    secondaryLabel: '',
    secondaryTo: '',
  },
)
</script>

<template>
  <section class="section">
    <div class="max inner">
      <div class="cta card">
        <div class="copy">
          <h2 class="title">{{ title }}</h2>
          <p class="body">{{ body }}</p>
          <div class="buttons">
            <NuxtLink :to="ctaTo" class="btn btn-accent">{{ ctaLabel }}</NuxtLink>
            <NuxtLink v-if="secondaryLabel" :to="secondaryTo" class="btn btn-quiet">{{ secondaryLabel }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 64px 0 96px;
}

.inner {
  padding: 0 clamp(20px, 4vw, 48px);
}

.cta {
  padding: clamp(32px, 6vw, 64px);
  display: grid;
  justify-items: center;
  text-align: center;
  border-radius: var(--radius-lg);
}

.copy {
  display: grid;
  gap: 18px;
  justify-items: center;
  max-width: 560px;
}

.title {
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  letter-spacing: -0.028em;
  font-weight: 540;
}

.body {
  color: var(--subdued);
  font-size: 1rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin-top: 8px;
}
</style>
