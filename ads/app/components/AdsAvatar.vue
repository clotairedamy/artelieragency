<script setup lang="ts">
// An avatar — a soft circle with initials. Greyscale, like the chrome: a face
// or a brand colour here would out-shout the data beside it. It names the
// person to assistive tech unless the name is already written next to it, in
// which case `decorative` keeps it from being read twice.
const props = withDefaults(defineProps<{ name: string; size?: number; decorative?: boolean }>(), {
  size: 40,
  decorative: false,
})

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <span
    class="ads-avatar"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.4)}px` }"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : name"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span aria-hidden="true">{{ initials }}</span>
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
