<script setup lang="ts">
// A keyboard shortcut: one key, or a chord. Keys sit in the data face, pressed
// into the page like every other piece of reference text. Nested <kbd>s are
// how HTML spells "press these together".
defineProps<{ keys: string[] }>()
</script>

<template>
  <kbd class="ads-kbd">
    <kbd v-for="(k, i) in keys" :key="i" class="kbd">{{ k }}</kbd>
  </kbd>
</template>

<style scoped>
.ads-kbd {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-family: var(--mono);
}
</style>
