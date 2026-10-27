<script setup lang="ts">
// A narrative: a heading, the story, and the rest one click away.
withDefaults(
  defineProps<{ heading?: string[]; body?: string[]; more?: string[] }>(),
  { heading: () => ['Less, but', 'done well.'], body: () => [], more: () => [] },
)
const expanded = ref(false)
</script>

<template>
  <section class="story">
    <RevealHeading :lines="heading" size="title" />
    <div class="story-body">
      <p v-for="(p, i) in body" :key="i" class="body">{{ p }}</p>
    </div>
    <button v-if="more.length" class="btn" type="button" :aria-expanded="expanded" @click="expanded = !expanded">
      {{ expanded ? 'Read less' : 'Read the rest' }}
    </button>
    <div v-if="expanded" class="story-more">
      <p v-for="(p, i) in more" :key="i" class="body">{{ p }}</p>
    </div>
  </section>
</template>

<style scoped>
.story {
  display: grid;
  gap: 16px;
  max-width: 65ch;
}

.story-body,
.story-more {
  display: grid;
  gap: 1.1em;
}
</style>
