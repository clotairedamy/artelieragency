<script setup lang="ts">
// A content section: eyebrow, headline and lede, then any body. The workhorse
// of a marketing page — a titled block of prose or a titled grid.
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lead?: string; align?: 'center' | 'left' }>(),
  { eyebrow: '', lead: '', align: 'left' },
)
</script>

<template>
  <section class="section">
    <div class="max inner">
      <header class="head" :class="{ 'is-center': align === 'center' }">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="title">{{ title }}</h2>
        <p v-if="lead" class="lede">{{ lead }}</p>
      </header>
      <div class="body"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 72px 0;
}

.inner {
  padding: 0 clamp(20px, 4vw, 48px);
  display: grid;
  gap: 40px;
}

.head {
  display: grid;
  gap: 16px;
  max-width: 680px;
}

.head.is-center {
  justify-items: center;
  text-align: center;
  justify-self: center;
}

.title {
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  letter-spacing: -0.028em;
  font-weight: 540;
}

.lede {
  color: var(--text-soft);
  font-size: 1.05rem;
}
</style>
