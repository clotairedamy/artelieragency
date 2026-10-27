<script setup lang="ts">
// One documented component: name, description, a live preview, usage, the
// props, and the whole source file. The source is the point of showing it —
// how the thing is actually built — but it is long, so it sits behind a
// disclosure rather than in the way of the usage.
//
// A Vue component's source is found by name. Anything else (the Rust kit)
// passes its own `source` and the `file` it came from.
//
// The preview sits in a well, so a card shown on a card is still visible.
export type DocProp = { name: string; type?: string; default?: string; desc?: string }

const props = withDefaults(
  defineProps<{
    id: string
    name: string
    description?: string
    code: string
    language?: string
    props?: DocProp[]
    source?: string
    file?: string
  }>(),
  { description: '', language: 'vue', props: () => [], source: undefined, file: undefined },
)

const { source } = useComponentSource()
const componentSource = computed(() => props.source ?? source(props.name))
const sourceFile = computed(() => props.file ?? `ads/app/components/${props.name}.vue`)
</script>

<template>
  <article :id="id" class="component-doc">
    <header class="component-doc__head">
      <h2 class="component-doc__name">{{ name }}</h2>
      <p v-if="description" class="component-doc__desc">{{ description }}</p>
    </header>

    <div v-if="$slots.default" class="component-doc__preview"><slot /></div>

    <AdsCodeBlock :code="code" :language="language" />

    <div v-if="props.props.length" class="component-doc__table">
      <table class="component-doc__props">
        <caption class="sr-only">{{ name }} props</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in props.props" :key="p.name">
            <th scope="row"><code>{{ p.name }}</code></th>
            <td><code>{{ p.type }}</code></td>
            <td><code>{{ p.default }}</code></td>
            <td>{{ p.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <details v-if="componentSource" class="component-doc__source">
      <summary class="component-doc__summary">
        Source · <code>{{ sourceFile }}</code>
      </summary>
      <AdsCodeBlock :code="componentSource" :language="language" />
    </details>
  </article>
</template>

<style scoped>
.component-doc {
  display: grid;
  gap: var(--sp-4);
  padding: clamp(22px, 3vw, 36px);
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  /* Clears the app bar and the docs bar when a hash link lands here. */
  scroll-margin-top: 140px;
  min-width: 0;
}

.component-doc__head {
  display: grid;
  gap: var(--sp-2);
}

.component-doc__name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.component-doc__desc {
  max-width: 68ch;
  color: var(--subdued);
  font-size: 0.92rem;
}

.component-doc__preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-4);
  min-width: 0;
  padding: clamp(20px, 3vw, 28px);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
}

/* A preview that needs the full width says so with .block. */
.component-doc__preview :deep(.block) {
  display: block;
  width: 100%;
}

/* Wide tables wrap their cells rather than scrolling: there are no
   scrollbars on this site to say there is more. */
.component-doc__props {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}

.component-doc__props thead th {
  padding: var(--sp-2) 10px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-label);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-align: left;
  text-transform: uppercase;
  color: var(--subdued);
}

.component-doc__props tbody th,
.component-doc__props td {
  padding: var(--sp-2) 10px;
  border-bottom: 1px solid var(--line);
  font-weight: 400;
  text-align: left;
  vertical-align: top;
  overflow-wrap: anywhere;
  color: var(--text-soft);
}

.component-doc__props code {
  font-size: 0.78rem;
}

.component-doc__props td code {
  color: var(--subdued);
}

.component-doc__source {
  display: grid;
  gap: var(--sp-3);
  padding-top: var(--sp-3);
  border-top: 1px solid var(--line);
}

.component-doc__summary {
  cursor: pointer;
  list-style: none;
  font-size: 0.82rem;
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease);
}

.component-doc__summary::-webkit-details-marker {
  display: none;
}

.component-doc__summary::before {
  content: '+ ';
  font-family: var(--mono);
}

.component-doc__source[open] > .component-doc__summary::before {
  content: '− ';
}

.component-doc__summary:hover {
  color: var(--accent);
}
</style>
