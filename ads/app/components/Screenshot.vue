<script setup lang="ts">
// A screenshot figure: the window frame plus an optional caption. The caption
// belongs to this outer figure, so it describes the shot rather than the frame.
defineProps<{ src: string; alt: string; caption?: string }>()
</script>

<template>
  <figure class="ads-screenshot">
    <AppWindow :src="src" :alt="alt" />
    <figcaption v-if="caption" class="ads-screenshot__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.ads-screenshot {
  margin: 2.4em 0;
}

.ads-screenshot__caption {
  margin-top: var(--sp-4);
  text-align: center;
  font-size: 0.86rem;
  color: var(--subdued);
}
</style>
