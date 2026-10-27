<script setup lang="ts">
// The column a thread lives in. It is a live log: new messages are announced
// politely, and the view follows them only if the reader was already at the
// bottom — scrolling up to re-read is never yanked away. Focusable, so the
// keyboard can scroll it with no visible scrollbar.
const props = withDefaults(defineProps<{ label?: string; stick?: boolean }>(), {
  label: 'Messages',
  stick: true,
})
const el = ref<HTMLElement>()
let pinned = true
let observer: MutationObserver | undefined

function nearBottom() {
  const s = el.value
  return !!s && s.scrollHeight - s.scrollTop - s.clientHeight < 48
}

function toBottom() {
  el.value?.scrollTo({ top: el.value.scrollHeight })
}

onMounted(() => {
  if (!props.stick || !el.value) return
  toBottom()
  observer = new MutationObserver(() => {
    if (pinned) toBottom()
  })
  observer.observe(el.value, { childList: true, subtree: true, characterData: true })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="ads-message-scroller"
    role="log"
    aria-live="polite"
    :aria-label="label"
    tabindex="0"
    @scroll.passive="pinned = nearBottom()"
  >
    <slot />
  </div>
</template>

<style scoped>
.ads-message-scroller {
  display: grid;
  align-content: start;
  gap: var(--sp-3);
  overflow-y: auto;
  padding: var(--sp-1) 2px;
  border-radius: var(--radius-sm);
}
</style>
