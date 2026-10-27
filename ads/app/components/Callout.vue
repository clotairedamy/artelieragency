<script setup lang="ts">
// A docs callout. Every kind is a glyph and a word — never a coloured edge.
// In a monochrome system the glyph is what survives a greyscale print, and a
// stripe of hue would be colour carrying meaning on its own. A warning is the
// brightest of the three, because here the worse thing is the brighter one.
const props = withDefaults(defineProps<{ type?: 'note' | 'tip' | 'warning' }>(), { type: 'note' })

const meta = computed(() => {
  switch (props.type) {
    case 'tip':
      return { label: 'Tip', icon: 'spark' }
    case 'warning':
      return { label: 'Warning', icon: 'alert' }
    default:
      return { label: 'Note', icon: 'compass' }
  }
})
</script>

<template>
  <div class="ads-callout" :class="`is-${type}`" role="note">
    <span class="ads-callout__glyph"><Icon :name="meta.icon" :size="16" /></span>
    <div class="ads-callout__content">
      <span class="ads-label ads-callout__label">{{ meta.label }}</span>
      <div class="ads-callout__body"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.ads-callout {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-3);
  align-items: start;
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

/* The glyph sits in a small well, so it reads as a mark on the callout rather
   than an icon floating beside the text. */
.ads-callout__glyph {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.ads-callout.is-warning .ads-callout__glyph,
.ads-callout.is-warning .ads-callout__label {
  color: var(--text);
}

.ads-callout__content {
  display: grid;
  gap: var(--sp-1);
  min-width: 0;
  padding-top: 3px;
}

.ads-callout__body {
  color: var(--text-soft);
  font-size: 0.9rem;
}

.ads-callout__body :deep(p) {
  margin: 0;
}
</style>
