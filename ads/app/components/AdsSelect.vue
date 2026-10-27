<script setup lang="ts">
// A custom select: a button that opens a soft menu of options.
const props = withDefaults(
  defineProps<{ options?: { label: string; value: string | number }[]; modelValue?: string | number; placeholder?: string }>(),
  { options: () => [], modelValue: '', placeholder: 'Choose…' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
const open = ref(false)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue)?.label ?? props.placeholder)
</script>

<template>
  <div class="select">
    <button type="button" class="select-btn" :aria-expanded="open" @click="open = !open">
      <span>{{ selected }}</span>
      <Icon name="chevron" :size="14" />
    </button>
    <div v-if="open" class="select-menu">
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        class="opt"
        :class="{ on: o.value === modelValue }"
        @click="emit('update:modelValue', o.value); open = false"
      >{{ o.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  min-width: 180px;
}

.select-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text);
  font-size: 0.92rem;
}

.select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
}

.opt {
  text-align: left;
  padding: 9px 12px;
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.9rem;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}

.opt:hover {
  background: var(--hover);
  color: var(--text);
}

.opt.on {
  color: var(--accent-ink);
  background: var(--accent);
}
</style>
