<script setup lang="ts">
// A single toggle button — a setting that flips on and stays that way. Off, it
// stands proud like any button; on, it stays pressed into the page with its
// text brightened. The shadow inversion is the state, so the accent fill stays
// free for the one action on the screen. With only a glyph and no words, the
// `label` names it to assistive tech.
withDefaults(defineProps<{ modelValue?: boolean; icon?: string; size?: number; label?: string }>(), {
  modelValue: false,
  size: 16,
  label: undefined,
})
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<template>
  <button
    type="button"
    class="ads-toggle"
    :class="{ 'is-on': modelValue }"
    :aria-pressed="modelValue"
    :aria-label="label"
    @click="emit('update:modelValue', !modelValue)"
  >
    <Icon v-if="icon" :name="icon" :size="size" />
    <slot />
  </button>
</template>

<style scoped>
.ads-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-soft);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-toggle:hover {
  color: var(--accent);
}

.ads-toggle.is-on {
  color: var(--accent);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}
</style>
