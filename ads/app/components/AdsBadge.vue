<script setup lang="ts">
// A count or code pill. The accent variant is the one number on screen that
// matters; the quiet variant sits inside the chrome.
withDefaults(defineProps<{ value: string | number; quiet?: boolean }>(), { quiet: false })
</script>

<template>
  <span class="ads-badge" :class="{ 'is-quiet': quiet }">{{ value }}</span>
</template>
