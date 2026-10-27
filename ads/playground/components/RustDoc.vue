<script setup lang="ts">
// A documented Rust component: name → description → live preview → Rust usage
// → the Rust source file. The preview renders the Vue equivalent, which is
// pixel-identical because both share the same CSS.
defineProps<{
  id: string
  name: string
  description?: string
  code: string
  file: string
  source: string
}>()
</script>

<template>
  <article :id="id" class="rdoc">
    <header class="head">
      <h2 class="name">{{ name }}</h2>
      <p v-if="description" class="desc">{{ description }}</p>
    </header>

    <div class="preview"><slot /></div>

    <CodeBlock :code="code" />

    <details class="src">
      <summary>Rust source · <code>{{ file }}</code></summary>
      <CodeBlock :code="source" />
    </details>
  </article>
</template>

<style scoped>
.rdoc {
  display: grid;
  gap: 16px;
  padding: clamp(20px, 3vw, 30px);
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  scroll-margin-top: 90px;
}

.head {
  display: grid;
  gap: 8px;
}

.name {
  font-size: 1.3rem;
  letter-spacing: -0.02em;
}

.desc {
  color: var(--subdued);
  font-size: 0.9rem;
  max-width: 68ch;
}

.preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: clamp(20px, 3vw, 28px);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  overflow-x: auto;
}

.preview :deep(.block) {
  display: block;
  width: 100%;
}

.src {
  border-top: 1px solid var(--line);
  padding-top: 12px;
}

.src summary {
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--subdued);
  list-style: none;
  user-select: none;
}

.src summary:hover {
  color: var(--text);
}

.src summary::before {
  content: '+ ';
  font-family: var(--mono);
}

.src[open] summary::before {
  content: '− ';
}

.src :deep(.cb) {
  margin-top: 12px;
}
</style>
