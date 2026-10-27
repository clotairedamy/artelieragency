<script setup lang="ts">
// A side sheet — a panel that slides in from a side.
withDefaults(defineProps<{ open?: boolean; side?: 'left' | 'right' | 'top' | 'bottom'; title?: string }>(), {
  open: false,
  side: 'right',
  title: '',
})
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="scrim" @click.self="emit('close')">
      <div class="sheet" :class="side" role="dialog" :aria-label="title || 'Sheet'">
        <header v-if="title" class="sheet-head">
          <h3 class="h3">{{ title }}</h3>
          <button class="icon-btn" type="button" aria-label="Close" @click="emit('close')">×</button>
        </header>
        <div class="sheet-body"><slot /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.sheet {
  position: absolute;
  display: grid;
  gap: 16px;
  max-width: 92vw;
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
  padding: 20px 22px;
}

.sheet.right { right: 0; top: 0; bottom: 0; width: min(420px, 92vw); border-radius: var(--radius-lg) 0 0 var(--radius-lg); }
.sheet.left { left: 0; top: 0; bottom: 0; width: min(420px, 92vw); border-radius: 0 var(--radius-lg) var(--radius-lg) 0; }
.sheet.top { top: 0; left: 0; right: 0; border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
.sheet.bottom { bottom: 0; left: 0; right: 0; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }

.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sheet-head .h3 {
  margin: 0;
}

.sheet-body {
  overflow-y: auto;
  min-height: 0;
}
</style>
