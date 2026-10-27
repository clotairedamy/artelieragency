<script setup lang="ts">
// Breadcrumb trail.
export type Crumb = { label: string; to?: string }

defineProps<{ items: Crumb[] }>()
</script>

<template>
  <nav class="ads-crumbs" aria-label="Breadcrumb">
    <template v-for="(c, i) in items" :key="i">
      <span v-if="i > 0" class="sep" aria-hidden="true">/</span>
      <NuxtLink v-if="c.to" :to="c.to">{{ c.label }}</NuxtLink>
      <span v-else :aria-current="'page'">{{ c.label }}</span>
    </template>
  </nav>
</template>
