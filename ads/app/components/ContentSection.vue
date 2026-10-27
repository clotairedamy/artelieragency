<script setup lang="ts">
// A content section: eyebrow, headline and lede, then any body. The workhorse
// of a marketing page — a titled block of prose or a titled grid. The head is
// the studio's section head: label, display headline, one lede, and the body
// below in cards rather than strips.
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lead?: string; align?: 'center' | 'left' }>(),
  { eyebrow: '', lead: '', align: 'left' },
)
</script>

<template>
  <section class="ads-content-section">
    <div class="ads-content-section__inner max">
      <header class="ads-content-section__head" :class="{ 'is-center': align === 'center' }">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="ads-content-section__title h2">{{ title }}</h2>
        <p v-if="lead" class="lede">{{ lead }}</p>
      </header>
      <div class="ads-content-section__body"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.ads-content-section {
  padding: var(--sp-8) 0;
}

.ads-content-section__inner {
  display: grid;
  gap: var(--sp-7);
  padding: 0 clamp(20px, 4vw, 48px);
}

.ads-content-section__head {
  display: grid;
  gap: var(--sp-4);
  max-width: 680px;
}

.ads-content-section__head.is-center {
  justify-items: center;
  justify-self: center;
  text-align: center;
}

.ads-content-section__title {
  font-family: var(--font-display);
}
</style>
