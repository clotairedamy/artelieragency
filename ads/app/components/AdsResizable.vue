<script setup lang="ts">
// A panel resized by dragging its edge.
withDefaults(defineProps<{ initial?: string }>(), { initial: '280px' })
const width = ref('280px')
const dragging = ref(false)

function onMove(e: MouseEvent) {
  if (!dragging.value) return
  width.value = `${Math.max(160, e.clientX)}px`
}
</script>

<template>
  <div class="resizable" :style="{ width }" @mousemove="onMove" @mouseup="dragging = false" @mouseleave="dragging = false">
    <div class="res-body"><slot /></div>
    <span class="res-handle" aria-hidden="true" @mousedown="dragging = true" />
  </div>
</template>

<style scoped>
.resizable {
  position: relative;
  min-width: 160px;
  max-width: 90vw;
}

.res-body {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  padding: 14px 16px;
  height: 100%;
  overflow: auto;
}

.res-handle {
  position: absolute;
  top: 0;
  right: -4px;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  border-radius: var(--pill);
  background: transparent;
  transition: background 0.2s var(--ease);
}

.res-handle:hover,
.resizable:active .res-handle {
  background: var(--accent);
}
</style>
