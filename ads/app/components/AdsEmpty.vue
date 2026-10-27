<script setup lang="ts">
// The first screen every new user sees, so it gets a component rather than a
// grey sentence.
withDefaults(defineProps<{ icon?: string; title: string; body?: string }>(), { icon: 'discovery', body: '' })
</script>

<template>
  <div class="ads-empty">
    <span class="glyph"><Icon :name="icon" :size="20" /></span>
    <h4>{{ title }}</h4>
    <p v-if="body">{{ body }}</p>
    <slot />
  </div>
</template>
