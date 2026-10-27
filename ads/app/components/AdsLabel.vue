<script setup lang="ts">
// A form label, above its field.
defineProps<{ for?: string }>()
</script>

<template>
  <label class="label" :for="for"><slot /></label>
</template>

<style scoped>
.label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}
</style>
