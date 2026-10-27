<script setup lang="ts">
// A code block with a copy button. Code wraps rather than scrolling sideways:
// with no scrollbars anywhere, a cut-off line would give no sign there is more.
// The button says what it copies, and the confirmation is announced, not just
// shown.
const props = withDefaults(defineProps<{ code: string; language?: string }>(), { language: '' })
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    // Clipboard unavailable; the code is still readable and selectable.
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1600)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="ads-code-block">
    <div class="ads-code-block__bar">
      <span v-if="language" class="ads-label">{{ language }}</span>
      <button type="button" class="ads-code-block__copy" @click="copy">
        <span aria-live="polite">{{ copied ? 'Copied' : 'Copy code' }}</span>
      </button>
    </div>
    <pre class="ads-code-block__pre"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.ads-code-block {
  display: grid;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4) var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-code-block__bar {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.ads-code-block__copy {
  margin-left: auto;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-soft);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-code-block__copy:hover {
  color: var(--accent);
}

.ads-code-block__copy:active {
  box-shadow: var(--soft-inset-sm);
}

.ads-code-block__pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--mono);
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--text-soft);
}
</style>
