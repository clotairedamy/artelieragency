<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toasts" role="status" aria-live="polite">
      <TransitionGroup name="toast">
        <button v-for="t in toasts" :key="t.id" type="button" class="toast" @click="dismiss(t.id)">
          <span class="toast-icon"><Icon :name="t.icon" :size="15" /></span>
          {{ t.text }}
        </button>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 110;
  display: grid;
  justify-items: end;
  gap: 10px;
  pointer-events: none;
}

/* Above the tab bar on a phone, centred under the thumb. */
@media (max-width: 899px) {
  .toasts {
    right: 0;
    left: 0;
    justify-items: center;
    bottom: calc(96px + env(safe-area-inset-bottom));
  }
}

.toast {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 10px;
  border-radius: var(--pill);
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.87rem;
  font-weight: 500;
  box-shadow: var(--soft-raised), var(--accent-glow);
  pointer-events: auto;
}

.toast-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent-ink) 16%, transparent);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s var(--ease),
    transform 0.4s var(--ease);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.toast-move {
  transition: transform 0.4s var(--ease);
}
</style>
