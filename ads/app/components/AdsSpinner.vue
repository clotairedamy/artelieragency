<script setup lang="ts">
// A bare spinner.
withDefaults(defineProps<{ size?: number }>(), { size: 18 })
</script>

<template>
  <span class="ads-spinner" :style="{ width: `${size}px`, height: `${size}px` }" role="status" aria-label="Loading" />
</template>
