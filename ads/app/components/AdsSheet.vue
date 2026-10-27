<script setup lang="ts">
// A panel that slides in from an edge for a task that needs more room than a
// popover — a filter set, a settings group. It is a modal dialog: it takes
// focus, keeps Tab inside, closes on Escape, the close button or the scrim,
// and hands focus back to whatever opened it. Not for a row's detail — that is
// a drawer, so the list stays in view.
const props = withDefaults(defineProps<{ title: string; side?: 'left' | 'right' | 'top' | 'bottom' }>(), {
  side: 'right',
})
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ (e: 'close'): void }>()

const uid = useId()
const panel = ref<HTMLElement>()
let returnTo: HTMLElement | null = null
let prevOverflow = ''

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function close() {
  open.value = false
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
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
      // First field if there is one, otherwise the close button.
      const first = panel.value?.querySelector<HTMLElement>(`.ads-sheet__body :is(${FOCUSABLE})`)
      ;(first ?? panel.value?.querySelector<HTMLElement>('.ads-sheet__close'))?.focus()
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
    <div v-if="open" class="ads-sheet" @keydown="onKeydown">
      <div class="ads-sheet__scrim" aria-hidden="true" @click="close" />
      <div
        ref="panel"
        class="ads-sheet__panel"
        :class="`is-${props.side}`"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${uid}-title`"
      >
        <header class="ads-sheet__head">
          <h2 :id="`${uid}-title`" class="ads-sheet__title">{{ title }}</h2>
          <button class="ads-sheet__close ads-icon-button" type="button" aria-label="Close sheet" @click="close">
            <Icon name="plus" :size="16" style="transform: rotate(45deg)" />
          </button>
        </header>
        <div class="ads-sheet__body"><slot /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ads-sheet {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.ads-sheet__scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}

.ads-sheet__panel {
  position: absolute;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--sp-4);
  max-width: 92vw;
  max-height: 100dvh;
  padding: var(--sp-5);
  background: var(--raised);
  box-shadow: var(--soft-raised-lg);
}

.ads-sheet__panel.is-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: min(420px, 92vw);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  animation: ads-sheet-in-right var(--dur-move) var(--ease);
}

.ads-sheet__panel.is-left {
  top: 0;
  bottom: 0;
  left: 0;
  width: min(420px, 92vw);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  animation: ads-sheet-in-left var(--dur-move) var(--ease);
}

.ads-sheet__panel.is-top {
  top: 0;
  right: 0;
  left: 0;
  max-width: none;
  max-height: 80dvh;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  animation: ads-sheet-in-top var(--dur-move) var(--ease);
}

.ads-sheet__panel.is-bottom {
  right: 0;
  bottom: 0;
  left: 0;
  max-width: none;
  max-height: 80dvh;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  animation: ads-sheet-in-bottom var(--dur-move) var(--ease);
}

.ads-sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
}

.ads-sheet__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

.ads-sheet__body {
  min-height: 0;
  overflow-y: auto;
}

@keyframes ads-sheet-in-right {
  from { transform: translateX(100%); }
}

@keyframes ads-sheet-in-left {
  from { transform: translateX(-100%); }
}

@keyframes ads-sheet-in-top {
  from { transform: translateY(-100%); }
}

@keyframes ads-sheet-in-bottom {
  from { transform: translateY(100%); }
}
</style>
