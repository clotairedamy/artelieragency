<script setup lang="ts">
// A tooltip answers a question only if asked: on hover or focus, never on its
// own. The trigger is the default slot; the bubble reads the `text` prop and
// is wired to the first focusable thing in the slot with aria-describedby, so
// it is heard as well as seen. Escape dismisses it without moving focus.
withDefaults(defineProps<{ text: string; position?: 'top' | 'bottom' }>(), { position: 'top' })

const id = useId()
const root = ref<HTMLElement>()
const dismissed = ref(false)

onMounted(() => {
  root.value?.querySelector('a, button, input, select, textarea, [tabindex]')?.setAttribute('aria-describedby', id)
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') dismissed.value = true
}
</script>

<template>
  <span
    ref="root"
    class="ads-tooltip__anchor"
    :class="{ 'is-dismissed': dismissed }"
    @keydown="onKeydown"
    @mouseleave="dismissed = false"
    @focusout="dismissed = false"
  >
    <slot />
    <span :id="id" class="ads-tooltip ads-tooltip__bubble" :class="`is-${position}`" role="tooltip">{{ text }}</span>
  </span>
</template>

<style scoped>
.ads-tooltip__anchor {
  position: relative;
  display: inline-flex;
}

.ads-tooltip__bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% + var(--sp-2));
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-control) var(--ease);
  z-index: 30;
}

.ads-tooltip__bubble.is-bottom {
  top: calc(100% + var(--sp-2));
  bottom: auto;
}

.ads-tooltip__anchor:hover .ads-tooltip__bubble,
.ads-tooltip__anchor:focus-within .ads-tooltip__bubble {
  opacity: 1;
}

.ads-tooltip__anchor.is-dismissed .ads-tooltip__bubble {
  opacity: 0;
}
</style>
