<script setup lang="ts">
// A modal on a scrim. Closes on Escape and on scrim click; focus moves into
// the panel on open.
const props = withDefaults(defineProps<{ title?: string; width?: string }>(), { title: '', width: '' })

const open = defineModel<boolean>('open', { default: false })
const panel = ref<HTMLElement>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watch(open, (v) => {
  if (v) nextTick(() => panel.value?.focus())
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-root" @keydown="onKeydown">
        <div class="scrim" @click="open = false" />
        <div
          ref="panel"
          class="ads-modal"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :style="props.width ? { maxWidth: props.width } : undefined"
          @click.stop
        >
          <header v-if="title || $slots.close" class="modal-head">
            <h3 v-if="title">{{ title }}</h3>
            <button type="button" class="close" aria-label="Close" @click="open = false">
              <Icon name="plus" :size="16" style="rotate: 45deg" />
            </button>
          </header>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
}

.scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.55);
  backdrop-filter: blur(3px);
}

.ads-modal {
  position: relative;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.modal-head h3 {
  font-size: 1.05rem;
}

.close {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--subdued);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  transition: color 0.2s var(--ease);
}

.close:hover {
  color: var(--text);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s var(--ease);
}

.modal-enter-active .ads-modal,
.modal-leave-active .ads-modal {
  transition: transform 0.3s var(--ease), opacity 0.25s var(--ease);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .ads-modal,
.modal-leave-to .ads-modal {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
