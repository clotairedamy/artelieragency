<script setup lang="ts">
// A count or code pill. The accent variant is the one number on screen that
// matters; the quiet variant sits inside the chrome. A bare "5" means nothing
// to a screen reader, so `label` says what is being counted ("unread").
withDefaults(defineProps<{ value: string | number; label?: string; quiet?: boolean }>(), { label: '', quiet: false })
</script>

<template>
  <span class="ads-badge num" :class="{ 'is-quiet': quiet }">{{ value }}<span v-if="label" class="sr-only"> {{ label }}</span></span>
</template>
