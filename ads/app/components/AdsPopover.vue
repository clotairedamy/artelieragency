<script setup lang="ts">
// A small amount of extra context, anchored to what prompted it. More than a
// tooltip, less than a drawer — supplementary by definition.
withDefaults(defineProps<{ label?: string; body?: string; link?: { label: string; to?: string } }>(), { label: '', body: '', link: undefined })
</script>

<template>
  <div class="ads-popover">
    <span v-if="label" class="ads-label">{{ label }}</span>
    <span v-if="body" class="body">{{ body }}</span>
    <slot />
    <NuxtLink v-if="link" class="ads-link" :to="link.to ?? '#'">{{ link.label }}</NuxtLink>
  </div>
</template>

<style scoped>
.body {
  font-size: 0.84rem;
  color: var(--text-soft);
}
</style>
