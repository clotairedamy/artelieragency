<script setup lang="ts">
// A right-hand detail panel. In a dashboard this is where a selected row
// explains itself, so the table never has to leave the screen — which is why
// row detail opens here and never in a modal: a modal hides the very rows the
// reader is comparing against.
//
// The panel is a labelled landmark. Given a `@close` listener it carries a
// close button and Escape closes it; when it opens, focus moves into it, and
// when it closes, focus goes back to whatever opened it (usually the row).
const props = withDefaults(defineProps<{ title?: string; open?: boolean }>(), { title: undefined, open: true })
const emit = defineEmits<{ close: [] }>()

// Only offer a close control when someone is listening for it; a button that
// does nothing is worse than no button.
const closable = !!getCurrentInstance()?.vnode.props?.onClose

const panel = ref<HTMLElement | null>(null)
let opener: HTMLElement | null = null

watch(
  () => props.open,
  async (open) => {
    if (!import.meta.client) return
    if (open) {
      opener = document.activeElement as HTMLElement | null
      await nextTick()
      panel.value?.focus()
    } else {
      opener?.focus?.()
      opener = null
    }
  },
)

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !closable) return
  e.stopPropagation()
  emit('close')
}
</script>

<template>
  <div class="ads-drawer" :class="{ 'is-closed': !open }">
    <div class="ads-drawer__main"><slot /></div>
    <aside
      v-if="open"
      ref="panel"
      class="panel ads-drawer__panel"
      tabindex="-1"
      :aria-label="title ?? 'Detail'"
      @keydown="onKey"
    >
      <div v-if="title || closable" class="ads-drawer__head">
        <span v-if="title" class="ads-label">{{ title }}</span>
        <button v-if="closable" type="button" class="ads-icon-button ads-drawer__close" aria-label="Close detail" @click="emit('close')">
          <Icon name="plus" :size="14" style="transform: rotate(45deg)" />
        </button>
      </div>
      <slot name="panel" />
    </aside>
  </div>
</template>

<style scoped>
.ads-drawer.is-closed {
  grid-template-columns: minmax(0, 1fr);
}

.ads-drawer__panel:focus {
  outline: none;
}

.ads-drawer__panel:focus-visible {
  box-shadow: inset 0 0 0 2px var(--accent);
}

.ads-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  min-height: 28px;
}

.ads-drawer__close {
  width: 28px;
  height: 28px;
  margin-left: auto;
}
</style>
