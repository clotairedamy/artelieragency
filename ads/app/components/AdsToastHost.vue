<script setup lang="ts">
// The toast host. Mount once (in app.vue) and call useToast().push() anywhere.
// A toast confirms something that already happened and leaves on its own, so
// it never carries an error — useToast() has no error glyph to give it. The
// glyph sits in a small well, pressed into the toast rather than tinted.
const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="ads-toast-host" role="status" aria-live="polite">
      <TransitionGroup name="ads-toast-host__toast">
        <button v-for="t in toasts" :key="t.id" type="button" class="ads-toast ads-toast-host__toast" @click="dismiss(t.id)">
          <span class="ads-toast-host__icon"><Icon :name="t.icon" :size="15" /></span>
          {{ t.text }}
        </button>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.ads-toast-host {
  position: fixed;
  right: var(--sp-5);
  bottom: var(--sp-5);
  z-index: 110;
  display: grid;
  justify-items: end;
  gap: var(--sp-2);
  pointer-events: none;
}

@media (max-width: 899px) {
  .ads-toast-host {
    right: 0;
    left: 0;
    justify-items: center;
    bottom: calc(96px + env(safe-area-inset-bottom));
  }
}

.ads-toast-host__toast {
  pointer-events: auto;
}

.ads-toast-host__icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  flex: none;
}

.ads-toast-host__toast-enter-active,
.ads-toast-host__toast-leave-active {
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-move) var(--ease);
}

.ads-toast-host__toast-enter-from {
  opacity: 0;
  transform: translateY(var(--sp-3)) scale(0.96);
}

.ads-toast-host__toast-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.ads-toast-host__toast-move {
  transition: transform var(--dur-move) var(--ease);
}
</style>
