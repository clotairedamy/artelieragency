// The UI Kit's docs: which kits there are and their categories. A site that
// shows the docs reads this to build its own navigation for them.
export default defineAppConfig({
  // The Artelier UI Kit's docs under /ui-kit: the same categories for both
  // kits, so switching kit keeps you on the category you were reading. They
  // fill the rail on those pages; `tab` picks the phone tab bar's three.
  docs: {
    kits: [
      {
        to: '/ui-kit',
        label: 'Vue',
        name: 'Artelier UI Kit for Vue',
        icon: 'system',
        categories: [
          { to: '/ui-kit', label: 'Overview', icon: 'dashboard', tab: true },
          { to: '/ui-kit/mcp', label: 'MCP server', short: 'MCP', icon: 'signal', tab: true },
          { to: '/ui-kit/all', label: 'All components', short: 'All', icon: 'grid', tab: true },
          { to: '/ui-kit/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/ui-kit/actions', label: 'Actions', icon: 'plus' },
          { to: '/ui-kit/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/ui-kit/data-display', label: 'Data display', icon: 'chart' },
          { to: '/ui-kit/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/ui-kit/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/ui-kit/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/ui-kit/patterns', label: 'Patterns', icon: 'check' },
          { to: '/ui-kit/elements', label: 'Elements', icon: 'spark' },
          { to: '/ui-kit/sections', label: 'Page sections', icon: 'layers' },
          { to: '/ui-kit/docs', label: 'Docs', icon: 'code' },
        ],
      },
      {
        to: '/ui-kit/rust',
        label: 'Rust',
        name: 'Artelier UI Kit for Rust',
        icon: 'engine',
        categories: [
          { to: '/ui-kit/rust', label: 'Overview', icon: 'dashboard', tab: true },
          { to: '/ui-kit/rust/mcp', label: 'MCP server', short: 'MCP', icon: 'signal', tab: true },
          { to: '/ui-kit/rust/all', label: 'All components', short: 'All', icon: 'grid', tab: true },
          { to: '/ui-kit/rust/surfaces', label: 'Surfaces', icon: 'compass' },
          { to: '/ui-kit/rust/actions', label: 'Actions', icon: 'plus' },
          { to: '/ui-kit/rust/inputs', label: 'Inputs', icon: 'sliders' },
          { to: '/ui-kit/rust/data-display', label: 'Data display', icon: 'chart' },
          { to: '/ui-kit/rust/disclosure', label: 'Disclosure', icon: 'flow' },
          { to: '/ui-kit/rust/navigation', label: 'Navigation', icon: 'arrow' },
          { to: '/ui-kit/rust/feedback', label: 'Feedback', icon: 'alert' },
          { to: '/ui-kit/rust/patterns', label: 'Patterns', icon: 'check' },
          { to: '/ui-kit/rust/elements', label: 'Elements', icon: 'spark' },
          { to: '/ui-kit/rust/sections', label: 'Page sections', icon: 'layers' },
          { to: '/ui-kit/rust/docs', label: 'Docs', icon: 'code' },
        ],
      },
    ],
  },
})
