<script setup lang="ts">
// A copyable code block for the docs.
const props = defineProps<{ code: string }>()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    // Clipboard is unavailable; the code is still readable inline.
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="cb">
    <button type="button" class="cb-btn" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    <pre class="ads-code cb-pre"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.cb {
  position: relative;
  min-width: 0;
}

.cb-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 1;
  padding: 4px 10px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-soft);
  transition: color 0.2s var(--ease);
}

.cb-btn:hover {
  color: var(--text);
}

.cb-pre {
  margin: 0;
  padding-right: 70px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
