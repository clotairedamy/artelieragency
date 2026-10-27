<script setup lang="ts">
// A narrative: a heading, the story, and the rest one click away.
withDefaults(
  defineProps<{ heading?: string[]; body?: string[]; more?: string[] }>(),
  { heading: () => ['Less, but', 'done well.'], body: () => [], more: () => [] },
)
const expanded = ref(false)
const moreId = useId()
</script>

<template>
  <section class="ads-story-section">
    <RevealHeading :lines="heading" size="title" />
    <div class="ads-story-section__body">
      <p v-for="(p, i) in body" :key="i" class="body">{{ p }}</p>
    </div>
    <button v-if="more.length" class="btn" type="button" :aria-expanded="expanded" :aria-controls="moreId" @click="expanded = !expanded">
      {{ expanded ? 'Read less' : 'Read the rest' }}
    </button>
    <div v-show="expanded" :id="moreId" class="ads-story-section__more">
      <p v-for="(p, i) in more" :key="i" class="body">{{ p }}</p>
    </div>
  </section>
</template>

<style scoped>
.ads-story-section {
  display: grid;
  gap: var(--sp-4);
  max-width: 65ch;
}

.ads-story-section__body,
.ads-story-section__more {
  display: grid;
  gap: 1.1em;
}
</style>
