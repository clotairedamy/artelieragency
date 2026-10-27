<script setup lang="ts">
// The toast host. Mount once (in app.vue) and call useToast().push() anywhere.
const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toasts" role="status" aria-live="polite">
      <TransitionGroup name="toast">
        <button v-for="t in toasts" :key="t.id" type="button" class="ads-toast" @click="dismiss(t.id)">
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

@media (max-width: 899px) {
  .toasts {
    right: 0;
    left: 0;
    justify-items: center;
    bottom: calc(96px + env(safe-area-inset-bottom));
  }
}

.toast-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent-ink) 16%, transparent);
  flex: none;
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
