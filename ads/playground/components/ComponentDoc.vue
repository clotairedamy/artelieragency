<script setup lang="ts">
// One documented component: name → description → live preview → usage → source.
// The source block is the whole file, so you can copy it into your own
// app/components/ and change it freely.
export type DocProp = { name: string; type?: string; default?: string; desc?: string }

const props = defineProps<{
  id: string
  name: string
  description?: string
  code: string
  props?: DocProp[]
}>()

const { source } = useComponentSource()
const componentSource = computed(() => source(props.name))
</script>

<template>
  <article :id="id" class="cdoc">
    <header class="cdoc-head">
      <h2 class="cdoc-name">{{ name }}</h2>
      <p v-if="description" class="cdoc-desc">{{ description }}</p>
    </header>

    <div class="cdoc-preview"><slot /></div>

    <CodeBlock :code="code" />

    <details v-if="componentSource" class="cdoc-source">
      <summary>Component source · copy into <code>app/components/{{ name }}.vue</code></summary>
      <CodeBlock :code="componentSource" />
    </details>

    <table v-if="props?.length" class="cdoc-props">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in props" :key="p.name">
          <td><code>{{ p.name }}</code></td>
          <td><code class="dim">{{ p.type }}</code></td>
          <td><code class="dim">{{ p.default }}</code></td>
          <td>{{ p.desc }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<style scoped>
.cdoc {
  display: grid;
  gap: 18px;
  padding: clamp(22px, 3vw, 36px);
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  scroll-margin-top: 90px;
}

.cdoc-head {
  display: grid;
  gap: 8px;
}

.cdoc-name {
  font-size: 1.4rem;
  letter-spacing: -0.02em;
}

.cdoc-desc {
  color: var(--subdued);
  font-size: 0.92rem;
  max-width: 68ch;
}

/* The preview sits in a well, so a card component on a card background is
   still visible. */
.cdoc-preview {
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

.cdoc-preview :deep(.block) {
  display: block;
  width: 100%;
}

.cdoc-source {
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

.cdoc-source summary {
  cursor: pointer;
  font-size: 0.82rem;
  color: var(--subdued);
  list-style: none;
  user-select: none;
}

.cdoc-source summary:hover {
  color: var(--text);
}

.cdoc-source summary::before {
  content: '+ ';
  font-family: var(--mono);
}

.cdoc-source[open] summary::before {
  content: '− ';
}

.cdoc-source :deep(.cb) {
  margin-top: 14px;
}

.cdoc-source code {
  font-size: 0.72rem;
}

.cdoc-props {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.cdoc-props th {
  text-align: left;
  font-family: var(--mono);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subdued);
  font-weight: 500;
  padding: 8px 10px;
  border-bottom: 1px solid var(--line);
}

.cdoc-props td {
  padding: 8px 10px;
  color: var(--text-soft);
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

.cdoc-props code {
  font-size: 0.78rem;
}
</style>
