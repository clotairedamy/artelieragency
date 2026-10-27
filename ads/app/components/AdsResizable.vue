<script setup lang="ts">
// A panel whose width is yours to set. The edge is a real separator: you can
// drag it, or focus it and use the arrow keys (Shift for bigger steps), and it
// reports its width as a value. The handle is a visible hairline at rest and
// brightens to the accent when touched — a control has to look like one
// before it is hovered.
const props = withDefaults(defineProps<{ min?: number; max?: number; label?: string }>(), {
  min: 160,
  max: 720,
  label: 'Resize panel',
})
const width = defineModel<number>('width', { default: 280 })
const root = ref<HTMLElement>()
const dragging = ref(false)

function clamp(n: number) {
  return Math.round(Math.min(props.max, Math.max(props.min, n)))
}

function onPointerdown(e: PointerEvent) {
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  e.preventDefault()
}

function onPointermove(e: PointerEvent) {
  if (!dragging.value || !root.value) return
  width.value = clamp(e.clientX - root.value.getBoundingClientRect().left)
}

function onPointerup(e: PointerEvent) {
  dragging.value = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
}

function onKeydown(e: KeyboardEvent) {
  const step = e.shiftKey ? 64 : 16
  const map: Record<string, number> = {
    ArrowLeft: width.value - step,
    ArrowRight: width.value + step,
    Home: props.min,
    End: props.max,
  }
  if (!(e.key in map)) return
  e.preventDefault()
  width.value = clamp(map[e.key]!)
}
</script>

<template>
  <div ref="root" class="ads-resizable" :class="{ 'is-dragging': dragging }" :style="{ width: `${width}px` }">
    <div class="ads-resizable__body"><slot /></div>
    <div
      class="ads-resizable__handle"
      role="separator"
      tabindex="0"
      aria-orientation="vertical"
      :aria-label="label"
      :aria-valuenow="width"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="`${width} pixels`"
      @pointerdown="onPointerdown"
      @pointermove="onPointermove"
      @pointerup="onPointerup"
      @pointercancel="onPointerup"
      @keydown="onKeydown"
    />
  </div>
</template>

<style scoped>
.ads-resizable {
  position: relative;
  max-width: 100%;
}

.ads-resizable__body {
  height: 100%;
  padding: var(--sp-3) var(--sp-4);
  overflow: auto;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

/* A wide, invisible hit area around a narrow visible bar. */
.ads-resizable__handle {
  position: absolute;
  top: var(--sp-2);
  right: -8px;
  bottom: var(--sp-2);
  width: 16px;
  border-radius: var(--pill);
  cursor: ew-resize;
  touch-action: none;
}

.ads-resizable__handle::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  translate: -50% 0;
  border-radius: var(--pill);
  background: var(--line-strong);
  transition: background var(--dur-control) var(--ease);
}

.ads-resizable__handle:hover::after,
.ads-resizable__handle:focus-visible::after,
.ads-resizable.is-dragging .ads-resizable__handle::after {
  background: var(--accent);
}
</style>
