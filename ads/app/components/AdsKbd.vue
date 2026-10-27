<script setup lang="ts">
// A keyboard key.
defineProps<{ keys?: string[] }>()
</script>

<template>
  <span class="kbd-group">
    <kbd v-for="(k, i) in keys ?? ['K']" :key="i" class="kbd">{{ k }}</kbd>
  </span>
</template>

<style scoped>
.kbd-group {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
</style>
