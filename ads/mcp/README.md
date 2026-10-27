# ADS — MCP Server

An [MCP](https://modelcontextprotocol.io) server for the Artelier Design
System UI kit. It turns the component library into a queryable protocol, so an
LLM (Cursor, Claude Desktop, or any MCP client) composes from the real schema
instead of hallucinating class names, props or colours.

```
┌──────────────┐  MCP request  ┌─────────────────────┐
│  MCP client  │ ─────────────> │   artelier-ads      │
│  (IDE / LLM) │ <───────────── │   (this server)     │
└──────────────┘  component data└─────────────────────┘
```

## Tools

| Tool | Returns |
| --- | --- |
| `list_categories` | The component categories, in the design system's order |
| `list_components` | Every component: name, category, description (optional category filter) |
| `get_component_schema` | Full schema for one component: props (name/type/default/description), slots, emits, usage example, and the complete `.vue` source |
| `list_design_tokens` | All tokens, grouped (surfaces, text, accent, brand, semantic, grade, elevation, radius, spacing, typography, motion, layout, categorical/sequential/diverging palettes) |
| `get_utility_classes` | The utility-class vocabulary (paint-\*, ink-\*, lift/press, round-\*, spacing, layout, type) |
| `list_icons` | The icon names for the `Icon` component |
| `render_component` | A **self-contained HTML document** for one component: the real ADS CSS inlined + the component's own styles, with the given props applied |
| `compose_layout` | Stacks multiple `{ component, props }` blocks into one self-contained HTML screen (auto-composition) |

## Run it

```bash
cd ADS/mcp
npm install
npm run build        # tsc → dist/
node dist/index.js   # speaks MCP over stdio
```

Register it with an MCP client by pointing at `node /path/to/ADS/mcp/dist/index.js`.

## Example conversation

> **You:** "Build a KPI row with a filter bar and a results table."
>
> The client calls `list_components`, then `get_component_schema(name: "KpiRow")`,
> `get_component_schema(name: "FilterBar")`, `get_component_schema(name: "TableScreen")`,
> and emits code that uses only the props those schemas define.

## Layout

- `src/catalog.ts` — the component catalog (single source of truth).
- `src/tokens.ts` — the design tokens, grouped and described.
- `src/renders.ts` — representative static HTML per component, for previews.
- `src/html.ts` — builds the self-contained HTML documents (inlines the real CSS).
- `src/index.ts` — the MCP server and its tools.

Keep `catalog.ts` in step with `../app/components/` when you add a component.
