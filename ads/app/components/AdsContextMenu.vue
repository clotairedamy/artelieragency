<script setup lang="ts">
// A right-click context menu, positioned where it was opened.
type MenuEntry = { label: string; action?: () => void }
const open = ref(false)
const pos = ref({ x: 0, y: 0 })
const entries = defineProps<{ items: MenuEntry[] }>()

function show(e: MouseEvent) {
  e.preventDefault()
  pos.value = { x: e.clientX, y: e.clientY }
  open.value = true
}

function pick(item: MenuEntry) {
  open.value = false
  item.action?.()
}
</script>

<template>
  <div class="ctx" @contextmenu="show">
    <slot />
    <Teleport to="body">
      <div v-if="open" class="ctx-scrim" @click="open = false" @contextmenu.prevent="open = false">
        <div class="ctx-menu" :style="{ left: `${pos.x}px`, top: `${pos.y}px` }" role="menu">
          <button v-for="(it, i) in entries.items" :key="i" type="button" role="menuitem" class="ctx-item" @click="pick(it)">
            {{ it.label }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ctx {
  display: contents;
}

.ctx-scrim {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.ctx-menu {
  position: fixed;
  display: grid;
  gap: 2px;
  min-width: 180px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
}

.ctx-item {
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-soft);
  font-size: 0.88rem;
}

.ctx-item:hover {
  background: var(--hover);
  color: var(--text);
}
</style>
