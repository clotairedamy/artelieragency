<script setup lang="ts">
// A change against the previous period. The direction glyph is mandatory — a
// delta without one is a number nobody can read at speed.
withDefaults(defineProps<{ direction?: 'up' | 'down' | 'flat'; value: string }>(), { direction: 'flat' })
</script>

<template>
  <span class="ads-delta" :class="`is-${direction}`">{{ value }}</span>
</template>
