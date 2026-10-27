<script setup lang="ts">
// Extra context beside a name or a link, on hover or keyboard focus. It is
// supplementary — nothing in it may be the only way to reach something — so
// it waits a beat before opening, lingers long enough to move the pointer
// into it, and Escape dismisses it without moving focus.
const props = withDefaults(defineProps<{ openDelay?: number; closeDelay?: number }>(), {
  openDelay: 300,
  closeDelay: 200,
})
const uid = useId()
const open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function later(next: boolean, ms: number) {
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = next), ms)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    clearTimeout(timer)
    open.value = false
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div
    class="ads-hover-card"
    @mouseenter="later(true, props.openDelay)"
    @mouseleave="later(false, props.closeDelay)"
    @focusin="later(true, 0)"
    @focusout="later(false, props.closeDelay)"
    @keydown="onKeydown"
  >
    <span class="ads-hover-card__trigger" :aria-describedby="open ? uid : undefined"><slot name="trigger" /></span>
    <div :id="uid" class="ads-hover-card__card" :class="{ 'is-open': open }" role="tooltip">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ads-hover-card {
  position: relative;
  display: inline-block;
}

.ads-hover-card__card {
  position: absolute;
  top: calc(100% + var(--sp-2));
  left: 0;
  z-index: 20;
  min-width: 220px;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease),
    visibility var(--dur-control);
}

.ads-hover-card__card.is-open {
  opacity: 1;
  visibility: visible;
  transform: none;
}
</style>
