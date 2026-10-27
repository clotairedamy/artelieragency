<script setup lang="ts">
// A removable filter tag. Distinct from a status chip, which describes the
// data and cannot be removed.
withDefaults(defineProps<{ label: string; removable?: boolean }>(), { removable: true })
const emit = defineEmits<{ (e: 'remove'): void }>()
</script>

<template>
  <span class="ads-tag">
    {{ label }}
    <button v-if="removable" type="button" aria-label="Remove" @click="emit('remove')">×</button>
  </span>
</template>
