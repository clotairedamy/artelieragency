# artelier-ui-kit — MCP server

An [MCP](https://modelcontextprotocol.io) server for the Artelier UI Kit, in
both its Vue and Rust (Dioxus) forms.

The selling point is that it holds no copy of the kit. Every answer is read
from the kit's source when the tool is called: the Vue single-file components,
the Rust `#[component]` functions, the CSS and the documentation pages. A model
that asks for a component's props gets the props the file declares today, and
a render is the markup the component emits today. When the kit changes, the
server's answers change with it; there is nothing to regenerate.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `list_categories` | none | The component categories, in the kit's order, with a note on each |
| `list_components` | `kit` (`vue` or `rust`, default `vue`), `category` | Every component with its category and description; for Rust, its module path |
| `get_component_schema` | `name`, `kit` (default `vue`), `includeSource` | Props (type, required, default, description), models, emits, slots, referenced types, a usage example from the docs, a one-line design rule, and how the Vue and Rust versions differ |
| `get_design_rules` | `topic` (optional) | The kit's design rules (colour, depth, accent, numbers, status, tokens, type, accessibility, motion, charts, patterns, class naming), with a check that every token and class they name exists in the CSS |
| `get_setup` | `kit` (required) | Step-by-step setup for a Vue (Nuxt layer) or Rust (Dioxus crate) project, read from the kit's `package.json`, `nuxt.config.ts` and `Cargo.toml` |
| `list_design_tokens` | `group` (optional) | The CSS custom properties with their light and dark values, grouped and described |
| `get_utility_classes` | none | The utility classes, grouped by the sections of `ads-utility.css`, plus the base classes |
| `list_icons` | none | Icon names for `Icon`, and any that exist in only one kit |
| `render_component` | `name`, `props`, `slots`, `theme`, `kit` | A self-contained HTML page of one component, rendered by the kit itself |
| `compose_layout` | `sections`, `title`, `theme` | Several components rendered together as one HTML page |

## How it works

**Vue props.** Each `.vue` file in `ads/app/components/` is parsed with the
TypeScript compiler API. Props come from the `defineProps<{…}>()` type, so
required or optional is exactly what the type says; defaults come from
`withDefaults`; models from `defineModel`; events from `defineEmits`; slots
from the `<slot>` tags in the template. The header comment at the top of the
script is the component's description, and a comment on a prop is that prop's
description. `src/catalog.ts` holds only the category of each component and a
few curated descriptions.

**Rust props.** The Rust crate is read from source as well. Every
`#[component]` function gives a component, its module path (for example
`ads::ui::AdsButton`), its props with their types and whether they are
optional, the enums they use, its doc comment and its source. Nothing about
the Rust API is written into this server.

**Vue and Rust compared.** With `kit: "rust"`, a schema lists where the two
versions differ: props missing on one side, props whose required-ness differs,
slots with no Rust equivalent. Props renamed because their Vue name is a Rust
keyword (`type` becomes `button_type`) are reported as renames, not
differences. `list_components` with `kit: "rust"` also lists components that
exist in only one kit.

**Examples.** Usage examples come from the documentation pages
(`<ComponentDoc>` blocks for Vue, `<RustDoc>` blocks and the `RUST_USAGE` map
for Rust), so they match what the site shows. Where a docs page's props table
disagrees with the component, the schema says so.

**Renders.** `render_component` and `compose_layout` compile the real SFCs for
server rendering and run them with small stand-ins for the Nuxt runtime. The
page inlines the kit's CSS and the styles of the components used, and every
class in the output is checked against that CSS. A component that renders
nothing on the server (a closed dialog, a chart drawn in the browser) returns a
plain "no static render" message pointing at its schema, not invented markup.
Rust components are not rendered; the Vue render is their visual reference,
since both kits emit the same classes.

## Setup

Build it once:

```bash
cd ads/mcp
npm install
npm run build
```

The server runs over stdio. Use an absolute path to `dist/index.js` in each
client.

### Claude Code

```bash
claude mcp add artelier-ui-kit -- node /abs/path/ads/mcp/dist/index.js
```

### Claude Desktop

In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "artelier-ui-kit": {
      "command": "node",
      "args": ["/abs/path/ads/mcp/dist/index.js"]
    }
  }
}
```

### Cursor

In `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "artelier-ui-kit": {
      "command": "node",
      "args": ["/abs/path/ads/mcp/dist/index.js"]
    }
  }
}
```

### Paths

The server finds the kit relative to its own location (`ads/mcp/dist`). To
point it elsewhere, set:

| Variable | Default | Meaning |
| --- | --- | --- |
| `ARTELIER_ADS_ROOT` | `ads/` | The Vue kit (Nuxt layer) |
| `ARTELIER_REPO_ROOT` | the parent of `ads/` | The site, where the docs pages live |
| `ARTELIER_ADS_RS` | `ads/ads-rs/` | The Rust kit (Dioxus crate) |

## Example conversation

> **You:** Add a settings page to my Dioxus app with a name field, a save
> button and a warning banner.
>
> The model calls `get_setup(kit: "rust")` to check the crate is wired in,
> then `get_component_schema` with `kit: "rust"` for `AdsField`, `AdsButton`
> and `AdsBanner`. It gets each component's path (`ads::ui::AdsField`), its
> props and enums, and a usage example from the docs. It calls
> `get_design_rules(topic: "status")` before choosing the banner's tone, and
> writes RSX that uses only those props.
>
> **You:** Show me what it will look like.
>
> The model calls `compose_layout` with the same three components. The Rust
> kit emits the same classes as the Vue kit, so the Vue render is an accurate
> preview.

## Development

```bash
npm run typecheck   # tsc --noEmit
npm run build       # tsc → dist/
npm run smoke       # starts dist/index.js and calls every tool
```

Source layout:

- `src/index.ts`: the tools.
- `src/vue.ts`, `src/rust.ts`: read the two kits.
- `src/docs.ts`: reads the documentation pages.
- `src/catalog.ts`: categories and curated descriptions.
- `src/rules.ts`, `src/setup.ts`, `src/tokens.ts`, `src/extras.ts`: rules, setup, tokens, utility classes and icons.
- `src/render.ts`, `src/html.ts`: server rendering and the HTML page.
