<script setup lang="ts">
// A tooltip on hover/focus. The trigger is the default slot; the bubble reads
// the `text` prop.
withDefaults(defineProps<{ text: string; position?: 'top' | 'bottom' }>(), { position: 'top' })
</script>

<template>
  <span class="tt">
    <slot />
    <span class="bubble" :class="`is-${position}`" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.tt {
  position: relative;
  display: inline-flex;
}

.bubble {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(100% + 8px);
  padding: 7px 11px;
  border-radius: 9px;
  background: var(--elevated);
  box-shadow: var(--soft-raised);
  font-size: 0.8rem;
  color: var(--text);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s var(--ease);
  z-index: 30;
}

.bubble.is-bottom {
  top: calc(100% + 8px);
  bottom: auto;
}

.tt:hover .bubble,
.tt:focus-within .bubble {
  opacity: 1;
}
</style>
