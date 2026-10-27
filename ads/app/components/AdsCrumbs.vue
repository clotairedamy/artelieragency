<script setup lang="ts">
// Breadcrumb trail: where you are, once a screen is three levels deep or
// more. Only the last crumb is the current page; a middle crumb without a
// link is plain text, not "current".
export type Crumb = { label: string; to?: string }

defineProps<{ items: Crumb[] }>()
</script>

<template>
  <nav class="ads-crumbs" aria-label="Breadcrumb">
    <template v-for="(c, i) in items" :key="i">
      <span v-if="i > 0" class="sep" aria-hidden="true">/</span>
      <span v-if="i === items.length - 1" aria-current="page">{{ c.label }}</span>
      <NuxtLink v-else-if="c.to" :to="c.to">{{ c.label }}</NuxtLink>
      <span v-else>{{ c.label }}</span>
    </template>
  </nav>
</template>
