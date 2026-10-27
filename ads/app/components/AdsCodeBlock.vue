<script setup lang="ts">
// A code block with a copy button.
const props = withDefaults(defineProps<{ code: string; language?: string }>(), { language: '' })
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    // Clipboard unavailable; the code is still readable.
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="codeblock">
    <button type="button" class="cb-btn" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
    <pre class="cb-pre"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.codeblock {
  position: relative;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  padding: 16px 18px;
  overflow: hidden;
}

.cb-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  padding: 4px 11px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-soft);
}

.cb-btn:hover {
  color: var(--text);
}

.cb-pre {
  margin: 0;
  padding-right: 60px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--text-soft);
}
</style>
