<script setup lang="ts">
// Every band opens the same way: a numbered label, a short title in the
// display face, and one paragraph saying what the group is for. The
// repetition is the point — by the third section a reader knows where to
// look without reading the furniture.
defineProps<{ eyebrow: string; title: string; lede: string }>()
</script>

<template>
  <header v-reveal class="head">
    <span class="ads-label">{{ eyebrow }}</span>
    <h2 class="ads-display title">{{ title }}</h2>
    <p class="lede">{{ lede }}</p>
  </header>
</template>

<style scoped>
.head {
  display: grid;
  gap: 14px;
  max-width: 68ch;
  margin-bottom: 36px;
}

.title {
  font-size: clamp(1.7rem, 3.4vw, 2.4rem);
  font-variation-settings: 'opsz' 32;
  color: var(--text);
}

.lede {
  max-width: 64ch;
}
</style>
