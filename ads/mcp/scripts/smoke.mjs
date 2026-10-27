// Smoke test: start dist/index.js over stdio, call every tool the way a client
// would, and check the facts that matter. Run `npm run build` first.
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { fileURLToPath } from 'node:url'

const server = fileURLToPath(new URL('../dist/index.js', import.meta.url))
const client = new Client({ name: 'artelier-ui-kit-smoke', version: '1.0.0' })
await client.connect(new StdioClientTransport({ command: process.execPath, args: [server], stderr: 'inherit' }))

const failures = []
const lines = []
const check = (ok, what) => {
  if (!ok) failures.push(what)
}

async function call(name, args = {}) {
  const res = await client.callTool({ name, arguments: args })
  const text = res.content?.[0]?.text ?? ''
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }
  return { data, isError: !!res.isError }
}

const tools = (await client.listTools()).tools.map((t) => t.name)
const expected = ['list_components', 'get_component_schema', 'get_design_rules', 'get_setup', 'list_design_tokens', 'get_utility_classes', 'list_icons', 'render_component', 'compose_layout']
for (const t of expected) check(tools.includes(t), `tool ${t} is registered`)
lines.push(`tools: ${tools.length} (${tools.join(', ')})`)

// Vue catalogue
const vue = await call('list_components', { kit: 'vue' })
const comps = (vue.data.components ?? []).filter((c) => !c.cssClass)
check(!vue.isError, 'list_components vue succeeds')
check(comps.length === 118, `118 Vue components (got ${comps.length})`)
const noCat = comps.filter((c) => !c.category).map((c) => c.name)
check(noCat.length === 0, `every Vue component has a category (missing: ${noCat.join(', ')})`)
lines.push(`vue: ${comps.length} components, ${comps.length - noCat.length} with a category`)

// Rust catalogue: errors must be graceful, not crashes.
const rust = await call('list_components', { kit: 'rust' })
if (rust.isError) {
  check(typeof rust.data.error === 'string', 'list_components rust fails gracefully')
  lines.push(`rust: unavailable (${rust.data.error})`)
} else {
  const cov = rust.data.coverage
  lines.push(`rust: ${cov.rustComponents} components; only in Rust: ${cov.onlyInRust.length ? cov.onlyInRust.join(', ') : 'none'}; only in Vue: ${cov.onlyInVue.length ? cov.onlyInVue.join(', ') : 'none'}${rust.data.parseErrors ? `; ${rust.data.parseErrors.length} parse error(s)` : ''}`)
}

// Schemas, both kits.
for (const name of ['AdsButton', 'AdsField', 'AdsAlertDialog', 'KpiRow']) {
  const v = await call('get_component_schema', { name, kit: 'vue' })
  check(!v.isError, `schema ${name} (vue)`)
  check(Array.isArray(v.data.props) && v.data.props.length > 0, `${name} (vue) has props`)
  check(typeof v.data.rule === 'string' && v.data.rule.length > 0, `${name} (vue) has a rule reminder`)
  const r = await call('get_component_schema', { name, kit: 'rust' })
  if (r.isError) check(typeof r.data.error === 'string', `schema ${name} (rust) fails gracefully`)
  else check(typeof r.data.path === 'string' && Array.isArray(r.data.props), `schema ${name} (rust) has a path and props`)
  lines.push(`${name}: vue ${v.data.props?.length ?? 0} props${v.data.usage ? ', example' : ''}; rust ${r.isError ? `error (${r.data.error})` : `${r.data.path}, ${r.data.props.length} props${r.data.usage ? ', example' : ''}, ${r.data.vue?.parity?.inSync ? 'in sync' : 'differs from Vue'}`}`)
}
const field = await call('get_component_schema', { name: 'AdsField' })
check(field.data.props?.find((p) => p.name === 'label')?.required === true, 'AdsField label is required')
const button = await call('get_component_schema', { name: 'AdsButton' })
check(!!button.data.props?.find((p) => p.name === 'destructive'), 'AdsButton has destructive')
const unknown = await call('get_component_schema', { name: 'NoSuchThing' })
check(unknown.isError && typeof unknown.data.error === 'string', 'unknown component is a clean error')

// Rules and setup.
const rules = await call('get_design_rules')
check(!rules.isError && /accent/i.test(rules.data.rules ?? '') && /destructive/i.test(rules.data.rules ?? ''), 'design rules mention the accent and destructive actions')
if (rules.data.notInCss) lines.push(`rules name things not in CSS: ${rules.data.notInCss.join(', ')}`)
for (const kit of ['vue', 'rust']) {
  const s = await call('get_setup', { kit })
  check(!s.isError && Array.isArray(s.data.steps), `get_setup ${kit}`)
}
const setupVue = await call('get_setup', { kit: 'vue' })
check(JSON.stringify(setupVue.data).includes("extends: ['./ads']"), 'vue setup extends ./ads')

// Tokens, utilities, icons.
const tokens = await call('list_design_tokens')
check(!tokens.isError && tokens.data.groups?.length > 0, 'design tokens')
const utils = await call('get_utility_classes')
check(!utils.isError && utils.data.sections?.length > 0, 'utility classes')
const icons = await call('list_icons')
check(!icons.isError && icons.data.vue?.length > 0, 'icons')

// Rendering.
const render = await call('render_component', { name: 'AdsButton' })
check(render.data.ok === true && /<button/.test(render.data.html ?? ''), 'render_component AdsButton renders a button')
check(render.data.classCheck?.ok === true, `AdsButton render uses only kit classes (unknown: ${render.data.classCheck?.unknown?.join(', ')})`)
const custom = await call('render_component', { name: 'AdsButton', props: { variant: 'accent', destructive: true }, slots: { default: 'Delete project' } })
check(custom.data.ok === true, 'render_component with props')
lines.push(`render AdsButton: ok=${render.data.ok}, ${render.data.classCheck?.checked} classes checked; accent+destructive warns: ${custom.data.warnings?.[0] ?? 'no'}`)
const composed = await call('compose_layout', {
  sections: [
    { component: 'KpiRow', props: { stats: [{ value: '1,284', label: 'URLs', delta: '+37', direction: 'up' }] } },
    { component: 'Card', slots: { default: [{ component: 'AdsButton', slots: { default: 'Export CSV' } }] } },
  ],
})
check(composed.data.ok === true, `compose_layout (${composed.data.message ?? ''})`)
lines.push(`compose_layout: ok=${composed.data.ok}, components ${composed.data.components?.join(', ')}`)

await client.close()

console.log(lines.join('\n'))
if (failures.length) {
  console.log(`\nFAILED ${failures.length}:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log('\nsmoke: all checks passed')
