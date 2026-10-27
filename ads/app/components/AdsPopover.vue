<script setup lang="ts">
// A small amount of extra context, anchored to what prompted it. More than a
// tooltip, less than a drawer — supplementary by definition. Nothing the
// reader needs to finish the task may live only in here: if it matters, it
// belongs on the page; if it is a row's detail, it belongs in the drawer.
//
// Without `triggerLabel` it renders as a static card, for layouts that place
// it themselves. With one, it brings its own button: the button reports
// `aria-expanded`, Escape or a click outside closes the panel, and focus goes
// back to the button.
const props = withDefaults(
  defineProps<{ label?: string; body?: string; link?: { label: string; to?: string }; triggerLabel?: string }>(),
  { label: '', body: '', link: undefined, triggerLabel: undefined },
)

const id = `ads-popover-${useId().replace(/[^\w-]/g, '-')}`
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)

function close(refocus = true) {
  if (!open.value) return
  open.value = false
  if (refocus) trigger.value?.focus()
}

function onOutside(e: PointerEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close(false)
}

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !open.value) return
  e.stopPropagation()
  close()
}

watch(open, (o) => {
  if (!import.meta.client) return
  if (o) document.addEventListener('pointerdown', onOutside)
  else document.removeEventListener('pointerdown', onOutside)
})

onBeforeUnmount(() => {
  if (import.meta.client) document.removeEventListener('pointerdown', onOutside)
})
</script>

<template>
  <span v-if="triggerLabel" ref="root" class="ads-popover__anchor" @keydown="onKey">
    <button
      ref="trigger"
      type="button"
      class="btn btn-quiet btn-sm"
      :aria-expanded="open"
      :aria-controls="id"
      @click="open = !open"
    >
      {{ triggerLabel }}
    </button>
    <Transition name="ads-popover__fade">
      <div v-show="open" :id="id" class="ads-popover is-anchored" role="dialog" :aria-label="label || triggerLabel">
        <span v-if="label" class="ads-label">{{ label }}</span>
        <span v-if="body" class="ads-popover__body">{{ body }}</span>
        <slot />
        <NuxtLink v-if="link" class="ads-link" :to="link.to ?? '#'">{{ link.label }}</NuxtLink>
      </div>
    </Transition>
  </span>
  <div v-else class="ads-popover">
    <span v-if="label" class="ads-label">{{ label }}</span>
    <span v-if="body" class="ads-popover__body">{{ body }}</span>
    <slot />
    <NuxtLink v-if="link" class="ads-link" :to="link.to ?? '#'">{{ link.label }}</NuxtLink>
  </div>
</template>

<style scoped>
.ads-popover__body {
  font-size: 0.84rem;
  color: var(--text-soft);
}

.ads-popover__anchor {
  position: relative;
  display: inline-block;
}

.ads-popover.is-anchored {
  position: absolute;
  top: calc(100% + var(--sp-2));
  left: 0;
  z-index: 20;
  width: max-content;
}

.ads-popover__fade-enter-active,
.ads-popover__fade-leave-active {
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-popover__fade-enter-from,
.ads-popover__fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
