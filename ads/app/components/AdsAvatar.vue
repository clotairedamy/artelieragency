<script setup lang="ts">
// An avatar — a soft circle with initials. Greyscale, like the chrome.
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 40 })
</script>

<template>
  <span
    class="ads-avatar"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.4)}px` }"
    :aria-hidden="true"
  >
    {{ name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() }}
  </span>
</template>

<style scoped>
.ads-avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--font-label);
  font-weight: 500;
  color: var(--text-soft);
  letter-spacing: 0.04em;
}
</style>
