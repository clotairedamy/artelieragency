<script setup lang="ts">
// A callout with a glyph. The left edge carries the accent bar.
withDefaults(defineProps<{ text: string; icon?: string }>(), { icon: 'alert' })
</script>

<template>
  <div class="ads-banner" role="status">
    <span class="glyph"><Icon :name="icon" :size="17" /></span>
    <span>{{ text }}</span>
    <slot name="actions" />
  </div>
</template>
