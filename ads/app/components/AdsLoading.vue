<script setup lang="ts">
// Inline loading, next to the thing that is loading so the rest of the screen
// stays usable. A spinner where the shape is unknown; a skeleton where it is
// known. The text is required: a spinner alone tells a screen reader nothing
// and a sighted reader only that something, somewhere, is busy.
withDefaults(defineProps<{ text: string; size?: number }>(), { size: 18 })
</script>

<template>
  <span class="ads-inline-load" role="status" aria-live="polite">
    <span class="ads-spinner" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true" />
    <slot>{{ text }}</slot>
  </span>
</template>
