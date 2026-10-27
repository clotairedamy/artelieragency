<script setup lang="ts">
// The MCP server's page, shared by both kits. It shows how the studio builds
// apps now: a model working from the real components under the kit's rules,
// in either language. So the page shows what the model is given, how it is
// wired, and one request from prompt to code. It describes a workflow; it
// is not an invitation to install anything.
const { kit } = useUiKit()
const rust = computed(() => kit.value.label === 'Rust')

const tools = [
  { name: 'list_components', does: 'Every component in the kit, with its category and what it is for. Vue or Rust.' },
  { name: 'get_component_schema', does: 'One component in full: props with their types, defaults and which are required, slots, events, a usage example and the source.' },
  { name: 'get_design_rules', does: 'The rules the kit is built on: grey chrome, one accent per screen, monospaced numbers, status never by colour alone.' },
  { name: 'get_setup', does: 'How to add the kit to a Nuxt app or a Dioxus app.' },
  { name: 'list_design_tokens', does: 'Every token by group: surfaces, text, elevation, radius, spacing, motion, and the data palettes.' },
  { name: 'get_utility_classes', does: 'The utility vocabulary, so layout uses the kit’s spacing rather than invented values.' },
  { name: 'list_icons', does: 'The glyph names the Icon component draws.' },
  { name: 'render_component', does: 'A self-contained HTML preview of a component, with the real stylesheets inlined.' },
  { name: 'compose_layout', does: 'Several components stacked into one previewable screen.' },
]

const steps = [
  { n: '01', title: 'It reads the catalogue', body: 'Before writing anything, the model lists what exists. It cannot reach for a component the kit does not have.' },
  { n: '02', title: 'It reads the schema', body: 'Props, types and required fields come from the components themselves, not from a description that has drifted.' },
  { n: '03', title: 'It follows the rules', body: 'The design rules travel with the schema: the destructive button is never the accent, every chart says what it measures.' },
]

const claudeCode = `# In a studio project, with the kit in ads/
cd ads/mcp && npm install && npm run build && cd ../..
claude mcp add artelier-ui-kit -- node ./ads/mcp/dist/index.js`

const clientConfig = `{
  "mcpServers": {
    "artelier-ui-kit": {
      "command": "node",
      "args": ["/path/to/project/ads/mcp/dist/index.js"]
    }
  }
}`

const conversation = computed(() =>
  rust.value
    ? `You  Build a settings screen in Dioxus: a name field, a theme switch,
     and a delete-account action.

     → get_setup { kit: "rust" }
     → get_component_schema { name: "AdsField", kit: "rust" }
     → get_component_schema { name: "AdsChoice", kit: "rust" }
     → get_component_schema { name: "AdsAlertDialog", kit: "rust" }
     → get_design_rules

     The field gets the label it requires. Delete is a destructive
     AdsButton, default weight, behind an AdsAlertDialog with focus
     on Cancel — the accent stays on Save.`
    : `You  Build a settings screen in Nuxt: a name field, a theme switch,
     and a delete-account action.

     → get_setup { kit: "vue" }
     → get_component_schema { name: "AdsField" }
     → get_component_schema { name: "AdsChoice" }
     → get_component_schema { name: "AdsAlertDialog" }
     → get_design_rules

     The field gets the label it requires. Delete is a destructive
     AdsButton, default weight, behind an AdsAlertDialog with focus
     on Cancel — the accent stays on Save.`,
)
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-3">
      <p class="eyebrow">Artelier UI Kit · MCP server</p>
      <h1 class="ui-kit-mcp__title face-display">Apps built from the kit, not from guesses.</h1>
      <p class="lede measure">
        Ask a model for a screen and it invents class names, props and colours
        that look plausible and do not exist. So the kit has its own MCP
        server, and that is how new studio work starts: the model is handed
        the real thing — every component's schema and source, the tokens and
        the rules, in Vue or in Rust — and builds from nothing else.
      </p>
    </header>

    <ol class="ui-kit-mcp__steps">
      <li v-for="s in steps" :key="s.n" class="card ui-kit-mcp__step">
        <span class="num ui-kit-mcp__n">{{ s.n }}</span>
        <h2 class="h3">{{ s.title }}</h2>
        <p class="body">{{ s.body }}</p>
      </li>
    </ol>

    <section class="stack gap-3" aria-labelledby="mcp-connect">
      <h2 id="mcp-connect" class="h3">How it is wired</h2>
      <p class="body measure">
        The server runs locally over stdio, beside the project it is building.
        It reads the kit from disk on every call, so it can never describe a
        component that has since changed.
      </p>
      <div class="ui-kit-mcp__pair">
        <div class="stack gap-2">
          <span class="ads-label">Claude Code</span>
          <AdsCodeBlock :code="claudeCode" language="sh" />
        </div>
        <div class="stack gap-2">
          <span class="ads-label">Claude Desktop and Cursor</span>
          <AdsCodeBlock :code="clientConfig" language="json" />
        </div>
      </div>
    </section>

    <section class="stack gap-3" aria-labelledby="mcp-conversation">
      <h2 id="mcp-conversation" class="h3">One request, start to finish</h2>
      <AdsCodeBlock :code="conversation" />
    </section>

    <section class="stack gap-3" aria-labelledby="mcp-tools">
      <h2 id="mcp-tools" class="h3">What the model is given</h2>
      <dl class="card ui-kit-mcp__tools">
        <div v-for="t in tools" :key="t.name" class="ui-kit-mcp__tool">
          <dt><code>{{ t.name }}</code></dt>
          <dd class="body">{{ t.does }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.ui-kit-mcp__title {
  max-width: 20ch;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.ui-kit-mcp__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ui-kit-mcp__step {
  display: grid;
  align-content: start;
  gap: var(--sp-2);
}

.ui-kit-mcp__n {
  font-size: 0.78rem;
  color: var(--subdued);
}

.ui-kit-mcp__pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--sp-4);
}

.ui-kit-mcp__tools {
  display: grid;
  margin: 0;
}

.ui-kit-mcp__tool {
  display: grid;
  grid-template-columns: minmax(180px, 220px) 1fr;
  gap: var(--sp-4);
  padding: var(--sp-3) 0;
  border-bottom: 1px solid var(--line);
}

.ui-kit-mcp__tool:last-child {
  border-bottom: 0;
}

.ui-kit-mcp__tool dt code {
  font-size: 0.82rem;
  color: var(--text);
}

.ui-kit-mcp__tool dd {
  margin: 0;
}

@media (max-width: 640px) {
  .ui-kit-mcp__tool {
    grid-template-columns: 1fr;
    gap: var(--sp-1);
  }
}
</style>
