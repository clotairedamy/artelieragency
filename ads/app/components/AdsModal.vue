<script setup lang="ts">
// A modal on a scrim. It blocks everything until answered, so it is kept for
// the few moments that cannot proceed without a decision — a destructive
// confirmation, where the verb goes on the button ("Delete project", never
// "OK") and the button stays default weight, never accent. Row detail is a
// drawer, not this. The title is required: it names the dialog for assistive
// tech. Escape and the scrim close it; focus moves in on open, is kept inside
// while open, and goes back to whatever opened it.
const props = withDefaults(defineProps<{ title: string; width?: string }>(), { width: '' })

const open = defineModel<boolean>('open', { default: false })
const panel = ref<HTMLElement>()
const titleId = useId()
let opener: HTMLElement | null = null

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (e.key !== 'Tab' || !panel.value) return
  // Keep Tab inside the panel: the page behind is inert until this is answered.
  const items = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)]
  if (!items.length) return
  const first = items[0]!
  const last = items[items.length - 1]!
  if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(open, (v) => {
  if (!import.meta.client) return
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    opener = document.activeElement as HTMLElement | null
    nextTick(() => panel.value?.focus())
  } else {
    opener?.focus?.()
    opener = null
  }
})

onBeforeUnmount(() => {
  if (import.meta.client && open.value) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="ads-modal__root">
      <div v-if="open" class="ads-modal__root" @keydown="onKeydown">
        <div class="ads-modal__scrim" @click="open = false" />
        <div
          ref="panel"
          class="ads-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :style="props.width ? { maxWidth: props.width } : undefined"
          @click.stop
        >
          <header class="ads-modal__head">
            <h3 :id="titleId" class="ads-modal__title">{{ title }}</h3>
            <button type="button" class="ads-modal__close" aria-label="Close" @click="open = false">
              <Icon name="plus" :size="16" class="ads-modal__close-glyph" />
            </button>
          </header>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ads-modal__root {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
}

.ads-modal__scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.55);
  backdrop-filter: blur(3px);
}

.ads-modal {
  position: relative;
}

.ads-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-4);
}

.ads-modal__title {
  font-size: 1.05rem;
}

.ads-modal__close {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: var(--subdued);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  transition: color var(--dur-control) var(--ease);
}

.ads-modal__close:hover {
  color: var(--accent);
}

/* The close glyph is the plus, turned: one glyph set, no extra path. */
.ads-modal__close-glyph {
  rotate: 45deg;
}

.ads-modal__root-enter-active,
.ads-modal__root-leave-active {
  transition: opacity var(--dur-control) var(--ease);
}

.ads-modal__root-enter-active .ads-modal,
.ads-modal__root-leave-active .ads-modal {
  /* One duration with the scrim, so Vue does not unmount the panel mid-move. */
  transition:
    transform var(--dur-control) var(--ease),
    opacity var(--dur-control) var(--ease);
}

.ads-modal__root-enter-from,
.ads-modal__root-leave-to {
  opacity: 0;
}

.ads-modal__root-enter-from .ads-modal,
.ads-modal__root-leave-to .ads-modal {
  opacity: 0;
  transform: translateY(var(--sp-3)) scale(0.98);
}
</style>
