<script setup lang="ts">
// The hero: a big display headline over a soft visual. The visual is a slot,
// so the landing page can drop in a chart or a dashboard mock.
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lead?: string; align?: 'center' | 'left' }>(),
  { eyebrow: '', lead: '', align: 'center' },
)
</script>

<template>
  <section class="hero">
    <div class="max inner" :class="{ 'is-center': align === 'center' }">
      <div class="copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="title face-display">{{ title }}</h1>
        <p v-if="lead" class="lede">{{ lead }}</p>
        <div class="actions">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.visual" class="visual">
        <slot name="visual" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: clamp(56px, 9vw, 120px) 0 40px;
}

.inner {
  display: grid;
  gap: 48px;
  padding: 0 clamp(20px, 4vw, 48px);
}

.inner.is-center {
  justify-items: center;
  text-align: center;
}

.copy {
  display: grid;
  gap: 20px;
  justify-items: var(--justify, start);
  max-width: 720px;
}

.is-center .copy {
  justify-items: center;
}

.title {
  font-size: clamp(2.6rem, 7vw, 4.6rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  font-weight: 600;
}

.lede {
  max-width: 640px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 8px;
}

.is-center .actions {
  justify-content: center;
}

.visual {
  width: 100%;
  max-width: 980px;
}
</style>
