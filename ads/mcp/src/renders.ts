// Representative static HTML for each component, using the real ADS classes.
// render_component inlines the actual CSS (tokens + base + ads + utility) plus
// the component's own scoped styles, then drops this markup into a
// self-contained HTML document.

export type RenderProps = Record<string, unknown>

const icon = (name: string, size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" opacity=".38"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>`

const p = (o: RenderProps, key: string, dflt: string) => (typeof o[key] === 'string' ? (o[key] as string) : dflt)

function btnVariant(o: RenderProps) {
  const v = p(o, 'variant', 'default')
  return v === 'accent' ? 'btn btn-accent' : v === 'quiet' ? 'btn btn-quiet' : 'btn'
}

export function componentHtml(name: string, props: RenderProps = {}): string {
  switch (name) {
    case 'Card':
      return `<div class="card" style="padding:24px"><span class="ads-label">Crawl health</span><span class="num" style="font-size:2rem">98</span><span class="dim">of 100 · unchanged</span></div>`
    case 'Well':
      return `<div class="well" style="padding:16px 20px">A well holds content</div>`
    case 'FrameTab': {
      const items = Array.isArray(props.items) ? (props.items as string[]) : ['Projects', 'Results', 'Issues']
      const active = typeof props.active === 'number' ? (props.active as number) : 1
      return `<div class="seam"><div class="rail">${items
        .map(
          (it, i) =>
            `<span class="row${i === active ? ' is-on' : ''}">${i === active ? '<span class="tab"><i class="fillet top"></i><i class="fillet bottom"></i></span>' : ''}<span class="label">${it}</span></span>`,
        )
        .join('')}</div><div class="frame">The frame</div></div>`
    }

    case 'AdsButton': {
      const label = p(props, 'label', 'Start a project')
      const ic = props.icon ? icon(String(props.icon)) : ''
      return `<button type="button" class="${btnVariant(props)}">${ic}<span>${label}</span></button>`
    }
    case 'AdsIconButton': {
      const nm = String(props.icon ?? 'mail')
      const accent = props.accent ? ' is-accent' : ''
      const round = props.round ? ' is-round' : ''
      return `<button type="button" class="ads-icon-button${accent}${round}" aria-label="${nm}">${icon(nm)}</button>`
    }
    case 'AdsSegmented': {
      const opts = Array.isArray(props.options) ? (props.options as { label: string; value: unknown }[]) : [{ label: '7d', value: '7d' }, { label: '30d', value: '30d' }]
      const val = props.modelValue
      return `<div class="ads-segmented" role="group">${opts
        .map((o) => `<button type="button" class="${o.value === val ? 'is-on' : ''}">${o.label}</button>`)
        .join('')}</div>`
    }
    case 'AdsMenu': {
      const items = Array.isArray(props.items) ? (props.items as { label: string }[]) : [{ label: 'Duplicate' }, { label: 'Rename' }, { label: '---' }, { label: 'Delete' }]
      return `<div class="ads-menu" role="menu">${items
        .map((it) => (it.label === '---' ? '<hr>' : `<button type="button" role="menuitem">${icon('arrow', 14)}<span>${it.label}</span></button>`))
        .join('')}</div>`
    }
    case 'Link':
      return `<p class="body">The ranked plan explains <a class="ads-link" href="#">what to fix first</a>.</p>`
    case 'AdsThemeToggle':
      return `<button type="button" class="ads-icon-button is-round" aria-label="Theme">${icon('theme')}</button>`

    case 'AdsField': {
      const type = p(props, 'type', 'text')
      const label = p(props, 'label', '')
      const hint = p(props, 'hint', '')
      const error = p(props, 'error', '')
      const ph = p(props, 'placeholder', '')
      const inner =
        type === 'textarea'
          ? `<textarea class="ads-field" rows="4" placeholder="${ph}"></textarea>`
          : type === 'select'
            ? `<select class="ads-field"><option>${ph || 'Choose…'}</option></select>`
            : `<input class="ads-field${error ? ' is-invalid' : ''}" type="${type}" placeholder="${ph}">`
      return `<div class="ads-field-group">${label ? `<label class="ads-label">${label}</label>` : ''}${inner}${error ? `<span class="ads-hint">${error}</span>` : hint ? `<span class="ads-hint">${hint}</span>` : ''}</div>`
    }
    case 'AdsNumber':
      return `<div class="ads-number"><input type="number" value="${p(props, 'modelValue', '0')}"><span class="steps"><button type="button">▲</button><button type="button">▼</button></span></div>`
    case 'AdsDaterange':
      return `<div class="ads-daterange"><span>${p(props, 'from', '2026-09-25')}</span><span class="sep">→</span><span>${p(props, 'to', '2026-10-25')}</span></div>`
    case 'AdsChoice': {
      const kind = p(props, 'kind', 'checkbox')
      const label = p(props, 'label', 'I agree')
      const checked = props.modelValue ? ' checked' : ''
      const control =
        kind === 'switch'
          ? `<input type="checkbox"${checked}><span class="ads-switch"></span>`
          : `<input type="${kind}"${checked}><span class="ads-box${kind === 'radio' ? ' is-round' : ''}">${icon('check', 12)}</span>`
      return `<label class="ads-choice">${control}<span>${label}</span></label>`
    }
    case 'AdsRange':
      return `<div class="ads-field-group"><label class="ads-label">${p(props, 'label', 'Concurrency')}</label><input type="range" class="ads-range" min="${props.min ?? 0}" max="${props.max ?? 100}" value="${props.modelValue ?? 50}"></div>`
    case 'AdsTag':
      return `<span class="ads-tag">${p(props, 'label', 'status: 4xx')}<button type="button" aria-label="Remove">×</button></span>`

    case 'AdsStat':
      return `<div class="tile"><span class="eyebrow">${p(props, 'label', 'URLs crawled')}</span><span class="num" style="font-size:1.4rem">${p(props, 'value', '1,284')}${props.unit ? `<span class="unit">${props.unit}</span>` : ''}</span>${props.note ? `<span class="note num">${props.note}</span>` : ''}</div>`
    case 'AdsDelta':
      return `<span class="ads-delta is-${p(props, 'direction', 'flat')}">${p(props, 'value', '0.0%')}</span>`
    case 'AdsBadge':
      return `<span class="ads-badge${props.quiet ? ' is-quiet' : ''}">${p(props, 'value', '5')}</span>`
    case 'AdsStatus':
      return `<span class="ads-status g${props.grade ?? 1}"><span class="ads-dot"></span>${p(props, 'label', 'Healthy')}</span>`
    case 'AdsMeter':
      return `<div class="stack" style="gap:6px"><span class="dim">${p(props, 'label', 'Budget used')}</span><span class="ads-meter"><i style="width:${props.value ?? 68}%"></i>${props.threshold !== undefined ? `<b style="left:${props.threshold}%"></b>` : ''}</span></div>`
    case 'AdsProgress':
      return `<div class="ads-progress"><i style="width:${props.value ?? 46}%"></i></div>`
    case 'ChartChoice':
      return `<div class="choice"><table><thead><tr><th>The data's job</th><th>Form</th><th>What decides it</th></tr></thead><tbody><tr><td>Change over time</td><td>Line, or a sparkline beside the figure</td><td class="dim">Label the first and last value, never every point</td></tr><tr><td>Comparing categories</td><td>Horizontal bars, ordered by value</td><td class="dim">Never a pie — angle is the hardest encoding</td></tr><tr><td>One headline number</td><td>Stat tile with a delta</td><td class="dim">A figure with no comparison is trivia</td></tr></tbody></table></div>`
    case 'AdsBars': {
      const data = Array.isArray(props.data) ? (props.data as { label: string; value: number }[]) : [{ label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 51 }]
      const max = Math.max(...data.map((d) => d.value), 1)
      return `<div class="bars">${data
        .map(
          (d) =>
            `<div class="row"><span class="lab">${d.label}</span><span class="track"><span class="bar" style="width:${(d.value / max) * 100}%;opacity:${0.35 + (d.value / max) * 0.65}"></span></span><span class="num val">${d.value}</span></div>`,
        )
        .join('')}</div>`
    }
    case 'AdsSparkline': {
      const pts = Array.isArray(props.points) ? (props.points as number[]) : [12, 19, 15, 24, 31, 27, 38]
      const w = 240
      const h = 64
      const min = Math.min(...pts)
      const max = Math.max(...pts)
      const span = max - min || 1
      const step = w / (pts.length - 1)
      const coords = pts.map((v, i) => [i * step, h - 4 - ((v - min) / span) * (h - 8)])
      const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
      return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="display:block;width:100%;height:64px;color:var(--text)"><path d="${line}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
    }
    case 'AdsGauge': {
      const v = Number(props.value ?? 64)
      return `<svg viewBox="0 0 128 128" style="width:170px;height:170px"><circle cx="64" cy="64" r="54" fill="var(--raised)" stroke="var(--canvas)" stroke-width="7"/><path d="M28 80 A54 54 0 0 1 100 80" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(v / 100) * 260} 260" transform="rotate(140 64 64)"/><text x="64" y="66" text-anchor="middle" font-family="var(--mono)" font-size="24" fill="var(--text)">${v}%</text></svg>`
    }
    case 'AdsHeatmap': {
      const cols = Number(props.cols ?? 16)
      const rows = Number(props.rows ?? 5)
      let cells = ''
      for (let y = 0; y < rows; y++) {
        cells += '<div class="heat-row">'
        for (let x = 0; x < cols; x++) {
          const v = Math.round(((Math.sin(x / 3.1 + y / 1.7) * 0.5 + 0.5) * 0.65 + (Math.sin((x * 7 + y * 13) / 11) * 0.5 + 0.5) * 0.35) * 4)
          cells += `<span class="cell" style="opacity:${(0.08 + v * 0.22).toFixed(2)}"></span>`
        }
        cells += '</div>'
      }
      return `<div class="heat">${cells}</div>`
    }
    case 'AdsDataGrid': {
      const cols = Array.isArray(props.columns) ? (props.columns as { key: string; label: string }[]) : [{ key: 'name', label: 'Page' }, { key: 'views', label: 'Views' }]
      const rows = Array.isArray(props.rows) ? (props.rows as Record<string, string | number>[]) : [{ name: '/overview', views: 18240 }, { name: '/pricing', views: 9312 }]
      return `<div class="grid-wrap"><table><thead><tr>${cols.map((c) => `<th><button type="button">${c.label}<span class="caret">↑</span></button></th>`).join('')}</tr></thead><tbody>${rows
        .map((r) => `<tr>${cols.map((c) => `<td class="num">${r[c.key]}</td>`).join('')}</tr>`)
        .join('')}</tbody></table></div>`
    }
    case 'AdsDl': {
      const items = Array.isArray(props.items) ? (props.items as { term: string; value: string | number }[]) : [{ term: 'Status', value: '200 · indexable' }]
      return `<dl class="ads-dl">${items.map((it) => `<dt>${it.term}</dt><dd>${it.value}</dd>`).join('')}</dl>`
    }

    case 'AdsAccordion': {
      const items = Array.isArray(props.items) ? (props.items as { title: string; body: string }[]) : [{ title: 'Why this page ranks eighth', body: '371 pages share near-duplicate content.' }]
      return `<div class="ads-accordion">${items
        .map((it, i) => `<details${i === 0 ? ' open' : ''}><summary>${it.title}</summary><div class="panel">${it.body}</div></details>`)
        .join('')}</div>`
    }
    case 'AdsDrawer':
      return `<div class="ads-drawer"><div><span class="ads-label">Results</span><p class="body">The grid stays where it is.</p></div><div class="panel"><dl class="ads-dl"><dt>Code</dt><dd>200</dd><dt>Words</dt><dd>1,286</dd></dl></div></div>`
    case 'AdsPopover':
      return `<div class="ads-popover"><span class="ads-label">${p(props, 'label', 'Link score')}</span><span class="body">${p(props, 'body', 'A 0–100 measure of internal link value.')}</span></div>`
    case 'AdsTree': {
      const nodes = Array.isArray(props.nodes) ? (props.nodes as { label: string; count?: number }[]) : [{ label: '/', count: 1284 }]
      return `<ul class="ads-tree">${nodes.map((n) => `<li><span>${n.label}${n.count !== undefined ? `<span class="count">${n.count}</span>` : ''}</span></li>`).join('')}</ul>`
    }
    case 'AdsSteps': {
      const steps = Array.isArray(props.steps) ? (props.steps as { label: string; state?: string }[]) : [{ label: 'Configure', state: 'done' }, { label: 'Crawl', state: 'done' }, { label: 'Audit', state: 'now' }]
      return `<ol class="ads-steps">${steps
        .map((s, i) => `<li class="${s.state === 'done' ? 'is-done' : s.state === 'now' ? 'is-now' : ''}"><span class="pip">${s.state === 'done' ? '✓' : i + 1}</span>${s.label}</li>`)
        .join('')}</ol>`
    }

    case 'AdsTabs': {
      const tabs = Array.isArray(props.tabs) ? (props.tabs as { label: string; value: unknown }[]) : [{ label: 'Internal', value: 'internal' }, { label: 'External', value: 'external' }]
      const val = props.modelValue
      return `<div class="ads-tabs" role="tablist">${tabs.map((t) => `<button type="button" class="${t.value === val ? 'is-on' : ''}">${t.label}</button>`).join('')}</div>`
    }
    case 'AdsCrumbs':
      return `<nav class="ads-crumbs"><a href="#">Projects</a><span class="sep">/</span><a href="#">Results</a><span class="sep">/</span><span aria-current="page">Response codes</span></nav>`
    case 'AdsPager':
      return `<div class="ads-pager"><button type="button">←</button><button type="button" class="is-on">1</button><button type="button">2</button><button type="button">3</button><button type="button">→</button></div>`

    case 'AdsEmpty':
      return `<div class="ads-empty"><span class="glyph">${icon(props.icon ? String(props.icon) : 'chart', 20)}</span><h4>${p(props, 'title', 'No crawls yet')}</h4><p>${p(props, 'body', 'Results appear here once a crawl has finished.')}</p><button type="button" class="btn btn-accent">${icon('plus', 16)}<span>New crawl</span></button></div>`
    case 'AdsSkeleton':
      return `<div class="stack" style="gap:10px"><div class="ads-skeleton" style="height:13px;width:34%"></div><div class="ads-skeleton" style="height:30px;width:58%"></div><div class="ads-skeleton" style="height:13px;width:80%"></div></div>`
    case 'AdsLoading':
      return `<span class="ads-inline-load"><span class="ads-spinner"></span>${p(props, 'text', 'Recrawling 311 URLs…')}</span>`
    case 'AdsBanner':
      return `<div class="ads-banner"><span class="glyph">${icon(props.icon ? String(props.icon) : 'alert', 16)}</span><span>${p(props, 'text', 'This crawl is 14 days old.')}</span></div>`
    case 'AdsToastHost':
      return `<div class="ads-toast">${icon('check', 15)}<span>Export finished · 733 rows</span></div>`
    case 'AdsTooltip':
      return `<span class="ads-tooltip">${p(props, 'text', 'Internal links pointing here')}</span>`
    case 'AdsModal':
      return `<div class="ads-scrim"><div class="ads-modal"><span class="ads-label">Confirm</span><h4 style="margin:8px 0">${p(props, 'title', 'Delete this project?')}</h4><p class="body">This cannot be undone.</p><div style="display:flex;gap:10px;margin-top:16px"><button type="button" class="btn">Delete project</button><button type="button" class="btn btn-quiet">Cancel</button></div></div></div>`

    case 'KpiRow': {
      const stats = Array.isArray(props.stats) ? (props.stats as { value: string | number; label: string; unit?: string; note?: string }[]) : [{ value: '1,284', label: 'URLs', note: '+37' }, { value: '98', label: 'Health', note: 'of 100' }, { value: '74', label: 'Median', unit: 'ms', note: '−12%' }, { value: '23', label: 'Issues', note: '4 critical' }]
      return `<div class="kpis">${stats
        .map(
          (s) =>
            `<div class="tile"><span class="eyebrow">${s.label}</span><span class="num" style="font-size:1.4rem">${s.value}${s.unit ? `<span class="unit">${s.unit}</span>` : ''}</span>${s.note ? `<span class="note num">${s.note}</span>` : ''}</div>`,
        )
        .join('')}</div>`
    }
    case 'FilterBar':
      return `<div class="stack" style="gap:12px"><div class="bar"><div class="ads-search">${icon('compass', 15)}<input class="ads-field" type="search" placeholder="${p(props, 'placeholder', 'Filter by URL…')}"></div><div class="ads-daterange"><span>30d</span><span class="sep">→</span><span>now</span></div></div><div class="saved"><span class="ads-label">Saved</span><span class="ads-tag">Exec summary<button type="button">×</button></span></div></div>`
    case 'TableScreen':
      return `<div class="card" style="gap:16px;padding:22px"><div style="display:flex;justify-content:space-between;align-items:center"><div><h4 style="font-family:var(--font-display);font-size:1.1rem">${p(props, 'title', 'Results')}</h4><span class="dim num">${p(props, 'count', '733 rows')}</span></div><button type="button" class="btn btn-accent">Export CSV</button></div><div class="ads-tabs"><button type="button" class="is-on">Internal</button><button type="button">External</button></div><div class="grid-wrap"><table><thead><tr><th><button type="button">URL</button></th><th><button type="button">Code</button></th></tr></thead><tbody><tr><td class="num">/overview</td><td class="num">200</td></tr><tr><td class="num">/pricing</td><td class="num">404</td></tr></tbody></table></div></div>`
    case 'SummaryDetail':
      return `<ol class="ladder"><li class="rung"><span class="n">1</span><p class="body"><strong>Answer.</strong> One ranked list.</p></li><li class="rung"><span class="n">2</span><p class="body"><strong>Reasoning.</strong> Why this ranks first.</p></li><li class="rung"><span class="n">3</span><p class="body"><strong>Evidence.</strong> The grid, filtered, with the filter visible as a tag.</p></li></ol>`

    case 'DocShell':
      return `<div class="docs"><aside class="side"><div class="docs-nav"><span class="eyebrow">Getting started</span><a class="on">Installing</a><a>Your first crawl</a></div></aside><div class="main"><p class="body">The reading column.</p></div></div>`
    case 'DocNav':
      return `<nav class="docs-nav"><a class="home">Help centre</a><div class="group"><span class="eyebrow">Getting started</span><a class="on">Installing</a><a>Your first crawl</a></div></nav>`
    case 'Callout': {
      const t = p(props, 'type', 'note')
      const label = t === 'tip' ? 'Tip' : t === 'warning' ? 'Heads up' : 'Note'
      const tone = t === 'tip' ? 'var(--ok)' : t === 'warning' ? 'var(--warn)' : 'var(--accent)'
      return `<aside class="callout" style="--tone:${tone}"><span class="label">${icon(t === 'warning' ? 'alert' : 'check', 13)}${label}</span><div class="body">A docs callout.</div></aside>`
    }
    case 'AppWindow':
      return `<figure class="window"><div class="chrome"><span></span><span></span><span></span></div><div class="pane" style="aspect-ratio:${Number(props.width ?? 1440)}/${Number(props.height ?? 900)};display:grid;place-items:center;color:var(--subdued)">${p(props, 'alt', 'Screenshot')}</div></figure>`
    case 'Screenshot':
      return `<figure class="shot"><figure class="window"><div class="chrome"><span></span><span></span><span></span></div><div class="pane" style="aspect-ratio:16/9;display:grid;place-items:center;color:var(--subdued)">${p(props, 'alt', 'Screenshot')}</div></figure>${props.caption ? `<figcaption>${props.caption}</figcaption>` : ''}</figure>`

    case 'SiteNav':
      return `<header class="nav" style="position:static"><div class="bar" style="max-width:none;display:flex;justify-content:space-between;align-items:center;height:64px;padding:0 24px"><span style="display:inline-flex;align-items:center;gap:10px;font-weight:600"><span style="width:28px;height:28px;border-radius:9px;background:var(--raised);box-shadow:var(--soft-raised-sm);display:grid;place-items:center"><span style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></span></span>Artelier</span><span style="display:flex;gap:8px"><span class="btn btn-accent btn-sm">Start a project</span></span></div></header>`
    case 'SiteFooter':
      return `<footer style="padding:48px 24px;border-top:1px solid var(--line)"><div style="display:flex;gap:48px;flex-wrap:wrap"><span style="font-weight:600">Artelier</span><nav style="display:grid;gap:8px"><span class="eyebrow">Product</span><a class="ads-link">Features</a><a class="ads-link">Pricing</a></nav></div><div style="margin-top:32px;color:var(--subdued);font-size:.85rem">© 2026 Artelier</div></footer>`
    case 'HeroSection':
      return `<section style="padding:64px 24px;text-align:center;display:grid;gap:20px;justify-items:center"><p class="eyebrow">${p(props, 'eyebrow', 'Studio')}</p><h1 style="font-family:var(--font-display);font-size:clamp(2.4rem,6vw,4rem);font-weight:600;letter-spacing:-.03em;line-height:1.02">${p(props, 'title', 'The dashboard your users live in')}</h1><p class="lede" style="max-width:640px">${p(props, 'lead', 'Grey chrome, coloured data.')}</p><div style="display:flex;gap:12px"><span class="btn btn-accent">Start a project</span><span class="btn">See the dashboard</span></div></section>`
    case 'ContentSection':
      return `<section style="padding:56px 24px;display:grid;gap:28px;max-width:1080px;margin:auto"><header style="display:grid;gap:12px"><p class="eyebrow">${p(props, 'eyebrow', 'Why')}</p><h2 style="font-size:clamp(1.9rem,4vw,2.6rem);letter-spacing:-.028em">${p(props, 'title', 'A system, not a style guide')}</h2></header><div class="card" style="padding:24px">Content</div></section>`
    case 'ImageSection':
      return `<section style="padding:56px 24px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1080px;margin:auto"><div style="display:grid;gap:16px"><p class="eyebrow">${p(props, 'eyebrow', 'Soft UI')}</p><h2 style="font-size:clamp(1.9rem,4vw,2.6rem)">${p(props, 'title', 'Depth is the only decoration')}</h2><p class="body">${p(props, 'body', '')}</p></div><figure style="margin:0;padding:24px;border-radius:26px;background:var(--raised);box-shadow:var(--soft-raised)">Visual</figure></section>`
    case 'FeatureGrid': {
      const feats = Array.isArray(props.features) ? (props.features as { icon: string; title: string; body: string }[]) : [{ icon: 'gauge', title: 'Grey chrome', body: 'Give the data the channel.' }, { icon: 'layers', title: 'Depth only', body: 'Two shadows are the whole decoration.' }, { icon: 'table', title: 'Monospaced numbers', body: 'Columns scan downward.' }]
      return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">${feats
        .map(
          (f) =>
            `<article class="card" style="display:grid;gap:10px;padding:24px"><span style="width:44px;height:44px;border-radius:14px;background:var(--surface);box-shadow:var(--soft-inset-sm);display:grid;place-items:center;color:var(--text-soft)">${icon(f.icon, 20)}</span><h3 style="font-size:1.05rem">${f.title}</h3><p class="body">${f.body}</p></article>`,
        )
        .join('')}</div>`
    }
    case 'LogoMarquee':
      return `<div style="display:flex;flex-wrap:wrap;gap:16px 40px;justify-content:center"><span class="wordmark">Northwind</span><span class="wordmark">Vantage</span><span class="wordmark">Halo</span></div>`
    case 'PricingSection':
      return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px"><article class="card" style="display:grid;gap:12px;padding:26px"><h3>Starter</h3><div><span class="num" style="font-size:2rem">$0</span></div><p class="body">For trying the kit.</p><button type="button" class="btn">Start free</button></article><article class="card" style="display:grid;gap:12px;padding:26px"><h3>Studio</h3><div><span class="num" style="font-size:2rem">$49</span><span class="dim">/mo</span></div><p class="body">For shipping dashboards.</p><button type="button" class="btn btn-accent">Start a project</button></article></div>`
    case 'FaqSection':
      return `<div class="ads-accordion"><details open><summary>Why is the chrome grey?</summary><div class="panel">So colour means something when it appears.</div></details><details><summary>What is soft UI?</summary><div class="panel">Shape from two shadows on a matching surface.</div></details></div>`
    case 'CtaBand':
      return `<section class="card" style="padding:48px;display:grid;justify-items:center;text-align:center;gap:16px"><h2 style="font-size:clamp(1.9rem,4vw,2.6rem)">${p(props, 'title', 'Build the dashboard your users live in')}</h2><p class="body" style="max-width:540px">${p(props, 'body', 'A monochrome soft-UI kit for Nuxt.')}</p><span class="btn btn-accent">${p(props, 'ctaLabel', 'Start a project')}</span></section>`
    case 'ContactForm':
      return `<form style="display:grid;gap:18px;max-width:560px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div class="ads-field-group"><label class="ads-label">First name</label><input class="ads-field"></div><div class="ads-field-group"><label class="ads-label">Last name</label><input class="ads-field"></div></div><div class="ads-field-group"><label class="ads-label">Email</label><input class="ads-field" type="email"></div><div class="ads-field-group"><label class="ads-label">Message</label><textarea class="ads-field" rows="4"></textarea></div><label class="ads-choice"><input type="checkbox"><span class="ads-box">${icon('check', 12)}</span><span>I agree to the privacy policy.</span></label><button type="submit" class="btn btn-accent" style="width:100%">Let's talk</button></form>`

    case 'BrandMark':
      return `<span style="display:inline-flex;align-items:center;gap:10px;color:var(--text)"><span style="width:34px;height:34px;border-radius:11px;background:var(--raised);box-shadow:var(--soft-raised-sm);display:grid;place-items:center"><span style="width:9px;height:9px;border-radius:50%;background:var(--accent)"></span></span><span style="font-family:var(--font-display);font-weight:600">Artelier</span></span>`
    case 'Icon':
      return icon(String(props.name ?? 'grid'), Number(props.size ?? 20))

    default:
      return `<p class="body">No static preview for "${name}" — use get_component_schema for its source.</p>`
  }
}
