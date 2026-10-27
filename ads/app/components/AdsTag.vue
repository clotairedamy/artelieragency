<script setup lang="ts">
// A filter the reader applied and can take off again. Always removable: the
// dismiss affordance is the whole difference from a status chip, which
// describes the data and cannot be removed — for that, use AdsStatus.
defineProps<{ label: string }>()
const emit = defineEmits<{ (e: 'remove'): void }>()
</script>

<template>
  <span class="ads-tag">
    {{ label }}
    <button type="button" :aria-label="`Remove filter ${label}`" @click="emit('remove')">×</button>
  </span>
</template>
