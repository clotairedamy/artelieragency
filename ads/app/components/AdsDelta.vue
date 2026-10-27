<script setup lang="ts">
// A change against the previous period. The direction glyph is mandatory — a
// delta without one is a number nobody can read at speed — so `direction` is
// required rather than defaulted, and it is spoken as a word too, because a
// screen reader does not reliably read a CSS triangle.
const props = defineProps<{ direction: 'up' | 'down' | 'flat'; value: string }>()

const spoken = computed(() => ({ up: 'up', down: 'down', flat: 'unchanged' })[props.direction])
</script>

<template>
  <span class="ads-delta num" :class="`is-${direction}`"><span class="sr-only">{{ spoken }} </span>{{ value }}</span>
</template>
