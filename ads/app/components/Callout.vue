<script setup lang="ts">
// A docs callout. The edge and label carry the tone, and every tone carries a
// glyph — in a monochrome system the glyph is what survives a greyscale print.
const props = withDefaults(defineProps<{ type?: 'note' | 'tip' | 'warning' }>(), { type: 'note' })

const meta = computed(() => {
  switch (props.type) {
    case 'tip':
      return { label: 'Tip', icon: 'check', color: 'var(--ok)' }
    case 'warning':
      return { label: 'Heads up', icon: 'alert', color: 'var(--warn)' }
    default:
      return { label: 'Note', icon: 'compass', color: 'var(--accent)' }
  }
})
</script>

<template>
  <aside class="callout" :class="type" :style="{ '--tone': meta.color }">
    <span class="label"><Icon :name="meta.icon" :size="13" />{{ meta.label }}</span>
    <div class="body"><slot /></div>
  </aside>
</template>

<style scoped>
.callout {
  position: relative;
  padding: 18px 22px 18px 26px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.callout::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--tone);
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--tone);
  font-weight: 500;
}

.body {
  color: var(--text-soft);
  font-size: 0.9rem;
}

.body :deep(p) {
  margin: 0;
}
</style>
