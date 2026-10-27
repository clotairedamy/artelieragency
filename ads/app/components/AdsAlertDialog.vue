<script setup lang="ts">
// A confirmation that interrupts. It is for one irreversible step, so it says
// the verb on its button ("Delete project", never "OK") and, when that step is
// destructive, the button stays in the default style — the one accent on the
// screen never points at a loss — and focus starts on Cancel. Escape cancels,
// Tab stays inside, a click on the scrim does nothing (this is a decision, not
// a notice), and focus goes back to whatever opened it.
const props = withDefaults(
  defineProps<{
    title: string
    actionLabel: string
    description?: string
    cancelLabel?: string
    destructive?: boolean
  }>(),
  { description: '', cancelLabel: 'Cancel', destructive: true },
)
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ (e: 'action'): void; (e: 'cancel'): void }>()

const uid = useId()
const panel = ref<HTMLElement>()
const cancelBtn = ref<HTMLButtonElement>()
const actionBtn = ref<HTMLButtonElement>()
let returnTo: HTMLElement | null = null
let prevOverflow = ''

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function cancel() {
  open.value = false
  emit('cancel')
}

function act() {
  open.value = false
  emit('action')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    cancel()
    return
  }
  if (e.key !== 'Tab' || !panel.value) return
  const items = Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!items.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  open,
  async (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      returnTo = document.activeElement as HTMLElement | null
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      await nextTick()
      ;(props.destructive ? cancelBtn.value : actionBtn.value)?.focus()
    } else {
      document.body.style.overflow = prevOverflow
      returnTo?.focus?.()
      returnTo = null
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (import.meta.client && open.value) document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ads-alert-dialog" @keydown="onKeydown">
      <div class="ads-alert-dialog__scrim" aria-hidden="true" />
      <div
        ref="panel"
        class="ads-alert-dialog__panel ads-modal"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="`${uid}-title`"
        :aria-describedby="description ? `${uid}-desc` : undefined"
      >
        <h2 :id="`${uid}-title`" class="ads-alert-dialog__title">{{ title }}</h2>
        <p v-if="description" :id="`${uid}-desc`" class="ads-alert-dialog__desc">{{ description }}</p>
        <slot />
        <div class="ads-alert-dialog__actions">
          <button ref="cancelBtn" type="button" class="btn btn-quiet" @click="cancel">{{ cancelLabel }}</button>
          <button ref="actionBtn" type="button" class="btn" :class="{ 'btn-accent': !destructive }" @click="act">
            {{ actionLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ads-alert-dialog {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
}

.ads-alert-dialog__scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(2px);
}

.ads-alert-dialog__panel {
  position: relative;
  display: grid;
  gap: var(--sp-3);
  animation: ads-alert-dialog-in var(--dur-move) var(--ease);
}

.ads-alert-dialog__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

.ads-alert-dialog__desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-soft);
}

.ads-alert-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  margin-top: var(--sp-3);
}

@keyframes ads-alert-dialog-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}
</style>
