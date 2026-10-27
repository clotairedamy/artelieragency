<script setup lang="ts">
// A single toggle button — a setting that flips on/off and stays that way.
withDefaults(defineProps<{ modelValue?: boolean; icon?: string; size?: number }>(), { modelValue: false, size: 16 })
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<template>
  <button
    type="button"
    class="ads-toggle"
    :class="{ 'is-on': modelValue }"
    :aria-pressed="modelValue"
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
  gap: 9px;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--subdued);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  transition: color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

.ads-toggle:hover {
  color: var(--text);
}

.ads-toggle.is-on {
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--soft-raised-sm);
}
</style>
