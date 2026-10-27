<script setup lang="ts">
// An input with a prefix/suffix addon (a currency symbol, a unit, a domain).
withDefaults(defineProps<{ prefix?: string; suffix?: string; placeholder?: string; modelValue?: string; type?: string }>(), {
  prefix: '',
  suffix: '',
  placeholder: '',
  modelValue: '',
  type: 'text',
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="input-group">
    <span v-if="prefix" class="addon">{{ prefix }}</span>
    <input
      class="ig-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span v-if="suffix" class="addon">{{ suffix }}</span>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  align-items: center;
  height: 42px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.input-group:focus-within {
  box-shadow: var(--soft-inset-sm), 0 0 0 2px var(--accent);
}

.addon {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 0 12px;
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--subdued);
  background: var(--raised);
}

.ig-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 12px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
}

.ig-input::placeholder {
  color: var(--subdued);
}
</style>
