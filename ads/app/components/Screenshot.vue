<script setup lang="ts">
// A screenshot figure: the window frame plus an optional caption.
defineProps<{ src: string; alt: string; caption?: string }>()
</script>

<template>
  <figure class="shot">
    <AppWindow :src="src" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.shot {
  margin: 2.4em 0;
}

figcaption {
  margin-top: 16px;
  text-align: center;
  font-size: 0.86rem;
  color: var(--subdued);
}
</style>
